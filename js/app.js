/* Neko-Void — app.js (Modularized i18n) */

// Import translations (will be loaded dynamically)
let translations = {};
let currentLang = 'en';

/**
 * Detecta automáticamente el idioma basado en la zona horaria del navegador
 * @returns {string} Código de idioma detectado ('en', 'es', 'ja')
 */
function detectLanguageFromTimezone() {
    try {
        // Obtener la zona horaria del navegador
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
            'America/Tegucigalpas': 'es',
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
            'Asia/Osaka': 'ja',
            'Asia/Nagoya': 'ja',
            'Asia/Sapporo': 'ja',
            'Asia/Fukuoka': 'ja',
            
            // Por defecto, inglés para otras zonas
        };
        
        // Buscar coincidencia exacta o parcial de la zona horaria
        for (const [tz, lang] of Object.entries(timezoneToLanguage)) {
            if (timeZone === tz || timeZone.startsWith(tz.split('/')[0])) {
                return lang;
            }
        }
        
        // Si no hay coincidencia, usar el idioma del navegador como fallback
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const langCode = browserLang.split('-')[0].toLowerCase();
            if (['en', 'es', 'ja'].includes(langCode)) {
                return langCode;
            }
        }
        
        // Default a inglés
        return 'en';
    } catch (error) {
        console.warn('Error detecting language from timezone:', error);
        return 'en';
    }
}

const I18nManager = {
    async init(lang = 'en') {
        currentLang = lang;
        await this.loadTranslations(lang);
        this.applyTranslations();
    },

    async loadTranslations(lang) {
        try {
            const response = await fetch(`./i18n/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
            translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English
            if (lang !== 'en') {
                const response = await fetch('./i18n/en.json');
                translations = await response.json();
            }
        }
    },

    t(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], translations);
    },

    applyTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = this.t(key);
            if (value !== undefined) {
                el.innerHTML = value;
            }
        });

        // Update version tag
        const versionTag = document.getElementById('version-tag');
        if (versionTag && translations.version) {
            versionTag.textContent = `${translations.version.prefix}${translations.version.loading}`;
        }

        // Update hash tooltips
        const tooltip = this.t('downloads.hash_tooltip') || 'Click to copy';
        document.querySelectorAll('.hash-text').forEach(el => {
            el.title = tooltip;
        });
    }
};

const SecurityManager = {
    init() {
        console.log("Security restrictions disabled.");
    },

    preventDevToolsKeys() {},
    detectDevToolsResize() {},
    startAntiDebugger() {}
};

const ContextMenuManager = {
    init() {
        this.menu = document.getElementById('customContextMenu');
        if (this.menu) this.menu.style.display = 'none';
    },

    bindEvents() {}
};

const UIManager = {
    currentLang: 'en',

    async init() {
        // Detectar idioma automáticamente basado en la zona horaria del navegador
        const detectedLang = detectLanguageFromTimezone();
        console.log(`Detected language from timezone: ${detectedLang}`);
        
        await I18nManager.init(detectedLang);
        this.currentLang = detectedLang;
        
        // Actualizar UI con el idioma detectado
        this.updateLanguageUI(detectedLang);
        
        this.initLightbox();
        this.initNavTabs();
        this.exposeGlobals();
    },
    
    /**
     * Actualiza la interfaz de usuario para reflejar el idioma seleccionado
     * @param {string} lang - Código de idioma ('en', 'es', 'ja')
     */
    updateLanguageUI(lang) {
        // Update body class for CSS-based language switching
        document.body.classList.remove('lang-en', 'lang-es', 'lang-ja');
        document.body.classList.add(`lang-${lang}`);
        
        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-${lang}`);
        if (activeBtn) activeBtn.classList.add('active');
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

        closeBtn?.addEventListener('click', () => lightbox.style.display = 'none');
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

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

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

    async setLanguage(lang) {
        this.currentLang = lang;
        
        // Actualizar UI con el nuevo idioma
        this.updateLanguageUI(lang);

        // Load and apply new translations
        await I18nManager.loadTranslations(lang);
        I18nManager.applyTranslations();

        // Update hash tooltips
        const tooltip = I18nManager.t('downloads.hash_tooltip') || 'Click to copy';
        const hashXorg = document.getElementById('hash-xorg');
        const hashXlibre = document.getElementById('hash-xlibre');
        
        if (hashXorg) hashXorg.title = tooltip;
        if (hashXlibre) hashXlibre.title = tooltip;
    },

    openTab(event, targetId) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) targetElement.classList.add('active');
        event.currentTarget.classList.add('active');
    },

    exposeGlobals() {
        window.setLang = this.setLanguage.bind(this);
        window.openTab = this.openTab.bind(this);
        window.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        window.closeMobileMenu = this.closeMobileMenu.bind(this);
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
            versionTag.innerHTML = `<span class="en">v. ${version}</span><span class="es">v. ${version}</span>`;
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
                await navigator.clipboard.writeText(hash);
                hashEl.style.color = 'var(--green)';
                setTimeout(() => hashEl.style.color = 'var(--comment)', 1000);
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
                    // Update button text to only "Download" when enabled
                    const downloadText = I18nManager.t('downloads.download_btn') || 'Download';
                    
                    btn.innerHTML = `<span>${downloadText}</span>`;
                    
                    // Then update classes and enable
                    btn.className = 'btn-edition btn-outline';
                    btn.disabled = false;
                    const statusText = btn.querySelector('.status-text');
                    if (statusText) statusText.style.display = 'none';
                    
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
            hashEl.title = I18nManager.t('downloads.hash_tooltip') || 'Click to copy';
            hashEl.style.cursor = 'pointer';
            btn.parentNode.insertBefore(hashEl, btn.nextSibling);
        }

        hashEl.textContent = `SHA256: ${hash}`;
        hashEl.onclick = async () => {
            await navigator.clipboard.writeText(hash);
            hashEl.style.color = 'var(--green)';
            setTimeout(() => hashEl.style.color = '', 1000);
        };
    }
};

// Inicialización de la aplicación sin bloqueos
document.addEventListener('DOMContentLoaded', async () => {
    // SecurityManager.init(); // Desactivado
    // ContextMenuManager.init(); // Desactivado para permitir menú nativo
    await UIManager.init();
    NetworkManager.loadDownloads();
});
