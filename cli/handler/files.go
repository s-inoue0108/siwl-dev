package handler

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// build path
func BuildPath(model string) (string, error) {
	if model != "article" && model != "tag" && model != "bookmark" {
		return "", fmt.Errorf("only model is 'article' or 'tag' or 'bookmark'")
	}

	// current
	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	// build path
	path := filepath.Join(cwd, "..", "src", "content", model)
	return path, nil
}

// get files
func GetFiles(path string, ext string) ([]string, error) {
	// scan
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var files []string
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		en := entry.Name()
		if filepath.Ext(en) != "."+ext {
			continue
		}
		files = append(files, en)
	}
	return files, nil
}

func ReadFileLines(path string) ([]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	lines := strings.Split(string(data), "\n")

	return lines, nil
}

func ReadArticleProp(path string, propKey string) (string, error) {
	if propKey != "updateDate" && propKey != "isDraft" && propKey != "isLimited" && propKey != "title" && propKey != "category" {
		return "", fmt.Errorf("invalid metadata key")
	}

	lines, err := ReadFileLines(path)
	if err != nil {
		return "", err
	}

	var hit []string
	for _, row := range lines {
		if strings.HasPrefix(row, propKey+":") {
			parts := strings.SplitN(row, ": ", 2)
			value := strings.TrimSpace(parts[1])
			hit = append(hit, value)
		}
	}
	if len(hit) < 1 {
		return "", fmt.Errorf("failed to parse frontmatter")
	}

	return hit[0], nil
}

func ReadTagProp(path string, propKey string) (string, error) {
	if propKey != "isDraft" && propKey != "name" && propKey != "belong" {
		return "", fmt.Errorf("invalid metadata key")
	}

	lines, err := ReadFileLines(path)
	if err != nil {
		return "", err
	}

	var hit []string
	for _, row := range lines {
		if strings.HasPrefix(row, propKey+":") {
			parts := strings.SplitN(row, ": ", 2)
			value := strings.TrimSpace(parts[1])
			hit = append(hit, value)
		}
	}
	if len(hit) < 1 {
		return "", fmt.Errorf("failed to parse frontmatter")
	}

	return hit[0], nil
}

func ReadBookmarkProp(path string, propKey string) (string, error) {
	if propKey != "isDraft" && propKey != "name" && propKey != "url" {
		return "", fmt.Errorf("invalid metadata key")
	}

	lines, err := ReadFileLines(path)
	if err != nil {
		return "", err
	}

	var hit []string
	for _, row := range lines {
		if strings.HasPrefix(row, propKey+":") {
			parts := strings.SplitN(row, ": ", 2)
			value := strings.TrimSpace(parts[1])
			hit = append(hit, value)
		}
	}
	if len(hit) < 1 {
		return "", fmt.Errorf("failed to parse frontmatter")
	}

	return hit[0], nil
}

func ReplaceLine(path string, n int, replacement string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	lines := strings.Split(string(data), "\n")

	if n < 0 || n >= len(lines) {
		return fmt.Errorf("line out of range: %d", n)
	}

	lines[n] = replacement

	return os.WriteFile(
		path,
		[]byte(strings.Join(lines, "\n")),
		0644,
	)
}

func ExistsFile(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func Confirm(message string) bool {
	fmt.Printf("%s [y/n]: ", message)

	var answer string
	fmt.Scanln(&answer)

	return strings.EqualFold(answer, "y") ||
		strings.EqualFold(answer, "yes")
}
