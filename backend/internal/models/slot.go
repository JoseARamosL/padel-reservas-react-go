package models

// Slot define la estructura base
type Slot struct {
	ID        int    `json:"id" db:"id"`
	CourtID   int    `json:"court_id" db:"court_id"`
	StartTime string `json:"start_time" db:"start_time"`
	EndTime   string `json:"end_time" db:"end_time"`
}

// SlotStatus es el modelo final que envías al frontend
type SlotStatus struct {
	ID        int    `json:"id" db:"id"`
	StartTime string `json:"start_time" db:"start_time"`
	EndTime   string `json:"end_time" db:"end_time"`
	Available bool   `json:"available" db:"available"`
}
