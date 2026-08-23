package handler

import (
	"fmt"
	"path/filepath"
)

// publish article
func PublishArticle(bname string) error {
	// build path
	path, err := BuildPath("article")
	fname := bname + ".md"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// current timestamp
	updateDate, err := ReadArticleProp(fullpath, "updateDate")
	newUpdateDate := CastTimeStamp(GetTimeStamp())

	// replace
	err = ReplaceLine(fullpath, 1, "isDraft:         false")
	err = ReplaceLine(fullpath, 8, "updateDate:      "+newUpdateDate)
	if err != nil {
		return err
	}

	fmt.Println("[SIWL] published article:", fname, "\n", updateDate, "->", newUpdateDate)

	return nil
}

// publish tag
func PublishTag(bname string) error {
	// build path
	path, err := BuildPath("tag")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// replace
	err = ReplaceLine(fullpath, 0, "isDraft: false")
	if err != nil {
		return err
	}

	fmt.Println("[SIWL] published tag:", fname)

	return nil
}

// publish bookmark
func PublishBookmark(bname string) error {
	// build path
	path, err := BuildPath("bookmark")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// replace
	err = ReplaceLine(fullpath, 0, "isDraft: false")
	if err != nil {
		return err
	}

	fmt.Println("[SIWL] published bookmark:", fname)

	return nil
}
