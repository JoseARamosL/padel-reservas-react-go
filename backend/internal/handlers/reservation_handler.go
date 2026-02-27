package handlers

import (
	"net/http"
	"strconv"

	"github.com/JoseARamosL/padel-reservas/internal/models"
	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
)

type ReservationHandler struct {
	repo *repository.ReservationRepository
}

func NewReservationHandler(repo *repository.ReservationRepository) *ReservationHandler {
	return &ReservationHandler{repo: repo}
}

// GetAvailability es el nuevo endpoint para el front
func (h *ReservationHandler) GetAvailability(c *gin.Context) {
	courtID := c.Query("court_id")
	date := c.Query("date")

	if courtID == "" || date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faltan parámetros: court_id y date"})
		return
	}

	id, _ := strconv.Atoi(courtID)

	// Aquí llamamos a la función del repositorio que hicimos con el LEFT JOIN
	slots, err := h.repo.GetSlotsAvailability(id, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener disponibilidad"})
		return
	}

	c.JSON(http.StatusOK, slots)
}

func (h *ReservationHandler) Create(c *gin.Context) {
	var res models.Reservation
	if err := c.ShouldBindJSON(&res); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	userID, exists := c.Get("userID")
	if exists {
		uid := userID.(int)
		res.UserID = &uid
	} else {
		if res.GuestName == "" || res.GuestPhone == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Debes estar logueado o proporcionar nombre y teléfono"})
			return
		}
	}

	if err := h.repo.Create(&res); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear la reserva"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Reserva creada con éxito"})
}

func (h *ReservationHandler) GetReservations(c *gin.Context) {
	courtID := c.Query("court_id")
	date := c.Query("date")

	if courtID == "" || date == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Faltan parámetros: court_id y date"})
		return
	}

	id, _ := strconv.Atoi(courtID)
	reservations, err := h.repo.GetByCourt(id, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener reservas"})
		return
	}

	c.JSON(http.StatusOK, reservations)
}
