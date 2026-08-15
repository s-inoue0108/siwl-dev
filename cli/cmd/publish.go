package cmd

import (
	"github.com/spf13/cobra"
)

var publishCmd = &cobra.Command{
	Use:     "publish",
	Aliases: []string{"pub"},
	Short:   "Publish page asset",
}

func init() {
	rootCmd.AddCommand(publishCmd)
}
