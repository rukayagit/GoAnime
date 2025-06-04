package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/rukayagit/GoAnime/services"
	"log"
	"net/http"
	"strconv"
)

// RegisterAnimeRoutes регистрирует маршруты для работы с аниме
func RegisterAnimeRoutes(r *gin.Engine) {
	r.GET("/api/anime/:id", handleAnimeDetails) // Маршрут для получения деталей аниме по ID
	r.GET("/api/anime", handleGetAnimeList)     // Маршрут для получения списка аниме
}

// handleAnimeDetails обрабатывает запросы для получения деталей аниме
func handleAnimeDetails(c *gin.Context) {
	// Получаем параметр ID из URL
	idParam := c.Param("id")

	// Преобразуем ID из строки в целое число
	id, err := strconv.Atoi(idParam)
	if err != nil {
		// Если преобразование не удалось, возвращаем ошибку
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ID аниме"})
		return
	}

	// Получаем подробности об аниме с помощью сервиса
	animeDetails, err := services.GetAnimeDetails(id)
	if err != nil {
		// Логируем ошибку и возвращаем её в ответе
		log.Println("Ошибка при получении деталей аниме:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить данные об аниме"})
		return
	}

	// Возвращаем данные аниме в формате JSON
	c.JSON(http.StatusOK, gin.H{"data": animeDetails})
}

// handleGetAnimeList обрабатывает запросы для получения списка аниме
func handleGetAnimeList(c *gin.Context) {
	// Получаем параметры запроса с установкой значений по умолчанию
	status := c.DefaultQuery("status", "ongoing")             // Если параметр отсутствует, по умолчанию "ongoing"
	order := c.DefaultQuery("order", "score")                 // Если параметр отсутствует, по умолчанию "score"
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10")) // Преобразуем параметр limit в число, по умолчанию 10
	if err != nil {
		// Если преобразование не удалось, возвращаем ошибку
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный параметр limit"})
		return
	}

	// Получаем данные аниме с использованием сервиса
	animeData, err := services.FetchAnimeData(status, order, limit)
	if err != nil {
		// Логируем ошибку и возвращаем её в ответе
		log.Println("Ошибка при получении данных аниме:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить список аниме"})
		return
	}

	// Возвращаем полученные данные аниме в формате JSON
	c.JSON(http.StatusOK, gin.H{"data": animeData})
}
