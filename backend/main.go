package main

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // El guion bajo es necesario para registrar el driver
)

func main() {
	// 1. Definimos los datos de conexión (los mismos que pusimos en el docker-compose.yml)
	host := "localhost"
	port := 5432
	user := "user_padel"
	password := "password_padel"
	dbname := "padel_db"

	// 2. Creamos la cadena de conexión (Connection String)
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// 3. Intentamos abrir la conexión
	db, err := sqlx.Connect("postgres", psqlInfo)
	if err != nil {
		log.Fatalln("Error al conectar a la base de datos:", err)
	}

	// 4. Cerramos la conexión al terminar la función
	defer db.Close()

	// 5. Probamos si realmente hay comunicación
	err = db.Ping()
	if err != nil {
		log.Fatalln("La base de datos no responde:", err)
	}

	fmt.Println("¡Conexión exitosa a PostgreSQL desde Go! 🎾")
}
