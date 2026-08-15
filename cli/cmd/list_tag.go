package cmd

import (
	"siwl/handler"

	"github.com/spf13/cobra"
)

var listTagCmd = &cobra.Command{
	Use:     "tag",
	Aliases: []string{"t"},
	Short:   "List tag",
	Args:    cobra.NoArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		err := handler.ListTag(listTagName)
		return err
	},
}

// options
var listTagName bool

func init() {
	listCmd.AddCommand(listTagCmd)
	listTagCmd.Flags().BoolVarP(
		&listTagName,
		"name",
		"n",
		false,
		"whether list tag name or not",
	)
}
