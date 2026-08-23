package handler

import (
	"fmt"
	"path/filepath"
)

// unpublish article
func UnpublishArticle(bname string) error {
	// build path
	path, err := BuildPath("article")
	fname := bname + ".md"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// replace
	err = ReplaceLine(fullpath, 1, "isDraft:         true")
	if err != nil {
		return err
	}

	fmt.Println("[SIWL] unpublished article:", fname)

	return nil
}

// unpublish tag
func UnpublishTag(bname string) error {
	// build path
	path, err := BuildPath("tag")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// replace
	err = ReplaceLine(fullpath, 0, "isDraft: true")
	if err != nil {
		return err
	}

	fmt.Println("[SIWL] unpublished tag:", fname)

	return nil
}

// unpublish bookmark
func UnpublishBookmark(bname string) error {
	// build path
	path, err := BuildPath("bookmark")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// replace
	err = ReplaceLine(fullpath, 0, "isDraft: true")
	if err != nil {
		return err
	}

	fmt.Println("[SIWL] unpublished bookmark:", fname)

	return nil
}
