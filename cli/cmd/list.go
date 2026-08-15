package cmd

import (
	"github.com/spf13/cobra"
)

var listCmd = &cobra.Command{
	Use:     "list",
	Aliases: []string{"ls", "display"},
	Short:   "List page asset",
}

func init() {
	rootCmd.AddCommand(listCmd)
}
