/* Neko-Void — app.js (Versión Corregida) */

const SecurityManager = {
    init() {
        // Se han desactivado las restricciones de seguridad para permitir
        // el uso de F12, inspeccionar elemento y depuración.
        console.log("Security restrictions disabled.");
    },

    preventDevToolsKeys() {
        // Desactivado: Ya no previene F12 ni combinaciones de teclas de consola
    },

    detectDevToolsResize() {
        // Desactivado: Ya no limpia el body ni redirige al abrir la consola
    },

    startAntiDebugger() {
        // Desactivado: Ya no ejecuta bucles de debugger
    }
};

const ContextMenuManager = {
    init() {
        // Se desactiva la inicialización del menú personalizado
        // para permitir el menú nativo del navegador.
        this.menu = document.getElementById('customContextMenu');
        if (this.menu) this.menu.style.display = 'none';
    },

    bindEvents() {
        // Eliminado preventDefault del contextmenu
    }
};

const UIManager = {
    currentLang: 'en',

    init() {
        this.initLightbox();
        this.initNavTabs();
        this.exposeGlobals();
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
            });
        });
    },

    setLanguage(lang) {
        this.currentLang = lang;
        document.body.classList.remove('lang-en', 'lang-es');
        document.body.classList.add(`lang-${lang}`);
        
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-${lang}`);
        if (activeBtn) activeBtn.classList.add('active');

        const tooltip = lang === 'en' ? 'Click to copy' : 'Click para copiar';
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
                const btn = document.getElementById(`flavor-${id}`);

                if (btn && url) {
                    btn.className = 'btn-main btn-outline';
                    const statusText = btn.querySelector('.status-text');
                    if (statusText) statusText.style.display = 'none';
                    btn.onclick = () => window.open(url, '_blank');
                }
            });
        } catch (error) {
            console.warn('Flavors file not found or could not be loaded.');
        }
    }
};

// Inicialización de la aplicación sin bloqueos
document.addEventListener('DOMContentLoaded', () => {
    // SecurityManager.init(); // Desactivado
    // ContextMenuManager.init(); // Desactivado para permitir menú nativo
    UIManager.init();
    NetworkManager.loadDownloads();
});
