package handlers

import (
	"net/http"
	"strconv"

	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
)

type ReservationHandler struct {
	repo *repository.ReservationRepository
}

func NewReservationHandler(repo *repository.ReservationRepository) *ReservationHandler {
	return &ReservationHandler{repo: repo}
}

// GetAvailability GetAvailability: Devuelve los slots y su estado (disponible/ocupado) para un día y pista
func (h *ReservationHandler) GetAvailability(c *gin.Context) {
	courtID := c.Query("court_id")
	date := c.Query("date")

	if courtID == "" || date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faltan parámetros: court_id y date"})
		return
	}

	id, err := strconv.Atoi(courtID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "court_id debe ser un número entero"})
		return
	}

	// Esta función del repo devolverá []models.SlotStatus
	slots, err := h.repo.GetSlotsAvailability(id, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener disponibilidad"})
		return
	}

	c.JSON(http.StatusOK, slots)
}

// GetReservations GetReservations: Obtiene las reservas existentes para una pista y día
func (h *ReservationHandler) GetReservations(c *gin.Context) {
	courtID := c.Query("court_id")
	date := c.Query("date")

	if courtID == "" || date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faltan parámetros: court_id y date"})
		return
	}

	id, err := strconv.Atoi(courtID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "court_id inválido"})
		return
	}

	reservations, err := h.repo.GetByCourt(id, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener reservas"})
		return
	}

	c.JSON(http.StatusOK, reservations)
}
