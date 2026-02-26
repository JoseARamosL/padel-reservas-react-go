package models

type Court struct {
	ID           int     `db:"id"`
	Name         string  `db:"name"`
	CourtType    string  `db:"court_type"`
	PricePerHour float64 `db:"price_per_hour"`
}
