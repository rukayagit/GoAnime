package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
)

// Структура для данных об аниме
type ShikimoriAnimeDetails struct {
	ID               int                `json:"id"`
	Name             string             `json:"name"`
	Russian          string             `json:"russian"`
	Image            string             `json:"image"`
	Rating           string             `json:"rating"`
	Status           string             `json:"status"`
	Kind             string             `json:"kind"`
	Score            string             `json:"score"`
	Episodes         int                `json:"episodes"`
	EpisodesAired    int                `json:"episodes_aired"`
	Duration         int                `json:"duration"`
	ReleasedOn       string             `json:"released_on"`
	AiredOn          string             `json:"aired_on"`
	NextEpisodeAt    string             `json:"next_episode_at"`
	RatesScoresStats map[string]float64 `json:"rates_scores_stats"`
	Studios          []string           `json:"studios"`
	Videos           []string           `json:"videos"`
	Screenshots      []string           `json:"screenshots"`
	Description      string             `json:"description"`
	Genres           []string           `json:"genres"`
}

var animeCache = make(map[int]ShikimoriAnimeDetails)
var cacheMutex sync.Mutex

// Функция для получения данных по аниме с кэшированием
func GetAnimeDetails(id int) (ShikimoriAnimeDetails, error) {
	cacheMutex.Lock()
	defer cacheMutex.Unlock()

	// Проверяем, есть ли данные в кэше
	if anime, found := animeCache[id]; found {
		return anime, nil
	}

	// Если данных нет в кэше, делаем запрос к API
	url := fmt.Sprintf("%s/%d", SHIKIMORI_API, id)
	resp, err := http.Get(url)
	if err != nil {
		log.Println("Ошибка при запросе к Shikimori:", err)
		return ShikimoriAnimeDetails{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ShikimoriAnimeDetails{}, fmt.Errorf("ошибка при получении данных с Shikimori: статус %d", resp.StatusCode)
	}

	var animeDetails ShikimoriAnimeDetails
	if err := json.NewDecoder(resp.Body).Decode(&animeDetails); err != nil {
		log.Println("Ошибка при парсинге данных с Shikimori:", err)
		return ShikimoriAnimeDetails{}, err
	}

	// Сохраняем данные в кэш
	animeCache[id] = animeDetails

	return animeDetails, nil
}

// Функция для очистки кэша
func ClearAnimeCache() {
	cacheMutex.Lock()
	defer cacheMutex.Unlock()
	animeCache = make(map[int]ShikimoriAnimeDetails)
}
