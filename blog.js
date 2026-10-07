/* Tema + yazı oluşturma yardımcıları (blog ve yönetim paneli ortak kullanır) */
(function () {
    var KEY = 'blog-theme', root = document.documentElement;
    /* Sosyal bağlantılar: tam adresi yaz, dolu olanlar dock'ta görünür. */
    var SOCIAL = { linkedin: '', instagram: '' };
    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function label() { var b = document.getElementById('theme-btn'); if (!b) return; var t = root.getAttribute('data-theme') === 'dark' ? 'Açık mod' : 'Koyu mod'; if (b.hasAttribute('data-icon')) b.setAttribute('data-tip', t); else b.textContent = t; }
    root.setAttribute('data-theme', read() === 'dark' ? 'dark' : 'light');

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }

    /* Renkli teknoloji / kurum logoları (satır içi SVG, dış dosya gerekmez) */
    function box(f) { return '<rect width="24" height="24" rx="5" fill="' + f + '"/>'; }
    function defs(id, a, b) { return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>'; }
    function grad(id, a, b) { return defs(id, a, b) + box('url(#' + id + ')'); }
    function txt(s, fg, fs) { return '<text x="12" y="' + (12 + fs * 0.36).toFixed(1) + '" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="800" font-size="' + fs + '" fill="' + fg + '">' + s + '</text>'; }
    var LOGOS = {
        'c / c++': box('#00599C') + txt('C++', '#fff', 9),
        'python': box('#3776AB') + txt('Py', '#FFD43B', 10),
        'pyqt5': box('#41CD52') + txt('Qt', '#fff', 10),
        'javascript': box('#F7DF1E') + txt('JS', '#111', 10),
        'typescript': box('#3178C6') + txt('TS', '#fff', 10),
        'react': box('#20232A') + '<g fill="none" stroke="#61DAFB" stroke-width="1.1"><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/></g><circle cx="12" cy="12" r="1.5" fill="#61DAFB"/>',
        'vite': defs('lg-vite', '#41D1FF', '#BD34FE') + box('#ffffff') + '<path d="M13.5 3 6 13.5h5L10 21l8-11h-5z" fill="url(#lg-vite)"/>',
        'html5': box('#E34F26') + txt('5', '#fff', 14),
        'css3': box('#1572B6') + txt('3', '#fff', 14),
        'proteus': box('#0E7490') + txt('Pr', '#fff', 10),
        'groq api': box('#F55036') + txt('G', '#fff', 13),
        'edge-tts': box('#0078D4') + txt('E', '#fff', 13),
        'whisper': box('#10A37F') + txt('W', '#fff', 13),
        'pyautogui': box('#7C3AED') + txt('Au', '#fff', 10),
        'canvas api': box('#F97316') + txt('Cv', '#fff', 10),
        'open-meteo api': box('#0EA5E9') + txt('OM', '#fff', 9),
        'tcmb api': box('#B91C1C') + txt('TC', '#fff', 10),
        'coingecko api': box('#8CC351') + txt('CG', '#fff', 10),
        'vercel': box('#000000') + '<path d="M12 6 19 18H5z" fill="#fff"/>',
        'jarvis': grad('lg-jv', '#38bdf8', '#2563eb') + '<circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 1.6"/><circle cx="12" cy="12" r="2.4" fill="#fff"/>',
        'finance': grad('lg-fc', '#34d399', '#059669') + '<g fill="#fff"><rect x="5.5" y="12.5" width="3.2" height="6" rx=".6"/><rect x="10.4" y="8.5" width="3.2" height="10" rx=".6"/><rect x="15.3" y="5" width="3.2" height="13.5" rx=".6"/></g>',
        'tekuni': grad('lg-tu', '#fbbf24', '#ea580c') + '<path d="M5 6.5h5.5A1.5 1.5 0 0 1 12 8v10a1.5 1.5 0 0 0-1.5-1.5H5zM19 6.5h-5.5A1.5 1.5 0 0 0 12 8v10a1.5 1.5 0 0 1 1.5-1.5H19z" fill="#fff"/>',
        'portfolio': grad('lg-pf', '#22d3ee', '#0e7490') + '<circle cx="12" cy="12" r="6" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
        'google': box('#4285F4') + txt('G', '#fff', 13),
        'kbu': grad('lg-kbu', '#1e3a8a', '#3b82f6') + '<path d="M12 5 2.5 9.5 12 14l7-3.3V16h1.8V9.5z" fill="#fff"/><path d="M6.2 12.8v3.2c0 1.4 2.6 2.8 5.8 2.8s5.8-1.4 5.8-2.8v-3.2L12 15.6z" fill="#fff" opacity=".85"/>'
    };

    /* Zaman çizelgesi (açılır liste): en yenisi en üstte. d: tarih, t: başlık, s: alt başlık, x: açıklama, l: logo adı, k: iç kartlar [{t, d}] (isteğe bağlı). */
    var TIMELINE = [
        { d: 'Şimdi', t: 'Karabük Üniversitesi', s: 'Elektrik-Elektronik Mühendisliği', l: 'kbu',
          x: '%100 İngilizce eğitim veren Elektrik-Elektronik Mühendisliği programında öğrenciyim.' },
        { d: 'Ekim 2026', t: 'Blogun açılışı', s: 'Kişisel blog', l: 'portfolio',
          x: 'Yazılım projeleri ve mühendislik notları üzerine yazılar yayımlamaya başladım.',
          k: [{ t: 'J.A.R.V.I.S.: Sesli Yapay Zeka Asistanı Projesi', d: '6 Ekim 2026' }] },
        { d: '2026', t: 'Web projeleri yayında', s: '3 proje', l: 'finance',
          x: 'Finans takibi, ders notu paylaşımı ve kişisel tanıtım için üç web projesini canlıya aldım.',
          k: [{ t: 'Finance Control', d: '2026' }, { t: 'TeküniArşiv', d: '2026' }, { t: 'Kişisel Portföy', d: '2026' }] },
        { d: '2025', t: 'J.A.R.V.I.S. Yapay Zeka Asistanı', s: 'Build 6.0.1 · Aktif geliştirme', l: 'jarvis',
          x: 'PyQt5 tabanlı, sesli komutla çalışan bir masaüstü asistanı geliştiriyorum. Groq API, Whisper ve Edge-TTS ile konuşuyor, PyAutoGUI ile ekranı kontrol ediyor.' }
    ];

    /* Sertifikalar: t: ad, o: veren kurum, d: tarih, l: logo adı, img: görsel yolu (blog/ klasörüne göre), x: ne işe yaradığı, u: doğrulama bağlantısı. d ve u boş bırakılabilir. */
    var CERTS = [
        { t: 'Kodlama Sertifikası', o: 'Google Digital Garage', d: '', l: 'google', u: '', img: 'sertifikalar/google-kodlama.jpg', x: 'Google Digital Garage kodlama eğitimini tamamladığımı belgeler.' }
    ];

    /* Eğitim: u verilirse satır okulun alan adına gider. */
    var EDU = [
        { t: 'Karabük Üniversitesi', o: 'Elektrik-Elektronik Mühendisliği (%100 İngilizce)', l: 'kbu', u: 'https://www.karabuk.edu.tr' }
    ];

    var CH = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
    function rowInner(c, sub, hint, link) { return '<div class="what"><div class="tile">' + BLOG.logo(c.l) + '</div><div><b>' + esc(c.t) + (link ? CH : '') + '</b><small>' + esc(sub) + '</small></div></div>' + (c.d ? '<span class="rdate">' + esc(c.d) + '</span>' : '<span class="go">' + hint + '</span>'); }

    window.BLOG = {
        logo: function (name) { var b = LOGOS[String(name).toLowerCase()]; return b ? '<svg viewBox="0 0 24 24" aria-hidden="true">' + b + '</svg>' : ''; },
        openCert: function (i) {
            var c = CERTS[i], sh = document.getElementById('sheet');
            if (!sh) {
                var bg = document.createElement('div'); bg.id = 'sheet-bg'; bg.onclick = BLOG.closeCert;
                sh = document.createElement('aside'); sh.id = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
                sh.innerHTML = '<button class="x" type="button" aria-label="Kapat">&times;</button><div class="sh-body"><div class="sh-img"></div><div class="sh-txt"><h3></h3><div class="sh-org"></div><h4>Ne işe yarar?</h4><p></p><a class="sh-link" target="_blank" rel="noopener">Sertifikayı doğrula &#8599;</a></div></div>';
                sh.querySelector('.x').onclick = BLOG.closeCert;
                document.body.appendChild(bg); document.body.appendChild(sh);
                document.addEventListener('keydown', function (e) { if (e.key === 'Escape') BLOG.closeCert(); });
            }
            sh.querySelector('h3').textContent = c.t;
            sh.querySelector('.sh-org').textContent = c.o + (c.d ? ' \u00b7 ' + c.d : '');
            sh.querySelector('p').textContent = c.x || '';
            var lk = sh.querySelector('.sh-link'); lk.style.display = c.u ? 'inline-block' : 'none'; if (c.u) lk.href = c.u;
            var box = sh.querySelector('.sh-img'); box.innerHTML = '';
            if (c.img) {
                var im = new Image(); im.alt = c.t + ' sertifikası';
                im.onerror = function () { box.innerHTML = '<div class="ph-img">Sertifika görseli henüz eklenmedi</div>'; };
                im.src = c.img; box.appendChild(im);
            } else { box.innerHTML = '<div class="ph-img">Sertifika görseli henüz eklenmedi</div>'; }
            BLOG._from = document.activeElement;
            document.body.classList.add('sheet-open');
            sh.querySelector('.x').focus();
        },
        closeCert: function () {
            document.body.classList.remove('sheet-open');
            if (BLOG._from && BLOG._from.focus) BLOG._from.focus();
        },
        toggle: function (b) { var li = b.parentNode, o = li.classList.toggle('open'); b.setAttribute('aria-expanded', o); },
        decorate: function () {
            var cs = document.getElementById('certs');
            var ed = document.getElementById('edu');
            if (ed) ed.innerHTML = EDU.map(function (e) { var host = String(e.u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, ''); return e.u ? '<a class="row link" href="' + esc(e.u) + '" target="_blank" rel="noopener">' + rowInner(e, e.o, esc(host) + ' &#8599;', true) + '</a>' : '<div class="row">' + rowInner(e, e.o, '', false) + '</div>'; }).join('');
            if (cs) cs.innerHTML = CERTS.map(function (c, i) { return '<button class="row link" type="button" onclick="BLOG.openCert(' + i + ')">' + rowInner(c, c.o, 'Görüntüle &#8593;', true) + '</button>'; }).join('');
            var tl = document.getElementById('timeline');
            if (tl) tl.innerHTML = TIMELINE.map(function (e, i) {
                var kids = (e.k || []).map(function (k) { return '<div class="sub"><b>' + esc(k.t) + '</b><span>' + esc(k.d) + '</span></div>'; }).join('');
                return '<li' + (i === 0 ? ' class="open"' : '') + '><button class="tl-head" type="button" aria-expanded="' + (i === 0) + '" onclick="BLOG.toggle(this)"><span class="tile">' + BLOG.logo(e.l) + '</span><span class="tl-main"><b>' + esc(e.t) + '<svg class="caret" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></b><small>' + esc(e.s || '') + '</small></span><span class="tl-date">' + esc(e.d) + '</span></button><div class="tl-panel"><div class="tl-inner"><p>' + esc(e.x) + '</p>' + kids + '</div></div></li>';
            }).join('');
            [].forEach.call(document.querySelectorAll('[data-chips]'), function (el) { el.innerHTML = el.getAttribute('data-chips').split('|').map(function (n) { return '<span>' + BLOG.logo(n) + esc(n) + '</span>'; }).join(''); });
            [].forEach.call(document.querySelectorAll('[data-logo]'), function (el) { el.innerHTML = BLOG.logo(el.getAttribute('data-logo')); });
        },
        dock: function (o) {
            var S = o.social || SOCIAL;
            var P = {
                home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
                folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
                file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
                git: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
                mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
                linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
                instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
                sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
            };
            function svg(k) { return '<svg viewBox="0 0 24 24">' + P[k] + '</svg>'; }
            function a(t, h, k, ext) { return '<a href="' + h + '" data-tip="' + t + '" aria-label="' + t + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + svg(k) + '</a>'; }
            var d = document.createElement('nav'); d.id = 'dock';
            d.innerHTML = a('Ana Sayfa', o.home, 'home') + a('Projeler', o.proj, 'folder') + a('Yazılar', o.posts, 'file') + '<span class="sep"></span>' +
                a('GitHub', 'https://github.com/thalesing', 'git', 1) + (S.linkedin ? a('LinkedIn', S.linkedin, 'linkedin', 1) : '') + (S.instagram ? a('Instagram', S.instagram, 'instagram', 1) : '') + a('E-posta', 'mailto:tahakarabacak7842@gmail.com', 'mail') +
                '<span class="sep"></span><button id="theme-btn" type="button" data-icon="1" aria-label="Tema">' + svg('sun') + '</button>';
            var items = [].slice.call(d.querySelectorAll('a, button'));
            d.addEventListener('mousemove', function (e) {
                items.forEach(function (el) {
                    var r = el.getBoundingClientRect(), dist = Math.abs(e.clientX - (r.left + r.width / 2));
                    el.style.setProperty('--s', (1 + 0.6 * Math.max(0, 1 - dist / 64)).toFixed(3));
                });
            });
            d.addEventListener('mouseleave', function () { items.forEach(function (el) { el.style.setProperty('--s', 1); }); });
            document.body.appendChild(d);
        },
        esc: esc,
        initTheme: function () {
            label();
            var b = document.getElementById('theme-btn');
            if (b) b.onclick = function () {
                var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', t);
                try { localStorage.setItem(KEY, t); } catch (e) {}
                label();
            };
        },
        md: function (t) {
            var out = [];
            t.trim().split(/\n{2,}/).forEach(function (b) {
                b = b.trim(); if (!b) return;
                var lines = b.split('\n');
                if (lines.length === 1 && /^## /.test(b)) { out.push('<h2>' + inline(b.slice(3)) + '</h2>'); return; }
                if (lines.every(function (l) { return /^- /.test(l); })) {
                    out.push('<ul>' + lines.map(function (l) { return '<li>' + inline(l.slice(2)) + '</li>'; }).join('') + '</ul>'); return;
                }
                out.push('<p>' + lines.map(inline).join('<br>') + '</p>');
            });
            return out.join('\n');
        },
        load: function () {
            if (window.POSTS) return Promise.resolve(window.POSTS);
            return fetch('posts.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
        },
        tags: function (p) { return (p.tags && p.tags.length) ? '<div class="tags">' + p.tags.map(function (t) { return '<span>' + BLOG.logo(t) + esc(t) + '</span>'; }).join('') + '</div>' : ''; },
        mins: function (p) { return Math.max(1, Math.round(p.body.split(/\s+/).length / 200)); },
        renderList: function (ul, posts, link) {
            link = link || function (p) { return 'post.html?s=' + encodeURIComponent(p.slug); };
            if (!posts.length) { ul.innerHTML = '<li>Henüz yazı yok.</li>'; return; }
            ul.innerHTML = posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).map(function (p) {
                return '<li><div class="pm"><time datetime="' + esc(p.date) + '">' + esc(p.date) + '</time> &middot; ' + BLOG.mins(p) + ' dk okuma</div><a class="title" href="' + link(p) + '">' + esc(p.title) + '</a><p>' + esc(p.summary || '') + '</p>' + BLOG.tags(p) + '</li>';
            }).join('');
        },
        renderPost: function (el, p) {
            el.innerHTML = '<h1>' + esc(p.title) + '</h1><div class="pm">Taha Efe Karabacak &middot; <time datetime="' + esc(p.date) + '">' + esc(p.date) + '</time> &middot; ' + BLOG.mins(p) + ' dk okuma</div>' + BLOG.tags(p) + '<div class="body">' + BLOG.md(p.body) + '</div>';
        }
    };
})();
