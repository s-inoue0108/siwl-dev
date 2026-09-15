package cmd

import (
	"siwl/handler"

	"github.com/spf13/cobra"
)

var listLibraryCmd = &cobra.Command{
	Use:     "library",
	Aliases: []string{"l"},
	Short:   "List library",
	Args:    cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		err := handler.ListLibrary(listLibraryISBN13)
		return err
	},
}

// options
var listLibraryISBN13 bool

func init() {
	listCmd.AddCommand(listLibraryCmd)
	listLibraryCmd.Flags().BoolVar(
		&listLibraryISBN13,
		"isbn",
		false,
		"whether list books isbn-13 or not",
	)
}
