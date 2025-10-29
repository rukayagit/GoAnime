package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rukayagit/GoAnime/database"
	"github.com/rukayagit/GoAnime/routes"
	"os"
)

func main() {
	// Подключение к базе данных с обработкой ошибки
	err := database.ConnectDB()
	if err != nil {
		fmt.Println("Ошибка при подключении к базе данных:", err)
		return
	}

	// Создание сервера
	r := gin.Default()

	// Настройка CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Для продакшена лучше указать конкретный фронт
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Корневой маршрут для проверки работы API
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "API работает!"})
	})

	// Подключение маршрутов
	routes.RegisterAnimeRoutes(r)

	// Получаем порт из Render (или используем 8080 локально)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("Сервер запущен на http://localhost:" + port)

	// Запуск сервера
	if err := r.Run(":" + port); err != nil {
		fmt.Println("Ошибка запуска сервера:", err)
		return
	}

	// Логирование MAL_CLIENT_ID для отладки
	if malClientID := os.Getenv("MAL_CLIENT_ID"); malClientID != "" {
		fmt.Println("MAL_CLIENT_ID задан")
	} else {
		fmt.Println("MAL_CLIENT_ID не задан.")
	}
}
