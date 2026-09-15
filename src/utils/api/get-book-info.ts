export interface BookInfo {
    title: string;
    author?: string;
    publisher?: string;
    publishedDate?: string;
    coverUrl?: string;
};

export async function getBookInfo(
    isbn: string,
): Promise<BookInfo | null> {
    // Google Books API
    const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`,
        {
            headers: {
                "X-Goog-Api-Key": import.meta.env.GOOGLE_BOOKS_API_KEY,
            },
        },
    );

    if (!res.ok) {
        throw new Error(`Google Books API error: ${res.status}`);
    }

    const data = await res.json()
    const volumeInfo = data.items?.[0]?.volumeInfo
    if (!volumeInfo) {
        return null;
    }

    return {
        title: volumeInfo.title ?? "",
        author: volumeInfo.authors?.join(", "),
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        coverUrl: volumeInfo.imageLinks?.thumbnail?.replace(
            /^http:/,
            "https:",
        ),
    };
}