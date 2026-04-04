(function() {
    var API_KEY = 'eee5570fd18c98ef8db173ff08';
    var url = '/ghost/api/content/pages/?filter=slug:about-data&key=' + API_KEY + '&fields=html';

    fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data.pages[0].html, 'text/html');
            var about = JSON.parse(doc.getElementById('about-data').textContent);
            renderAbout(about);
        })
        .catch(function(err) {
            console.error('About: failed to load about-data', err);
        });

    function parseInline(text, name) {
        // Replace {name} with styled span
        text = text.replace(/\{name\}/g, '<span class="about-name">' + name + '</span>');
        // Replace [text](url) with anchor tags
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        return text;
    }

    function keyToTitle(key) {
        return key.split('-').map(function(w) {
            return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
    }

    function renderAbout(about) {
        var el = document.getElementById('about-content');

        // Bio
        if (about.bio) {
            about.bio.forEach(function(para) {
                var p = document.createElement('p');
                p.innerHTML = parseInline(para, about.name || '');
                el.appendChild(p);
            });
        }

        // Sections — iterate keys, skip name and bio
        var skipKeys = { 'name': true, 'bio': true };
        Object.keys(about).forEach(function(key) {
            if (skipKeys[key]) return;

            var h2 = document.createElement('h2');
            h2.textContent = keyToTitle(key);
            el.appendChild(h2);

            var items = about[key];

            if (key === 'past-experiences') {
                items.forEach(function(item) {
                    var h4 = document.createElement('h4');
                    h4.innerHTML = item.title + ' <span class="muted-label">— ' + item.company + '</span>';
                    el.appendChild(h4);

                    var h5 = document.createElement('h5');
                    h5.textContent = 'Joined ' + item.year;
                    el.appendChild(h5);

                    var p = document.createElement('p');
                    p.textContent = item.description;
                    el.appendChild(p);
                });
            } else if (key === 'education') {
                items.forEach(function(item) {
                    var p = document.createElement('p');
                    p.innerHTML = item.degree + '<br><span class="muted-label">' + item.institution + ', ' + item.year + '</span>';
                    el.appendChild(p);
                });
            } else if (key === 'publications') {
                items.forEach(function(item) {
                    var p = document.createElement('p');
                    p.innerHTML = '<a href="' + item.url + '" target="_blank" rel="noopener"><strong>' + item.title + '</strong></a><br>' + item.description;
                    el.appendChild(p);
                });
            } else if (key === 'certifications') {
                var ol = document.createElement('ol');
                items.forEach(function(item) {
                    var li = document.createElement('li');
                    li.innerHTML = '<a href="' + item.url + '" target="_blank" rel="noopener">' + item.title + '</a><span class="muted-label"> — ' + item.issuer + '</span>';
                    ol.appendChild(li);
                });
                el.appendChild(ol);
            }
        });
    }
})();
