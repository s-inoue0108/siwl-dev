package metadata

import "time"

type Category string

const (
	Tech Category = "tech"
	Idea Category = "idea"
)

type Article struct {
	IsDraft         bool
	IsLimited       bool
	Title           string
	Category        Category
	Tags            []string
	Description     string
	PublishDate     time.Time
	UpdateDate      time.Time
	RelatedArticles []string
}

type Tag struct {
	IsDraft bool
	Name    string
	Belong  Category
}

type Bookmark struct {
	IsDraft bool
	Name    string
	Url     string
}
