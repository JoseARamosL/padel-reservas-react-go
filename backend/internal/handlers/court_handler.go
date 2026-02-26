package handlers

import (
	"net/http"

	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
)

type CourtHandler struct {
	Repo *repository.CourtRepository
}

func NewCourtHandler(repo *repository.CourtRepository) *CourtHandler {
	return &CourtHandler{Repo: repo}
}

// GetCourts devuelve la lista de pistas en JSON
func (h *CourtHandler) GetCourts(c *gin.Context) {
	courts, err := h.Repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener pistas"})
		return
	}
	c.JSON(http.StatusOK, courts)
}
