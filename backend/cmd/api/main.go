package main

import (
	"log"

	"github.com/JoseARamosL/padel-reservas/internal/handlers"
	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	// 1. Configuración de conexión
	connStr := "host=localhost port=5432 user=user_padel password=password_padel dbname=padel_db sslmode=disable"

	// 2. Conectar a la base de datos
	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
	defer db.Close()

	// 3. Inyección de dependencias
	courtRepo := repository.NewCourtRepository(db)
	courtHandler := handlers.NewCourtHandler(courtRepo)

	// 4. Configurar Router
	router := gin.Default()
	router.GET("/courts", courtHandler.GetCourts)

	// 5. Levantar el servidor
	log.Println("🚀 Servidor corriendo en http://localhost:8080")
	router.Run(":8080")
}
