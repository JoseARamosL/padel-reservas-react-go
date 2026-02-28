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

// GetByCourt: Ahora filtra por slot_id haciendo JOIN con slots para filtrar por court_id
func (r *ReservationRepository) GetByCourt(courtID int, date string) ([]models.Reservation, error) {
	var reservations []models.Reservation
	query := `
		SELECT res.* FROM reservations res
		JOIN slots s ON res.slot_id = s.id
		WHERE s.court_id = $1 AND res.reservation_date = $2`

	err := r.db.Select(&reservations, query, courtID, date)
	return reservations, err
}

// GetSlotsAvailability GetSlotsAvailability: El corazón de la disponibilidad actualizado
func (r *ReservationRepository) GetSlotsAvailability(courtID int, date string) ([]models.SlotStatus, error) {
	var results []models.SlotStatus

	query := `
    SELECT s.id, 
           TO_CHAR(s.start_time, 'HH24:MI') as start_time, 
           TO_CHAR(s.end_time, 'HH24:MI') as end_time, 
           (CASE WHEN r.id IS NULL THEN TRUE ELSE FALSE END) as available
    FROM slots s
    LEFT JOIN reservations r ON s.id = r.slot_id 
         AND r.reservation_date = $1
    WHERE s.court_id = $2
    ORDER BY s.start_time;
`

	err := r.db.Select(&results, query, date, courtID)
	return results, err
}
