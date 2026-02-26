package models

import "time"

type Reservation struct {
	ID         int       `db:"id"`
	CourtID    int       `db:"court_id"`
	UserID     *int      `db:"user_id"` // Usamos puntero porque puede ser NULL (invitado)
	GuestName  string    `db:"guest_name"`
	GuestPhone string    `db:"guest_phone"`
	StartTime  time.Time `db:"start_time"`
	EndTime    time.Time `db:"end_time"`
	Status     string    `db:"status"`
}
