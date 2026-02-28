package models

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Surnames string `json:"surnames"`
	Phone    string `json:"phone"`
}
