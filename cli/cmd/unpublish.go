package cmd

import (
	"github.com/spf13/cobra"
)

var unpublishCmd = &cobra.Command{
	Use:     "unpublish",
	Aliases: []string{"unpub"},
	Short:   "Unpublish page asset",
}

func init() {
	rootCmd.AddCommand(unpublishCmd)
}
