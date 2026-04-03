# Shloka

A personal Ghost blog theme by [Shivam Kapoor](https://shivamkapoor.com).

## Credits

Based on [Attila](https://github.com/zutrinken/attila) by [zutrinken](http://zutrinken.com), licensed under [MIT](LICENSE).

## Build

```
npm install
npx grunt build
```

The theme zip will be generated at `build/shloka.zip`.

---

## Ghost Admin Setup

Some pages in the theme require corresponding Ghost pages to exist in the admin panel.

### Bookshelf (`/bookshelf/`)

The bookshelf page is driven by the theme template (`page-bookshelf.hbs`) and a separate data page in Ghost. You need two Ghost pages:

#### 1. `bookshelf` page (the visible page)

- Go to **Ghost Admin → Pages → New page**
- Title: `Bookshelf`
- Slug: `bookshelf` (must be exact)
- Leave the page body **empty**
- Visibility: Public
- Publish it

The theme template handles all the HTML and layout automatically.

#### 2. `books-data` page (the data source)

- Go to **Ghost Admin → Pages → New page**
- Title: `books-data`
- Slug: `books-data` (must be exact)
- Visibility: Public
- Add an **HTML block** with the following content:

```html
<script type="application/json" id="books-data">
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "year": 2025,
    "link": "https://www.goodreads.com/book/show/...",
    "cover": "/content/images/books/filename.jpg"
  }
]
</script>
```

- Publish it

Each book object supports these fields:

| Field    | Required | Description |
|----------|----------|-------------|
| `title`  | Yes      | Book title (shown below cover) |
| `author` | Yes      | Author name (shown below title) |
| `year`   | Yes      | Year read — books are grouped and sorted by this |
| `link`   | No       | URL to open when clicking the cover (e.g. Goodreads) |
| `cover`  | No       | Path to cover image (see below); if omitted, falls back to Google Books API |

#### Adding book cover images

**Option A — upload via Ghost admin (easiest)**

1. In the `books-data` page editor, add a temporary **Image block** and upload your cover image
2. Once uploaded, right-click the image → Copy image address — it will be something like `/content/images/2026/04/cover.jpg`
3. Paste that URL as the `cover` value in the JSON
4. Delete the temporary Image block (the uploaded file stays on the server)

**Option B — upload directly to the server**

```bash
scp your-cover.jpg root@<server-ip>:/var/www/blog/content/images/books/
```

Then reference it as `/content/images/books/your-cover.jpg`.

If `cover` is omitted, the bookshelf will try to fetch a cover from the Google Books API using the title and author. If that also fails, a text fallback (title on a grey background) is shown.

#### Adding or updating a book

1. Go to **Ghost Admin → Pages → books-data → Edit**
2. Update the JSON array in the HTML block
3. Optionally copy a new cover image to `/var/www/blog/content/images/books/` on the server
4. Save and publish — changes are live immediately, no theme redeploy needed
