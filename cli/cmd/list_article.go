package cmd

import (
	"siwl/handler"

	"github.com/spf13/cobra"
)

var listArticleCmd = &cobra.Command{
	Use:     "article",
	Aliases: []string{"a"},
	Short:   "List article",
	Args:    cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		err := handler.ListArticle(listArticleTitle)
		return err
	},
}

// options
var listArticleTitle bool

func init() {
	listCmd.AddCommand(listArticleCmd)
	listArticleCmd.Flags().BoolVarP(
		&listArticleTitle,
		"title",
		"t",
		false,
		"whether list article title or not",
	)
}
