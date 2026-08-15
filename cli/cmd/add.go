package cmd

import (
	"github.com/spf13/cobra"
)

var addCmd = &cobra.Command{
	Use:     "add",
	Aliases: []string{"create", "new"},
	Short:   "Add page asset",
}

func init() {
	rootCmd.AddCommand(addCmd)
}
