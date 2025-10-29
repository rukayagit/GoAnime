package database

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/rukayagit/GoAnime/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

var DB *gorm.DB

func ConnectDB() error {
	// Загружаем .env (для локальной разработки)
	_ = godotenv.Load()

	// Используем DATABASE_URL из переменных окружения Render
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("Ошибка подключения к базе данных: %w", err)
	}

	// Миграция модели
	err = db.AutoMigrate(&models.FavouriteAnime{})
	if err != nil {
		return fmt.Errorf("Ошибка миграции: %w", err)
	}

	// Сохраняем подключение в глобальной переменной DB
	DB = db
	fmt.Println("✅ База данных успешно подключена!")
	return nil
}
