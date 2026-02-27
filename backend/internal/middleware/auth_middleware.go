package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// En producción, usa os.Getenv("JWT_SECRET")
var jwtKey = []byte("tu_clave_secreta_super_segura")

// OptionalAuthMiddleware no detiene la ejecución si el token falta o es inválido,
// simplemente intenta extraer el userID si el token es correcto.
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		// Si no hay header, simplemente continuamos como invitado
		if authHeader == "" {
			c.Next()
			return
		}

		// Validar formato "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		tokenString := parts[1]

		// Intentar validar el token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		// Si el token es inválido, no abortamos, solo seguimos sin userID
		if err != nil || !token.Valid {
			c.Next()
			return
		}

		// Si el token es válido, extraemos el userID y lo ponemos en el contexto
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if userID, ok := claims["user_id"].(float64); ok {
				c.Set("userID", int(userID))
			}
		}

		c.Next()
	}
}
