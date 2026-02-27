package models

type SlotAvailability struct {
	ID        int    `json:"id" db:"id"`
	Time      string `json:"time" db:"time"`
	Available bool   `json:"available" db:"available"`
}
