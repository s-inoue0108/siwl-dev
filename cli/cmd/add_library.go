package cmd

import (
	"fmt"
	"siwl/handler"
	metadata "siwl/type"

	"github.com/spf13/cobra"
)

var addLibraryCmd = &cobra.Command{
	Use:     "library",
	Aliases: []string{"l"},
	Short:   "Add library",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 || args[0] == "" {
			return fmt.Errorf("'name' is the only positional argument.")
		}
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		bname := args[0]

		now := handler.GetTimeStamp()
		metadata := metadata.Library{
			IsDraft:    addLibraryDraft,
			ISBN13:     addLibraryISBN13,
			ReviewDate: now,
			Rating:     addLibraryRating,
		}

		err := handler.AddLibrary(bname, metadata)
		return err
	},
}

// options
var addLibraryMetadata metadata.Library
var addLibraryDraft bool
var addLibraryISBN13 string
var addLibraryRating int

func init() {
	addCmd.AddCommand(addLibraryCmd)
	addLibraryCmd.Flags().BoolVar(
		&addLibraryDraft,
		"draft",
		true,
		"whether library is a draft or not",
	)
	addLibraryCmd.Flags().StringVar(
		&addLibraryISBN13,
		"isbn",
		"",
		"isbn-13",
	)
	addLibraryCmd.Flags().IntVar(
		&addLibraryRating,
		"rating",
		3,
		"Book rating",
	)
}
