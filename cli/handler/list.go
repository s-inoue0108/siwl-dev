package handler

import (
	"fmt"
	"path/filepath"
	"strconv"
)

// list article
func ListArticle(isTitle bool) error {
	// get path
	path, err := BuildPath("article")

	// scan
	files, err := GetFiles(path, "md")
	if err != nil {
		return err
	}

	// display
	for _, entry := range files {
		fullpath := filepath.Join(path, entry)
		category, err := ReadArticleProp(fullpath, "category")
		if err != nil {
			return err
		}

		if isTitle {
			entry, err = ReadArticleProp(fullpath, "title")
			if err != nil {
				return err
			}
		}

		var dispCategory string
		switch category {
		case "tech":
			dispCategory = "\033[36m " + category + "\033[0m"
		case "idea":
			dispCategory = "\033[34m " + category + "\033[0m"
		default:
			return fmt.Errorf("invalid category")
		}

		isDraft, err := ReadArticleProp(fullpath, "isDraft")
		isDraftBool, err := strconv.ParseBool(isDraft)
		if err != nil {
			return err
		}

		var dispDraft string
		if isDraftBool {
			dispDraft = "\033[31mdft\033[0m"
		} else {
			dispDraft = "\033[32mpub\033[0m"
		}

		isLimited, err := ReadArticleProp(fullpath, "isLimited")
		isLimitedBool, err := strconv.ParseBool(isLimited)
		if err != nil {
			return err
		}

		var dispLimited string
		if isLimitedBool {
			dispLimited = "\033[31mlim\033[0m"
		} else {
			dispLimited = "\033[32mulm\033[0m"
		}

		fmt.Println(dispCategory, "|", dispDraft, "|", dispLimited, "|", entry)
	}
	return nil
}

// list tag
func ListTag(isName bool) error {
	// get path
	path, err := BuildPath("tag")

	// scan
	files, err := GetFiles(path, "yaml")
	if err != nil {
		return err
	}

	// display
	for _, entry := range files {
		fullpath := filepath.Join(path, entry)
		belong, err := ReadTagProp(fullpath, "belong")
		if err != nil {
			return err
		}

		if isName {
			entry, err = ReadTagProp(fullpath, "name")
			if err != nil {
				return err
			}
		}

		var dispBelong string
		switch belong {
		case "tech":
			dispBelong = "\033[36m " + belong + "\033[0m"
		case "idea":
			dispBelong = "\033[34m " + belong + "\033[0m"
		default:
			return fmt.Errorf("invalid belong")
		}

		isDraft, err := ReadTagProp(fullpath, "isDraft")
		isDraftBool, err := strconv.ParseBool(isDraft)
		if err != nil {
			return err
		}

		var dispDraft string
		if isDraftBool {
			dispDraft = "\033[31mdft\033[0m"
		} else {
			dispDraft = "\033[32mpub\033[0m"
		}

		fmt.Println(dispBelong, "|", dispDraft, "|", entry)
	}
	return nil
}

// list bookmark
func ListBookmark(isName bool, isUrl bool) error {
	// get path
	path, err := BuildPath("bookmark")

	// scan
	files, err := GetFiles(path, "yaml")
	if err != nil {
		return err
	}

	// display
	for _, entry := range files {
		fullpath := filepath.Join(path, entry)

		if isName {
			entry, err = ReadBookmarkProp(fullpath, "name")
			if err != nil {
				return err
			}
		} else if isUrl {
			entry, err = ReadBookmarkProp(fullpath, "url")
			if err != nil {
				return err
			}
		}

		isDraft, err := ReadBookmarkProp(fullpath, "isDraft")
		isDraftBool, err := strconv.ParseBool(isDraft)
		if err != nil {
			return err
		}

		var dispDraft string
		if isDraftBool {
			dispDraft = "\033[31m dft\033[0m"
		} else {
			dispDraft = "\033[32m pub\033[0m"
		}

		fmt.Println(dispDraft, "|", entry)
	}
	return nil
}
