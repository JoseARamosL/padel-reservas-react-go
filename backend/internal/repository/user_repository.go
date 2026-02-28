package repository

import (
	"github.com/JoseARamosL/padel-reservas/internal/models"
	"github.com/jmoiron/sqlx"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetByEmail busca un usuario para el login
func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	user := &models.User{}
	err := r.db.Get(user, "SELECT id, email, password_hash, role, name FROM users WHERE email=$1", email)
	return user, err
}

func (r *UserRepository) Create(user *models.User) error {
	query := `INSERT INTO users (email, password_hash, name, surnames, phone) 
              VALUES (:email, :password_hash, :name, :surnames, :phone)`
	_, err := r.db.NamedExec(query, user)
	return err
}
