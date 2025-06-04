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
		// Выводим ошибку в лог и завершаем выполнение программы
		fmt.Println("Ошибка при подключении к базе данных:", err)
		return
	}

	// Создание сервера
	r := gin.Default()

	// Настройка CORS, чтобы фронтенд мог делать запросы
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Разрешаем доступ с любого источника
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Подключение маршрутов
	routes.RegisterAnimeRoutes(r)

	// Запуск сервера
	port := ":8080"
	fmt.Println("Сервер запущен на http://localhost" + port)
	if err := r.Run(port); err != nil {
		// Если сервер не запускается, выводим ошибку
		fmt.Println("Ошибка запуска сервера:", err)
		return
	}

	// Логирование для отладки
	if malClientID := os.Getenv("MAL_CLIENT_ID"); malClientID != "" {
		fmt.Println("MAL_CLIENT_ID:", malClientID)
	} else {
		fmt.Println("MAL_CLIENT_ID не задан.")
	}
}
