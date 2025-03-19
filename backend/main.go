package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/rukayagit/GoAnime/database"
	"github.com/rukayagit/GoAnime/routes"
)

func main() {
	// Подключение к базе данных
	database.СonnectDB()

	// Создание сервера
	r := gin.Default()

	// Настройка CORS, чтобы фронтенд мог делать запросы
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		c.Next()
	})

	// Подключение маршрутов
	routes.SetupRoutes(r)

	// Запуск сервера
	fmt.Println("Сервер запущен на http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		fmt.Println("Ошибка запуска сервера:", err)
	}
}
