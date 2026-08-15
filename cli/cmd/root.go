package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "siwl",
	Short: "siwl-cli",
}

var model string

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	// rootCmd.PersistentFlags().StringVarP(
	// 	&model,
	// 	"model",
	// 	"m",
	// 	"article",
	// 	"specify model",
	// )
}
