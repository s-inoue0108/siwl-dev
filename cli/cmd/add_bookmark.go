package cmd

import (
	"fmt"
	"siwl/handler"
	metadata "siwl/type"

	"github.com/spf13/cobra"
)

var addBookmarkCmd = &cobra.Command{
	Use:     "bookmark",
	Aliases: []string{"b"},
	Short:   "Add bookmark",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 || args[0] == "" {
			return fmt.Errorf("'name' is the only positional argument.")
		}
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		bname := args[0]

		metadata := metadata.Bookmark{
			IsDraft: addBookmarkDraft,
			Name:    addBookmarkName,
			Url:     addBookmarkUrl,
		}

		err := handler.AddBookmark(bname, metadata)
		return err
	},
}

// options
var addBookmarkMetadata metadata.Tag
var addBookmarkDraft bool
var addBookmarkName string
var addBookmarkUrl string

func init() {
	addCmd.AddCommand(addBookmarkCmd)
	addBookmarkCmd.Flags().BoolVar(
		&addBookmarkDraft,
		"draft",
		true,
		"whether tag is a draft or not",
	)
	addBookmarkCmd.Flags().StringVar(
		&addBookmarkName,
		"name",
		"",
		"tag name",
	)
	addBookmarkCmd.Flags().StringVar(
		&addBookmarkUrl,
		"url",
		"",
		"bookmark url",
	)
}
