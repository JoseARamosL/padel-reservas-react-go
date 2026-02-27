package repository

import (
	"github.com/JoseARamosL/padel-reservas/internal/models"
	"github.com/jmoiron/sqlx"
)

type ReservationRepository struct {
	db *sqlx.DB
}

func NewReservationRepository(db *sqlx.DB) *ReservationRepository {
	return &ReservationRepository{db: db}
}

func (r *ReservationRepository) Create(res *models.Reservation) error {
	query := `INSERT INTO reservations (court_id, user_id, guest_name, guest_phone, start_time, end_time, status) 
              VALUES (:court_id, :user_id, :guest_name, :guest_phone, :start_time, :end_time, :status)`

	_, err := r.db.NamedExec(query, res)
	return err
}

func (r *ReservationRepository) GetByCourt(courtID int, date string) ([]models.Reservation, error) {
	var reservations []models.Reservation
	query := `SELECT * FROM reservations WHERE court_id = $1 AND start_time::date = $2`
	err := r.db.Select(&reservations, query, courtID, date)
	return reservations, err
}

func (r *ReservationRepository) GetSlotsAvailability(courtID int, date string) ([]models.SlotAvailability, error) {
	var results []models.SlotAvailability

	// Esta consulta es el corazón de la disponibilidad
	query := `
        SELECT s.id, s.time, 
               CASE WHEN r.id IS NULL THEN TRUE ELSE FALSE END as available
        FROM slots s
        LEFT JOIN reservations r ON s.id = r.slot_id AND r.reservation_date = $1
        WHERE s.court_id = $2;
    `

	err := r.db.Select(&results, query, date, courtID)
	return results, err
}
