/* Neko-Void — app.js (Fixed & Modularized) */

/**
 * Detecta automáticamente el idioma basado en la zona horaria del navegador
 * @returns {string} Código de idioma detectado ('en', 'es', 'ja')
 */
function detectLanguageFromTimezone() {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Mapeo de zonas horarias a idiomas
        const timezoneToLanguage = {
            // Zonas horarias de habla hispana
            'America/Mexico_City': 'es',
            'America/Bogota': 'es',
            'America/Lima': 'es',
            'America/Santiago': 'es',
            'America/Argentina/Buenos_Aires': 'es',
            'America/Montevideo': 'es',
            'America/Caracas': 'es',
            'America/Guatemala': 'es',
            'America/San_Salvador': 'es',
            'America/Tegucigalpa': 'es',
            'America/Managua': 'es',
            'America/Costa_Rica': 'es',
            'America/Panama': 'es',
            'America/Havana': 'es',
            'America/Santo_Domingo': 'es',
            'America/Puerto_Rico': 'es',
            'America/La_Paz': 'es',
            'America/Quito': 'es',
            'America/Asuncion': 'es',
            'Europe/Madrid': 'es',
            'Atlantic/Canary': 'es',
            'Africa/Ceuta': 'es',

            // Zonas horarias de Japón
            'Asia/Tokyo': 'ja',
        };

        // Buscar coincidencia exacta
        if (timezoneToLanguage[timeZone]) {
            return timezoneToLanguage[timeZone];
        }

        // Si no hay coincidencia, usar el idioma del navegador como fallback
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langCode = browserLang.split('-')[0].toLowerCase();
            if (['en', 'es', 'ja'].includes(langCode)) {
                return langCode;
            }
        }

        return 'en';
    } catch (error) {
        console.warn('Error detecting language from timezone:', error);
        return 'en';
    }
}

const UIManager = {
    currentLang: 'en',

    init() {
        // Detectar idioma automáticamente basado en la zona horaria del navegador
        const detectedLang = detectLanguageFromTimezone();
        console.log(`Detected language from timezone: ${detectedLang}`);

        this.currentLang = detectedLang;

        // Aplicar idioma detectado vía clases CSS
        this.updateLanguageUI(detectedLang);

        this.initLightbox();
        this.initNavTabs();
        this.initLangDropdown();
        this.exposeGlobals();
    },

    /**
     * Actualiza la interfaz de usuario para reflejar el idioma seleccionado.
     * El sistema de idiomas funciona puramente con clases CSS en el body
     * (lang-en, lang-es, lang-ja) que muestran/ocultan spans con esas clases.
     * @param {string} lang - Código de idioma ('en', 'es', 'ja')
     */
    updateLanguageUI(lang) {
        // Update body class for CSS-based language switching
        document.body.classList.remove('lang-en', 'lang-es', 'lang-ja');
        document.body.classList.add(`lang-${lang}`);

        // Update desktop dropdown options
        document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
        const activeDesktop = document.getElementById(`btn-${lang}`);
        if (activeDesktop) activeDesktop.classList.add('active');

        // Update mobile pill buttons
        document.querySelectorAll('.lang-btn-pill').forEach(btn => btn.classList.remove('active'));
        const activeMobile = document.getElementById(`btn-${lang}-mobile`);
        if (activeMobile) activeMobile.classList.add('active');

        // Update dropdown trigger label
        const label = document.getElementById('lang-current-label');
        if (label) label.textContent = lang.toUpperCase();
    },

    initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');

        if (!lightbox || !lightboxImg) return;

        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    },

    initNavTabs() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.app-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('data-target');
                if (!targetId) return;

                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Update active section
                sections.forEach(sec => sec.classList.remove('active'));
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }

                // Close mobile menu when clicking a nav link
                this.closeMobileMenu();
            });
        });
    },

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');

        if (navLinks && menuToggle) {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        }
    },

    closeMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');

        if (navLinks && menuToggle) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    },

    setLanguage(lang) {
        if (!['en', 'es', 'ja'].includes(lang)) return;
        this.currentLang = lang;
        this.updateLanguageUI(lang);
        this.closeLangDropdown();
    },

    initLangDropdown() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('lang-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    },

    toggleLangDropdown() {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.toggle('open');
    },

    closeLangDropdown() {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('open');
    },

    openTab(event, targetId) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        const targetElement = document.getElementById(targetId);
        if (targetElement) targetElement.classList.add('active');
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }
    },

    exposeGlobals() {
        window.setLang = this.setLanguage.bind(this);
        window.openTab = this.openTab.bind(this);
        window.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        window.closeMobileMenu = this.closeMobileMenu.bind(this);
        window.toggleLangDropdown = this.toggleLangDropdown.bind(this);
        window.closeLangDropdown = this.closeLangDropdown.bind(this);
    }
};

const NetworkManager = {
    async loadDownloads() {
        await Promise.allSettled([
            this.fetchMainIsos(),
            this.fetchFlavors()
        ]);
    },

    async fetchMainIsos() {
        try {
            const response = await fetch('https://huggingface.co/arepaconcafe/neko-base/resolve/main/downloads.xml');
            if (!response.ok) throw new Error('Failed to fetch downloads.xml');

            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');

            this.updateVersion(xmlDoc);
            this.setupIsoLinks(xmlDoc);
        } catch (error) {
            console.error('Error loading downloads:', error);
        }
    },

    updateVersion(xmlDoc) {
        const release = xmlDoc.querySelector('release');
        const versionTag = document.getElementById('version-tag');

        if (release && versionTag) {
            const version = release.getAttribute('version');
            versionTag.innerHTML = `<span class="en">v. ${version}</span><span class="es">v. ${version}</span><span class="ja">v. ${version}</span>`;
        }
    },

    setupIsoLinks(xmlDoc) {
        xmlDoc.querySelectorAll('iso').forEach(iso => {
            const id = iso.getAttribute('id');
            const url = iso.textContent.trim();
            const hash = iso.getAttribute('sha256');

            if (id === 'link-xorg') this.bindDownloadButton('link-xorg', 'hash-xorg', url, hash);
            if (id === 'link-xlibre') this.bindDownloadButton('link-xlibre', 'hash-xlibre', url, hash);
        });
    },

    bindDownloadButton(btnId, hashId, url, hash) {
        const btn = document.getElementById(btnId);
        const hashEl = document.getElementById(hashId);

        if (btn) btn.onclick = () => window.open(url, '_blank');

        if (hashEl) {
            hashEl.textContent = `SHA256: ${hash}`;
            hashEl.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(hash);
                    hashEl.style.color = 'var(--green)';
                    setTimeout(() => hashEl.style.color = 'var(--comment)', 1000);
                } catch (err) {
                    console.warn('Clipboard copy failed:', err);
                }
            };
        }
    },

    async fetchFlavors() {
        try {
            const response = await fetch('https://huggingface.co/arepaconcafe/neko-base/resolve/main/flavors.xml');
            if (!response.ok) throw new Error('Failed to fetch flavors.xml');

            const xmlText = await response.text();
            const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');

            xmlDoc.querySelectorAll('flavor').forEach(flavor => {
                const id = flavor.getAttribute('id');
                const url = flavor.textContent.trim();
                const hash = flavor.getAttribute('sha256');
                const btn = document.getElementById(`flavor-${id}`);

                if (btn && url && url.length > 0) {
                    // Get the correct download text based on current language
                    const downloadTexts = {
                        en: 'Download',
                        es: 'Descargar',
                        ja: 'ダウンロード'
                    };

                    btn.innerHTML = `<span class="en">${downloadTexts.en}</span><span class="es">${downloadTexts.es}</span><span class="ja">${downloadTexts.ja}</span>`;

                    btn.className = 'btn-edition btn-outline';
                    btn.disabled = false;
                    btn.style.cursor = 'pointer';

                    btn.onclick = () => window.open(url, '_blank');

                    // Add SHA256 hash display if available
                    if (hash) {
                        this.addFlavorHash(id, hash);
                    }
                }
            });
        } catch (error) {
            console.warn('Flavors file not found or could not be loaded.');
        }
    },

    addFlavorHash(flavorId, hash) {
        const btn = document.getElementById(`flavor-${flavorId}`);
        if (!btn) return;

        const card = btn.closest('.edition-item');
        if (!card) return;

        // Check if hash element already exists
        let hashEl = card.querySelector('.hash-text-inline');
        if (!hashEl) {
            hashEl = document.createElement('span');
            hashEl.id = `hash-${flavorId}`;
            hashEl.className = 'hash-text-inline';
            hashEl.title = 'Click to copy';
            hashEl.style.cursor = 'pointer';
            btn.parentNode.insertBefore(hashEl, btn.nextSibling);
        }

        hashEl.textContent = `SHA256: ${hash}`;
        hashEl.onclick = async () => {
            try {
                await navigator.clipboard.writeText(hash);
                hashEl.style.color = 'var(--green)';
                setTimeout(() => hashEl.style.color = '', 1000);
            } catch (err) {
                console.warn('Clipboard copy failed:', err);
            }
        };
    }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
    NetworkManager.loadDownloads();
});
