package cmd

import (
	"fmt"
	"siwl/handler"

	"github.com/spf13/cobra"
)

var removeLibraryCmd = &cobra.Command{
	Use:     "library",
	Aliases: []string{"l"},
	Short:   "Remove library",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) != 1 || args[0] == "" {
			return fmt.Errorf("'name' is the only positional argument.")
		}
		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		name := args[0]
		err := handler.RemoveLibrary(name)
		return err
	},
}

// options
func init() {
	removeCmd.AddCommand(removeLibraryCmd)
}
