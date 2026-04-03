(function() {
    var API_KEY = 'eee5570fd18c98ef8db173ff08';
    var url = '/ghost/api/content/pages/?filter=slug:books-data&key=' + API_KEY + '&fields=html';

    fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data.pages[0].html, 'text/html');
            var books = JSON.parse(doc.getElementById('books-data').textContent);
            renderBooks(books);
        })
        .catch(function(err) {
            console.error('Bookshelf: failed to load books-data', err);
        });

    function fetchBookCover(title, author) {
        var q = 'intitle:' + encodeURIComponent(title) + '+inauthor:' + encodeURIComponent(author);
        return fetch('https://www.googleapis.com/books/v1/volumes?q=' + q + '&maxResults=1')
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data.items && data.items[0].volumeInfo.imageLinks) {
                    var links = data.items[0].volumeInfo.imageLinks;
                    var url = links.thumbnail || links.smallThumbnail || '';
                    return url.replace('http:', 'https:').replace('zoom=1', 'zoom=2');
                }
                return null;
            })
            .catch(function() { return null; });
    }

    function renderBooks(books) {
        var contentEl = document.getElementById('bookshelf-content');
        var years = [];
        var byYear = {};

        books.filter(function(b) { return !b.hidden; }).forEach(function(b) {
            var y = String(b.year);
            if (!byYear[y]) { byYear[y] = []; years.push(y); }
            byYear[y].push(b);
        });
        years = [...new Set(years)].sort(function(a, b) { return b - a; });

        years.forEach(function(year) {
            var section = document.createElement('div');
            section.className = 'bookshelf-year-section';

            var heading = document.createElement('h4');
            heading.className = 'bookshelf-year-label';
            heading.textContent = year;
            section.appendChild(heading);

            var grid = document.createElement('div');
            grid.className = 'bookshelf-grid';

            byYear[year].forEach(function(book) {
                var card = document.createElement('div');
                card.className = 'bookshelf-book';

                var coverWrap = document.createElement('div');
                coverWrap.className = 'bookshelf-cover-wrap';

                var inner = book.link ? document.createElement('a') : document.createElement('div');
                if (book.link) {
                    inner.href = book.link;
                    inner.target = '_blank';
                    inner.rel = 'noopener';
                }

                var img = document.createElement('img');
                img.className = 'bookshelf-cover';
                img.alt = book.title;
                img.loading = 'lazy';

                var fallback = document.createElement('div');
                fallback.className = 'bookshelf-cover-fallback';
                fallback.textContent = book.title;

                img.onerror = function() {
                    this.style.display = 'none';
                    if (!coverWrap.contains(fallback)) coverWrap.appendChild(fallback);
                };

                if (book.cover) {
                    img.src = book.cover;
                } else {
                    coverWrap.appendChild(fallback);
                    fetchBookCover(book.title, book.author).then(function(url) {
                        if (url) {
                            img.src = url;
                            if (fallback.parentNode) fallback.remove();
                        }
                    });
                }

                inner.appendChild(img);
                coverWrap.appendChild(inner);
                card.appendChild(coverWrap);

                var titleEl = document.createElement('div');
                titleEl.className = 'bookshelf-title';
                titleEl.textContent = book.title;
                card.appendChild(titleEl);

                var authorEl = document.createElement('div');
                authorEl.className = 'bookshelf-author';
                authorEl.textContent = book.author;
                card.appendChild(authorEl);

                grid.appendChild(card);
            });

            section.appendChild(grid);
            contentEl.appendChild(section);
        });
    }
})();
