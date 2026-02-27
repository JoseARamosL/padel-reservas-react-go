package models

type User struct {
	ID           int    `json:"id" db:"id"`
	Email        string `json:"email" db:"email"`
	PasswordHash string `json:"-" db:"password_hash"` // El guion "-" es vital: evita que la contraseña viaje al JSON
	Role         string `json:"role" db:"role"`
	Name         string `json:"name" db:"name"`
}
