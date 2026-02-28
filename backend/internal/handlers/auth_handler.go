package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/JoseARamosL/padel-reservas/internal/models"
	"github.com/JoseARamosL/padel-reservas/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	Repo *repository.UserRepository
}

func NewAuthHandler(repo *repository.UserRepository) *AuthHandler {
	return &AuthHandler{Repo: repo}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	user, err := h.Repo.GetByEmail(credentials.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(credentials.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales incorrectas"})
		return
	}

	// Usamos una variable de entorno para el secreto
	jwtKey := []byte(os.Getenv("JWT_SECRET"))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, _ := token.SignedString(jwtKey)

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar contraseña"})
		return
	}

	user := models.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Name:         &req.Name,
		Surnames:     &req.Surnames,
		Phone:        &req.Phone,
		Role:         "user",
	}

	// CORRECCIÓN AQUÍ: usamos h.Repo (como definiste en la struct)
	if err := h.Repo.Create(&user); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El email ya está registrado"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Usuario registrado con éxito"})
}
