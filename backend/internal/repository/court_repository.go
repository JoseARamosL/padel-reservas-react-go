package repository

import (
	"github.com/JoseARamosL/padel-reservas/internal/models"
	"github.com/jmoiron/sqlx"
)

// CourtRepository encapsula la conexión a DB
type CourtRepository struct {
	db *sqlx.DB
}

// NewCourtRepository es un constructor para nuestra dependencia
func NewCourtRepository(db *sqlx.DB) *CourtRepository {
	return &CourtRepository{db: db}
}

// GetAll obtiene todas las pistas
func (r *CourtRepository) GetAll() ([]models.Court, error) {
	var courts []models.Court
	query := "SELECT id, name, court_type, price_per_hour FROM courts"

	err := r.db.Select(&courts, query)
	return courts, err
}

// GetByID obtiene una pista específica
func (r *CourtRepository) GetByID(id int) (*models.Court, error) {
	var court models.Court
	query := "SELECT id, name, court_type, price_per_hour FROM courts WHERE id = $1"

	err := r.db.Get(&court, query, id)
	if err != nil {
		return nil, err
	}
	return &court, nil
}
