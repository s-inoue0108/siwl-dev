package cmd

import (
	"fmt"
	"siwl/handler"

	"github.com/spf13/cobra"
)

var unpublishBookmarkCmd = &cobra.Command{
	Use:     "bookmark",
	Aliases: []string{"b"},
	Short:   "Unpublish bookmark",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 || args[0] == "" {
			return fmt.Errorf("'name' is the only positional argument.")
		}
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		name := args[0]
		err := handler.UnpublishBookmark(name)
		return err
	},
}

// options
func init() {
	unpublishCmd.AddCommand(unpublishBookmarkCmd)
}
