package models

type User struct {
	ID           int    `db:"id"`
	Email        string `db:"email"`
	PasswordHash string `db:"password_hash"`
	Role         string `db:"role"`
	Name         string `db:"name"`
	Phone        string `db:"phone"`
}
