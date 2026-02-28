package models

import "time"

type Reservation struct {
	ID              int       `json:"id" db:"id"`
	SlotID          int       `json:"slot_id" db:"slot_id"`
	ReservationDate string    `json:"reservation_date" db:"reservation_date"`
	UserID          *int      `json:"user_id" db:"user_id"`
	GuestName       string    `json:"guest_name" db:"guest_name"`
	GuestPhone      string    `json:"guest_phone" db:"guest_phone"`
	Status          string    `json:"status" db:"status"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
}
