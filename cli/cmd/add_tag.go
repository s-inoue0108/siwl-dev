package cmd

import (
	"fmt"
	"siwl/handler"
	metadata "siwl/type"

	"github.com/spf13/cobra"
)

var addTagCmd = &cobra.Command{
	Use:     "tag",
	Aliases: []string{"t"},
	Short:   "Add tag",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 || args[0] == "" {
			return fmt.Errorf("'name' is the only positional argument.")
		}
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		bname := args[0]

		if addTagBelong != "tech" && addTagBelong != "idea" {
			return fmt.Errorf("The belong must be either 'tech' or 'idea'")
		}
		belong := metadata.Category(addTagBelong)

		metadata := metadata.Tag{
			IsDraft: addTagDraft,
			Name:    addTagName,
			Belong:  belong,
		}

		err := handler.AddTag(bname, metadata)
		return err
	},
}

// options
var addTagMetadata metadata.Tag
var addTagDraft bool
var addTagName string
var addTagBelong string

func init() {
	addCmd.AddCommand(addTagCmd)
	addTagCmd.Flags().BoolVar(
		&addTagDraft,
		"draft",
		true,
		"whether tag is a draft or not",
	)
	addTagCmd.Flags().StringVar(
		&addTagName,
		"name",
		"",
		"tag name",
	)
	addTagCmd.Flags().StringVar(
		&addTagBelong,
		"belong",
		"tech",
		"tag attribute (tech|idea)",
	)
}
