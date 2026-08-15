package handler

import (
	"fmt"
	"os"
	"path/filepath"
	metadata "siwl/type"
	"strings"
	"text/template"
)

// add article
func AddArticle(bname string, metadata metadata.Article) error {
	// frontmatter
	const fromtmatter = `---
isDraft:         {{.IsDraft}}
isLimited:       {{.IsLimited}}
title:           {{.Title}}
category:        {{.Category}}
tags:            [{{ join .Tags ", " }}]
description:     {{.Description}}
publishDate:     {{formatTime .PublishDate}}
updateDate:      {{formatTime .UpdateDate}}
relatedArticles: [{{ join .RelatedArticles ", " }}]
---
`
	t, err := template.New("article").Funcs(template.FuncMap{
		"join": strings.Join,
	}).Funcs(template.FuncMap{
		"formatTime": CastTimeStamp,
	}).Parse(fromtmatter)
	if err != nil {
		return err
	}

	// build path
	path, err := BuildPath("article")
	fname := bname + ".md"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// overwrite warn
	if ExistsFile(fullpath) && !Confirm("Overwrite '"+fname+"'?") {
		fmt.Println("Canceled")
		return nil
	}

	// make file
	file, err := os.Create(fullpath)
	if err != nil {
		return err
	}
	defer file.Close()

	if err := t.Execute(file, metadata); err != nil {
		return err
	}

	fmt.Println("[SIWL] added article:", bname+".md")
	return nil
}

// add tag
func AddTag(bname string, metadata metadata.Tag) error {
	// frontmatter
	const fromtmatter = `isDraft: {{.IsDraft}}
name:    {{.Name}}
belong:  {{.Belong}}
# icon: ./icons/XXXXX.svg
`
	t, err := template.New("tag").Parse(fromtmatter)
	if err != nil {
		return err
	}

	// build path
	path, err := BuildPath("tag")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// overwrite warn
	if ExistsFile(fullpath) && !Confirm("Overwrite '"+fname+"'?") {
		fmt.Println("Canceled")
		return nil
	}

	// make file
	file, err := os.Create(fullpath)
	if err != nil {
		return err
	}
	defer file.Close()

	if err := t.Execute(file, metadata); err != nil {
		return err
	}

	fmt.Println("[SIWL] added tag:", bname+".yaml")
	return nil
}

// add bookmark
func AddBookmark(bname string, metadata metadata.Bookmark) error {
	// frontmatter
	const fromtmatter = `isDraft: {{.IsDraft}}
name:    {{.Name}}
url:     {{.Url}}
`
	t, err := template.New("bookmark").Parse(fromtmatter)
	if err != nil {
		return err
	}

	// build path
	path, err := BuildPath("bookmark")
	fname := bname + ".yaml"
	fullpath := filepath.Join(path, fname)
	if err != nil {
		return err
	}

	// overwrite warn
	if ExistsFile(fullpath) && !Confirm("Overwrite '"+fname+"'?") {
		fmt.Println("Canceled")
		return nil
	}

	// make file
	file, err := os.Create(fullpath)
	if err != nil {
		return err
	}
	defer file.Close()

	if err := t.Execute(file, metadata); err != nil {
		return err
	}

	fmt.Println("[SIWL] added bookmark:", bname+".yaml")
	return nil
}
