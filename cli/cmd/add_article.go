package cmd

import (
	"fmt"
	"siwl/handler"
	metadata "siwl/type"
	"slices"

	"github.com/spf13/cobra"
)

var addArticleCmd = &cobra.Command{
	Use:     "article",
	Aliases: []string{"a"},
	Short:   "Add article",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 || args[0] == "" {
			return fmt.Errorf("'name' is the only positional argument.")
		}
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		bname := args[0]

		if addArticleCategory != "tech" && addArticleCategory != "idea" {
			return fmt.Errorf("The category must be either 'tech' or 'idea'")
		}
		category := metadata.Category(addArticleCategory)

		// valid tags
		if len(addArticleTags) > 0 {
			path, err := handler.BuildPath("tag")
			tags, err := handler.GetFiles(path, "yaml")
			if err != nil {
				return nil
			}

			tagNames := make([]string, 0, len(tags))
			for _, tag := range tags {
				tagNames = append(tagNames, tag[:len(tag)-5])
			}

			for _, specifiedTagName := range addArticleTags {
				if !slices.Contains(tagNames, specifiedTagName) {
					return fmt.Errorf("specified invalid tag name.")
				}
			}
		}

		// valid related articles
		if len(addArticleRelatedArticles) > 0 {
			path, err := handler.BuildPath("article")
			articles, err := handler.GetFiles(path, "md")
			if err != nil {
				return nil
			}

			articleNames := make([]string, 0, len(articles))
			for _, article := range articles {
				articleNames = append(articleNames, article[:len(article)-3])
			}

			for _, specifiedArticleName := range addArticleRelatedArticles {
				if !slices.Contains(articleNames, specifiedArticleName) {
					return fmt.Errorf("specified invalid article name.")
				}
			}
		}

		now := handler.GetTimeStamp()
		metadata := metadata.Article{
			IsDraft:         addArticleDraft,
			IsLimited:       addArticlelimited,
			Title:           addArticleTitle,
			Category:        category,
			Tags:            addArticleTags,
			Description:     addArticleDescription,
			PublishDate:     now,
			UpdateDate:      now,
			RelatedArticles: addArticleRelatedArticles,
		}

		err := handler.AddArticle(bname, metadata)
		return err
	},
}

// options
var addArticleMetadata metadata.Article
var addArticleDraft bool
var addArticlelimited bool
var addArticleTitle string
var addArticleCategory string
var addArticleTags []string
var addArticleDescription string
var addArticleRelatedArticles []string

func init() {
	addCmd.AddCommand(addArticleCmd)
	addArticleCmd.Flags().BoolVar(
		&addArticleDraft,
		"draft",
		true,
		"whether article is a draft or not",
	)
	addArticleCmd.Flags().BoolVar(
		&addArticlelimited,
		"limited",
		false,
		"whether it is limited release or not",
	)
	addArticleCmd.Flags().StringVar(
		&addArticleTitle,
		"title",
		"",
		"article title",
	)
	addArticleCmd.Flags().StringVar(
		&addArticleCategory,
		"category",
		"tech",
		"article category (tech|idea)",
	)
	addArticleCmd.Flags().StringSliceVar(
		&addArticleTags,
		"tag",
		nil,
		"article tags",
	)
	addArticleCmd.Flags().StringVar(
		&addArticleDescription,
		"description",
		"",
		"article description",
	)
	addArticleCmd.Flags().StringSliceVar(
		&addArticleRelatedArticles,
		"relatedArticles",
		nil,
		"related articles",
	)
}
