package handler

import (
	"fmt"
	"os"
	"path/filepath"
)

// remove article
func RemoveArticle(bname string) error {
	// build path
	path, err := BuildPath("article")
	fname := bname + ".md"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// remove file
	if !Confirm("Remove " + "'" + fname + "'?") {
		fmt.Println("Canceled")
		return nil
	}

	if err := os.Remove(fullpath); err != nil {
		return err
	}

	fmt.Println("[SIWL] removed article:", fname)

	return nil
}

// remove tag
func RemoveTag(bname string) error {
	// build path
	path, err := BuildPath("tag")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// remove file
	if !Confirm("Remove " + "'" + fname + "'?") {
		fmt.Println("Canceled")
		return nil
	}

	if err := os.Remove(fullpath); err != nil {
		return err
	}

	fmt.Println("[SIWL] removed tag:", fname)

	return nil
}

// remove bookmark
func RemoveBookmark(bname string) error {
	// build path
	path, err := BuildPath("bookmark")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// remove file
	if !Confirm("Remove " + "'" + fname + "'?") {
		fmt.Println("Canceled")
		return nil
	}

	if err := os.Remove(fullpath); err != nil {
		return err
	}

	fmt.Println("[SIWL] removed bookmark:", fname)

	return nil
}
