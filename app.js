class PhotoOverlayApp {
    constructor() {                        
        this.userPhoto = null;
        this.selectedOverlay = null;
        
        // DOM-Elemente auslesen
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas?.getContext('2d');
        this.photoInput = document.getElementById('photoInput');
        this.photoPreview = document.getElementById('photoPreview');
        this.overlayGrid = document.getElementById('overlayGrid');
        this.generateBtn = document.getElementById('generateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        this.init();
    }

    async init() {           
        try {
            await this.createOverlayOptions();
            this.bindEvents();
        } catch (error) {
            console.error("Initialisierung fehlgeschlagen: ", error);
            alert("Initialisierung fehlgeschlagen: " + error.message);
        }
    }

    async createOverlayOptions() {
                
        // manuell eingetragen weil javascript mich hasst
        const overlayFiles = [
            'VoteMarkus1.png',
            'VoteMarkus2.png',
            'VoteMarkus3.png',
            'VoteMarkus4.png',
            'VoteMarkus5.png',
            'VoteMarkus6.png',
            'VoteMarkus7.png',
            'VoteMarkus8.png'
        ];

       const overlays = [];

        // Overlays laden
        for (const filename of overlayFiles) {
            const url = `overlays/${filename}`;
            const name = this.formatOverlayName(filename);

            
            try {
                const imageExists = await this.checkImageExists(url);
                if (imageExists) {
                    overlays.push({ name, url });
                } else {
                    console.log(`Folgendes Bild konnte nicht gefunden werden: ${filename}`);
                }
            } catch (error) {
                console.warn(`Dies hätte nicht passieren dürfen.. ${filename}:`, error);
            }
        }

        // Overlays generieren
        overlays.forEach((overlay, index) => {
            this.createOverlayElement(overlay, index);
        });
        
    }
    
    // Endung der Overlays wegkuerzen
    formatOverlayName(filename) {
        let formatted = filename.replace('.png', ''); 
        return formatted;
    }

    checkImageExists(url) {        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve(true);
            };
            img.onerror = (error) => {
                console.log(`Bild konnte nicht geladen werden: ${url}`, error);
                resolve(false);
            };
            img.src = url;
        });
    }

    createOverlayElement(overlay, index) {        
        const option = document.createElement('div');
        option.className = 'overlay-option';
        option.dataset.index = index.toString();

        const img = document.createElement('img');
        img.src = overlay.url;
        img.alt = overlay.name;

        const name = document.createElement('p');
        name.textContent = overlay.name;

        option.appendChild(img);
        option.appendChild(name);
        
        this.overlayGrid.appendChild(option);

        option.addEventListener('click', () => {
            this.selectOverlay(option, overlay.url);
        });
    }

    selectOverlay(optionElement, pattern) {        
        // alle ausgewaehlten Optionen entfernen, damit man bei mehrfach-selektion nicht alles auswaehlen kann
        document.querySelectorAll('.overlay-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // ausgewahlte Option markieren
        optionElement.classList.add('selected');
        this.selectedOverlay = pattern;
        this.updateGenerateButton();
    }

    bindEvents() {            
        if (this.photoInput) {this.photoInput.addEventListener('change', (e) => {this.handlePhotoUpload(e);});}
        if (this.generateBtn) {this.generateBtn.addEventListener('click', () => {this.generateImage();});}        
        if (this.downloadBtn) {this.downloadBtn.addEventListener('click', () => {this.downloadImage();});}
    }

    handlePhotoUpload(event) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.userPhoto = img;
                    this.displayPhotoPreview(img);
                    this.updateGenerateButton();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Vorschau anzeigen
    displayPhotoPreview(img) {
        this.photoPreview.innerHTML = '';
        this.photoPreview.classList.add('has-image');
        const previewImg = document.createElement('img');
        previewImg.src = img.src;
        this.photoPreview.appendChild(previewImg);
    }

    updateGenerateButton() {
        const canGenerate = !!(this.userPhoto && this.selectedOverlay);
        this.generateBtn.disabled = !canGenerate;
    }

    // Bild erstellen
    generateImage() {
        if (!this.userPhoto || !this.selectedOverlay) return;

        const maxWidth = 720;
        const maxHeight = 720;
        let { width, height } = this.userPhoto;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        // Bild kopieren
        this.ctx.drawImage(this.userPhoto, 0, 0, width, height);

        // Overlay drueberlegen
        const overlayImg = new Image();
        overlayImg.onload = () => {
            this.ctx.drawImage(overlayImg, 0, 0, width, height);
            this.downloadBtn.disabled = false;
        };
        overlayImg.src = this.selectedOverlay;
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'voteMarkus2025.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}


// scheißdreck - starte doch 
// praise jAndy @ StackOverflow
document.addEventListener('DOMContentLoaded', () => {
            
    try {
        const app = new PhotoOverlayApp();
            } catch (error) {
        alert("https://www.youtube.com/shorts/HEPkH2Nihuc - " + error.message);
    }
});

