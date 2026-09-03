(function () {
    const links = document.querySelectorAll('.article-toc a');
    const sections = Array.from(links).map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) { link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id); });
            });
        }, { rootMargin: '-25% 0px -65% 0px' });
        sections.forEach(function (section) { observer.observe(section); });
    }
    const copyButton = document.getElementById('copy-article-link');
    if (copyButton) copyButton.addEventListener('click', function () {
        const status = document.getElementById('copy-status');
        if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
        status.textContent = 'Link copied';
        setTimeout(function () { status.textContent = ''; }, 1800);
    });
})();
