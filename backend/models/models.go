package models

import "gorm.io/gorm"

// Структура для аниме
type Anime struct {
	gorm.Model
	Title    string `json:"title"`
	Poster   string `json:"poster"`
	Rating   string `json:"rating"`
	Score    string `json:"score"`
	ImageURL string `json:"image_url"`
}

// AnimeData структура для хранения аниме данных
type AnimeData struct {
	ID       int    `json:"id"`
	Russian  string `json:"russian"`
	Score    string `json:"score"`
	ImageURL string `json:"image_url"`
}

// Структура для избранного аниме
type FavouriteAnime struct {
	gorm.Model
	UserID    uint    `json:"user_id"`    // айди пользователя
	AnimeID   uint    `json:"anime_id"`   // айди из myanimelist
	Title     string  `json:"title"`      // название аниме
	Poster    string  `json:"poster"`     // ссылка на постер
	MALrating float64 `json:"mal_rating"` // рейтинг на myanimelist
	Score     uint    `json:"score"`      // оценка пользователя
	Status    string  `json:"status"`     // статус аниме (просмотрено, в планах и т.д.)
}

// CombinedAnime — общий тип, объединяющий данные из MAL и Shikimori
type CombinedAnime struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Russian     string  `json:"russian,omitempty"`      // поле для данных из Shikimori
	Score       string  `json:"score,omitempty"`        // поле для данных из Shikimori
	ImageURL    string  `json:"image_url,omitempty"`    // поле для данных из Shikimori
	MALRating   float64 `json:"mal_rating,omitempty"`   // поле для данных из MAL
	MainPicture string  `json:"main_picture,omitempty"` // поле для данных из MAL
}
