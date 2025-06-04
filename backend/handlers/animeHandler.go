package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/rukayagit/GoAnime/services"
	"log"
	"net/http"
)

// GetMainPageData обрабатывает запросы на главную страницу
func GetMainPageData(c *gin.Context) {
	// Функция для получения аниме по категориям
	fetchCategoryData := func(status, order string, limit int) ([]services.AnimeData, error) {
		// Получаем данные аниме по заданным параметрам (статус, порядок сортировки, лимит)
		animes, err := services.FetchAnimeData(status, order, limit)
		if err != nil {
			// В случае ошибки при получении данных, логируем ошибку
			log.Printf("Ошибка при получении аниме для категории %s: %v", status, err)
			return nil, err
		}
		return animes, nil
	}

	// Получаем данные аниме для категории "ongoing" (текущие сериалы)
	ongoingAnimes, err := fetchCategoryData("ongoing", "popularity", 6)
	if err != nil {
		// В случае ошибки при получении данных, отправляем ответ с ошибкой
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении аниме для категории ongoing", "details": err.Error()})
		return
	}

	// Получаем данные аниме для категории "ranked" (по рейтингу)
	rankedAnimes, err := fetchCategoryData("ranked", "popularity", 6)
	if err != nil {
		// В случае ошибки при получении данных, отправляем ответ с ошибкой
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении аниме для категории ranked", "details": err.Error()})
		return
	}

	// Получаем данные аниме для категории "popularity" (по популярности)
	popularAnimes, err := fetchCategoryData("popularity", "popularity", 6)
	if err != nil {
		// В случае ошибки при получении данных, отправляем ответ с ошибкой
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении аниме для категории popularity", "details": err.Error()})
		return
	}

	// Отправляем данные для главной страницы (аниме для каждой категории)
	c.JSON(http.StatusOK, gin.H{
		"ongoing": ongoingAnimes,
		"ranked":  rankedAnimes,
		"popular": popularAnimes,
	})
}
