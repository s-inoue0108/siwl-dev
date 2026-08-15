package cmd

import (
	"github.com/spf13/cobra"
)

var removeCmd = &cobra.Command{
	Use:     "remove",
	Aliases: []string{"rm", "delete", "del"},
	Short:   "Remove page asset",
}

func init() {
	rootCmd.AddCommand(removeCmd)
}
