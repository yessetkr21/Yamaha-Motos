document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Navigation ---
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.site-nav')) {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });
    }

    // --- Navbar scroll effect ---
    var nav = document.getElementById('siteNav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // --- WhatsApp FAB visibility ---
    var fab = document.getElementById('whatsappFab');
    if (fab) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href && href !== '#') {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

});