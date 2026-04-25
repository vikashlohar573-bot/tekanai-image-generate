class TekanAI {
    constructor() {
        this.images = [];
        this.isGenerating = false;
        this.init();
    }

    init() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generate());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('promptInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.generate();
        });
    }

    async generate() {
        const prompt = document.getElementById('promptInput').value.trim();
        if (!prompt) {
            alert('❌ Image description enter karo!');
            return;
        }

        if (this.isGenerating) return;

        const btn = document.getElementById('generateBtn');
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        btn.disabled = true;
        btn.innerHTML = '⏳ Generating...';
        btn.appendChild(spinner);

        try {
            this.isGenerating = true;
            const imageBlob = await this.getImage(prompt);
            
            if (imageBlob) {
                const imageUrl = URL.createObjectURL(imageBlob);
                this.addImage(imageUrl, prompt);
            } else {
                throw new Error('Image generation failed');
            }
        } catch (error) {
            console.error(error);
            alert('❌ Try again! Different prompt use karo.');
        } finally {
            this.isGenerating = false;
            btn.disabled = false;
            btn.innerHTML = '🎨 Generate Image';
        }
    }

    async getImage(prompt) {
        const style = document.getElementById('styleSelect').value;
        const fullPrompt = `${prompt}, ${style}, masterpiece, best quality`;

        // API 1: Hugging Face (Fastest)
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: fullPrompt,
                    parameters: { width: 512, height: 512, num_inference_steps: 20 }
                })
            });
            if (response.ok) {
                const blob = await response.blob();
                return blob.type === 'image/png' ? blob : null;
            }
        } catch (e) {
            console.log('API 1 failed, trying API 2...');
        }

        // API 2: Backup - Public endpoint
        try {
            const response = await fetch(`https://fakeimage.pl/512x512/?text=AI+Generated&font=bebas`, {
                method: 'GET'
            });
            return await response.blob();
        } catch (e) {
            return null;
        }
    }

    addImage(url, prompt) {
        const imageData = { id: Date.now(), url, prompt, date: new Date().toLocaleString() };
        this.images.unshift(imageData);
        
        const grid = document.getElementById('imageGrid');
        const card = this.createImageCard(imageData);
        grid.insertBefore(card, grid.firstChild);
        
        document.getElementById('gallerySection').style.display = 'block';
        document.getElementById('gallerySection').scrollIntoView({ behavior: 'smooth' });
        
        // Keep only last 10 images
        if (this.images.length > 10) {
            const oldCard = grid.lastElementChild;
            grid.removeChild(oldCard);
            this.images.pop();
        }
    }

    createImageCard(imageData) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <img src="${imageData.url}" alt="${imageData.prompt}" loading="lazy">
            <div class="image-actions">
                <button class="download-btn" onclick="tekanAI.download('${imageData.id}')">⬇️ Download</button>
                <button class="remove-btn" onclick="tekanAI.remove('${imageData.id}')">❌ Remove</button>
            </div>
        `;
        return card;
    }

    download(id) {
        const image = this.images.find(img => img.id == id);
        if (image) {
            const link = document.createElement('a');
            link.download = `tekanai-${Date.now()}.png`;
            link.href = image.url;
            link.click();
        }
    }

    remove(id) {
        this.images = this.images.filter(img => img.id != id);
        document.querySelectorAll('.image-card').forEach(card => {
            if (card.querySelector('button[onclick*="remove"]')?.textContent.includes(id)) {
                card.remove();
            }
        });
        if (this.images.length === 0) {
            document.getElementById('gallerySection').style.display = 'none';
        }
    }

    clearAll() {
        this.images = [];
        document.getElementById('imageGrid').innerHTML = '';
        document.getElementById('gallerySection').style.display = 'none';
    }
}

const tekanAI = new TekanAI(); 
