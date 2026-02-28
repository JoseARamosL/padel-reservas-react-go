package models

type User struct {
	ID           int     `json:"id" db:"id"`
	Email        string  `json:"email" db:"email"`
	PasswordHash string  `json:"-" db:"password_hash"`
	Role         string  `json:"role" db:"role"`
	Name         *string `json:"name" db:"name"` // Usamos puntero porque puede ser NULL
	Surnames     *string `json:"surnames" db:"surnames"`
	Phone        *string `json:"phone" db:"phone"`
}
