package cmd

import (
	"siwl/handler"

	"github.com/spf13/cobra"
)

var listBookmarkCmd = &cobra.Command{
	Use:     "bookmark",
	Aliases: []string{"b"},
	Short:   "List bookmark",
	Args:    cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		err := handler.ListBookmark(listBookmarkName, listBookmarkUrl)
		return err
	},
}

// options
var listBookmarkName bool
var listBookmarkUrl bool

func init() {
	listCmd.AddCommand(listBookmarkCmd)
	listBookmarkCmd.Flags().BoolVarP(
		&listBookmarkName,
		"name",
		"n",
		false,
		"whether list bookmark name or not",
	)
	listBookmarkCmd.Flags().BoolVarP(
		&listBookmarkUrl,
		"url",
		"u",
		false,
		"whether list bookmark url or not",
	)
}
