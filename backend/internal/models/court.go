package models

type Court struct {
	ID           int     `json:"id" db:"id"`
	Name         string  `json:"name" db:"name"`
	CourtType    string  `json:"court_type" db:"court_type"`
	PricePerHour float64 `json:"price_per_hour" db:"price_per_hour"`
}
