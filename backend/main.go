package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/rukayagit/GoAnime/database"
)

func main() {
	database.ConnectDB()

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	fmt.Println("Сервер запущен на http://localhost:8080")
	r.Run(":8080")
}
