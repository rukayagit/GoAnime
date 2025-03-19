package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(r *gin.Engine) {
	// Тестовый маршрут
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// нужно будет добавить маршруты для аниме, пользователей, авторизации и т.д.
}
