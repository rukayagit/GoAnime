package services

import (
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"net/url"
	"os"
	"sync"
	"time"
)

const (
	SHIKIMORI_API = "https://shikimori.one/api/animes"      // API для получения данных с Shikimori
	MAL_API       = "https://api.myanimelist.net/v2/anime/" // API для получения данных с MyAnimeList
)

type AnimeData struct {
	ID       int    `json:"id"`        // ID аниме
	Russian  string `json:"russian"`   // Название аниме на русском
	Score    string `json:"score"`     // Оценка аниме
	ImageURL string `json:"image_url"` // URL изображения аниме
}

type ShikimoriAnime struct {
	ID      int    `json:"id"`      // ID аниме на Shikimori
	Russian string `json:"russian"` // Название аниме на русском на Shikimori
	Score   string `json:"score"`   // Оценка аниме на Shikimori
}

type MalImage struct {
	MainPicture struct {
		Medium string `json:"medium"` // Ссылка на изображение аниме с MyAnimeList
	} `json:"main_picture"`
}

var (
	malToken       string
	malTokenExpiry time.Time // Время истечения срока действия MAL токена
)

func init() {
	// Загружаем переменные окружения из .env файла
	if err := godotenv.Load(); err != nil {
		log.Fatal("Не удалось загрузить .env файл: ", err) // Логируем ошибку и завершаем программу
	}
}

// getMalToken получает токен для доступа к API MyAnimeList, используя refresh_token
func getMalToken() string {
	// Если токен ещё актуален, возвращаем его
	if malToken != "" && time.Now().Before(malTokenExpiry) {
		return malToken
	}

	// Получаем необходимые данные из переменных окружения
	clientID := os.Getenv("MAL_CLIENT_ID")
	clientSecret := os.Getenv("MAL_CLIENT_SECRET")
	codeVerifier := os.Getenv("MAL_CODE_VERIFIER")
	refreshToken := os.Getenv("MAL_REFRESH_TOKEN")

	// Создаём запрос для получения токена
	data := url.Values{
		"client_id":     {clientID},
		"client_secret": {clientSecret},
		"grant_type":    {"refresh_token"},
		"refresh_token": {refreshToken},
		"code_verifier": {codeVerifier},
	}

	// Отправляем запрос на получение токена
	resp, err := http.PostForm("https://myanimelist.net/v1/oauth2/token", data)
	if err != nil {
		log.Println("Ошибка при запросе MAL токена:", err)
		return ""
	}
	defer resp.Body.Close()

	// Парсим ответ от API
	var tokenData struct {
		AccessToken  string `json:"access_token"`  // Токен доступа
		ExpiresIn    int    `json:"expires_in"`    // Время жизни токена в секундах
		RefreshToken string `json:"refresh_token"` // Новый refresh токен
	}

	// Декодируем данные в структуру
	if err := json.NewDecoder(resp.Body).Decode(&tokenData); err != nil {
		log.Println("Ошибка при парсинге MAL токена:", err)
		return ""
	}

	// Сохраняем токен и время его истечения
	malToken = tokenData.AccessToken
	malTokenExpiry = time.Now().Add(time.Duration(tokenData.ExpiresIn) * time.Second)
	return malToken
}

// fetchMalImage получает изображение аниме с MyAnimeList по ID
func fetchMalImage(id int, token string) string {
	// Формируем URL для запроса
	malURL := fmt.Sprintf("%s%d?fields=main_picture", MAL_API, id)

	// Создаём HTTP запрос
	req, err := http.NewRequest("GET", malURL, nil)
	if err != nil {
		log.Println("Ошибка при создании запроса к MAL:", err)
		return "default_image_url" // Возвращаем дефолтное изображение в случае ошибки
	}
	req.Header.Add("Authorization", "Bearer "+token) // Добавляем заголовок с токеном

	// Отправляем запрос
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println("Ошибка при запросе к MAL:", err)
		return "default_image_url" // Возвращаем дефолтное изображение в случае ошибки
	}
	defer resp.Body.Close()

	// Парсим ответ с изображением
	var malData MalImage
	if err := json.NewDecoder(resp.Body).Decode(&malData); err != nil {
		log.Println("Ошибка при парсинге данных с MAL:", err)
		return "default_image_url" // Возвращаем дефолтное изображение в случае ошибки
	}

	// Если изображение отсутствует, возвращаем дефолтное изображение
	if malData.MainPicture.Medium == "" {
		return "default_image_url"
	}

	// Возвращаем URL изображения
	return malData.MainPicture.Medium
}

// FetchAnimeData получает данные аниме по статусу, порядку и лимиту из Shikimori, а также изображения из MAL
func FetchAnimeData(status, order string, limit int) ([]AnimeData, error) {
	// Формируем URL для запроса к Shikimori
	url := fmt.Sprintf("%s?status=%s&order=%s&limit=%d", SHIKIMORI_API, status, order, limit)

	// Отправляем запрос к Shikimori
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Декодируем ответ Shikimori в структуру
	var shikimoriData []ShikimoriAnime
	if err := json.NewDecoder(resp.Body).Decode(&shikimoriData); err != nil {
		return nil, err
	}

	// Получаем токен для доступа к MyAnimeList
	token := getMalToken()
	if token == "" {
		return nil, fmt.Errorf("не удалось получить MAL токен")
	}

	// Создаём массив для хранения данных о аниме
	animeData := make([]AnimeData, len(shikimoriData))
	var wg sync.WaitGroup // Используем WaitGroup для ожидания завершения всех горутин

	// Ограничиваем количество одновременно работающих горутин (например, 10)
	sem := make(chan struct{}, 10)

	// Запускаем горутины для получения изображений аниме с MAL
	for i, anime := range shikimoriData {
		wg.Add(1)
		sem <- struct{}{} // Блокируем канал

		// Горутина для получения данных и изображения для каждого аниме
		go func(index int, anime ShikimoriAnime) {
			defer func() {
				wg.Done()
				<-sem // Освобождаем канал
			}()

			// Получаем изображение с MAL
			imageURL := fetchMalImage(anime.ID, token)

			// Сохраняем данные о аниме
			animeData[index] = AnimeData{
				ID:       anime.ID,
				Russian:  anime.Russian,
				Score:    anime.Score,
				ImageURL: imageURL,
			}
		}(i, anime)
	}

	// Ожидаем завершения всех горутин
	wg.Wait()
	return animeData, nil
}
