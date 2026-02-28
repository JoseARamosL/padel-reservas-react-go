package main

import (
	"log"
	"os"
	"path/filepath"
	"runtime"

	"github.com/JoseARamosL/padel-reservas/internal/handlers"
	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func runMigrations(db *sqlx.DB) {
	// Calcular la ruta: estamos en cmd/api/, queremos ir a ../../schema.sql
	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)
	schemaPath := filepath.Join(dir, "..", "..", "schema.sql")

	schema, err := os.ReadFile(schemaPath)
	if err != nil {
		log.Fatalf("No se pudo leer el archivo de schema en %s: %v", schemaPath, err)
	}

	_, err = db.Exec(string(schema))
	if err != nil {
		log.Fatalf("Error al ejecutar las migraciones: %v", err)
	}
	log.Println("✅ Migraciones ejecutadas correctamente.")
}

func main() {
	// 1. Obtener la ruta del archivo actual (main.go)
	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	// 2. Cargar el archivo .env ubicado en la misma carpeta que main.go
	envPath := filepath.Join(dir, ".env")
	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatalf("Error crítico: No se pudo cargar el archivo .env en %s", envPath)
	}

	// Leer la variable
	connStr := os.Getenv("DB_URL")
	if connStr == "" {
		log.Fatal("La variable DB_URL no está definida en el .env")
	}

	// 3. Conectar a la base de datos
	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
	defer db.Close()

	// 4. Ejecutar migraciones automáticamente
	runMigrations(db)

	// 5. Inyección de dependencias
	courtRepo := repository.NewCourtRepository(db)
	courtHandler := handlers.NewCourtHandler(courtRepo)

	userRepo := repository.NewUserRepository(db)
	authHandler := handlers.NewAuthHandler(userRepo)

	reservationRepo := repository.NewReservationRepository(db)
	reservationHandler := handlers.NewReservationHandler(reservationRepo)

	// 6. Configurar Router
	router := gin.Default()
	router.GET("/courts", courtHandler.GetCourts)
	router.POST("/login", authHandler.Login)
	router.GET("/reservations", reservationHandler.GetReservations)
	router.GET("/api/reservations/availability", reservationHandler.GetAvailability)

	// 7. Levantar el servidor
	log.Println("🚀 Servidor corriendo en http://localhost:8080")
	router.Run("0.0.0.0:8080")
}
