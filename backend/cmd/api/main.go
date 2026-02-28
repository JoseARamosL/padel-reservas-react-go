package main

import (
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/JoseARamosL/padel-reservas/internal/handlers"
	"github.com/JoseARamosL/padel-reservas/internal/middleware"
	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {

	// 1. Obtener la ruta del archivo actual (main.go)
	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename) // Esto es /.../padel-reservas/backend/cmd/api/

	// 2. Unir esa ruta con el nombre del archivo
	envPath := filepath.Join(dir, ".env")

	// 3. Cargar el archivo .env explícitamente
	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatalf("Error crítico: No se pudo cargar el archivo .env en %s", envPath)
	}

	// Leer la variable
	connStr := os.Getenv("DB_URL")
	if connStr == "" {
		log.Fatal("La variable DB_URL no está definida en el .env")
	}

	// 2. Conectar a la base de datos
	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
	defer db.Close()

	// 3. Inyección de dependencias
	courtRepo := repository.NewCourtRepository(db)
	courtHandler := handlers.NewCourtHandler(courtRepo)

	userRepo := repository.NewUserRepository(db)
	authHandler := handlers.NewAuthHandler(userRepo)

	reservationRepo := repository.NewReservationRepository(db)
	reservationHandler := handlers.NewReservationHandler(reservationRepo)

	// 4. Configurar Router
	router := gin.Default()
	router.GET("/courts", courtHandler.GetCourts)

	router.POST("/login", authHandler.Login)

	// Todas las peticiones a reservas pasan por aquí
	// Si tienen token, el userID estará en el contexto
	// Si no tienen, el userID no estará (será nil/no existirá)
	router.POST("/reservations", middleware.OptionalAuthMiddleware(), reservationHandler.Create)

	router.GET("/reservations", reservationHandler.GetReservations)

	router.GET("/api/reservations/availability", reservationHandler.GetAvailability)

	// 5. Levantar el servidor
	log.Println("🚀 Servidor corriendo en http://localhost:8080")
	router.Run("0.0.0.0:8080")
}
