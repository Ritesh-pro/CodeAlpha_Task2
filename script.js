// Enhanced Gallery JavaScript with High-Graphics Animations

class GallerioGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.likedImages = new Set();
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.setupLandingPage();
        this.setupGallery();
        this.setupLightbox();
        this.setupSearch();
        this.setupParticles();
        this.setupAnimations();
    }

    setupLandingPage() {
        const landingPage = document.getElementById('landing-page');
        const enterBtn = document.getElementById('enter-gallery-btn');
        const mainGallery = document.querySelector('.main-gallery');

        if (enterBtn && landingPage && mainGallery) {
            enterBtn.addEventListener('click', () => {
                // Animate exit
                landingPage.style.animation = 'slideOutUp 0.8s ease-in-out forwards';
                
                setTimeout(() => {
                    landingPage.style.display = 'none';
                    mainGallery.style.display = 'block';
                    mainGallery.style.animation = 'slideInUp 0.8s ease-in-out';
                    
                    // Initialize gallery after landing page is hidden
                    if (!this.isInitialized) {
                        this.initializeGallery();
                        this.isInitialized = true;
                    }
                }, 800);
            });
        }
    }

    setupParticles() {
        const particleContainer = document.querySelector('.particle-container');
        if (!particleContainer) return;

        // Create floating particles
        for (let i = 0; i < 50; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.createParticle(container);
            }
        }, 5000);
    }

    setupAnimations() {
        // Animate doodles on landing page
        const doodles = document.querySelectorAll('.doodle');
        doodles.forEach((doodle, index) => {
            doodle.style.animationDelay = `${index * 0.5}s`;
        });

        // Animate floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 0.8}s`;
        });
    }

    setupGallery() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.setupFilterButtons();
        this.setupGalleryItems();
        this.setupIntersectionObserver();
    }

    setupFilterButtons() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                this.filterGallery(filter);
            });
        });
    }

    filterGallery(filter) {
        this.galleryItems.forEach(item => {
            const shouldShow = filter === 'all' || item.dataset.category === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
        
        this.updateImages();
    }

    setupGalleryItems() {
        this.galleryItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Setup item interactions
            this.setupItemInteractions(item);
        });
    }

    setupItemInteractions(item) {
        const viewBtn = item.querySelector('.view-btn');
        const likeBtn = item.querySelector('.like-btn');
        const img = item.querySelector('img');

        // View button
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(img.src, item);
            });
        }

        // Like button
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLike(likeBtn, img.src);
            });
        }

        // Click on item
        item.addEventListener('click', () => {
            this.openLightbox(img.src, item);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.galleryItems.forEach(item => {
            observer.observe(item);
        });
    }

    setupLightbox() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxCategory = document.getElementById('lightbox-category');
        this.currentIndexSpan = document.getElementById('current-index');
        this.totalImagesSpan = document.getElementById('total-images');
        
        // Lightbox controls
        this.setupLightboxControls();
        this.setupLightboxNavigation();
    }

    setupLightboxControls() {
        const closeBtn = document.getElementById('lightbox-close');
        const likeBtn = document.getElementById('lightbox-like');
        const downloadBtn = document.getElementById('lightbox-download');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                this.toggleLike(likeBtn, this.lightboxImg.src);
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadImage());
        }

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
    }

    setupLightboxNavigation() {
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.showPreviousImage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showNextImage());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.style.display === 'flex') {
                switch (e.key) {
                    case 'ArrowLeft':
                        this.showPreviousImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                    case 'Escape':
                        this.closeLightbox();
                        break;
                }
            }
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.searchImages(query);
        });
    }

    searchImages(query) {
        this.galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const category = item.querySelector('p').textContent.toLowerCase();
            const shouldShow = title.includes(query) || category.includes(query);
            
            if (shouldShow) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    openLightbox(src, item) {
        this.updateImages();
        const imageIndex = this.images.findIndex(img => img.src === src);
        
        if (imageIndex !== -1) {
            this.currentIndex = imageIndex;
            this.showImage(imageIndex);
            
            // Update lightbox info
            const title = item.querySelector('h3').textContent;
            const category = item.querySelector('p').textContent;
            
            if (this.lightboxTitle) this.lightboxTitle.textContent = title;
            if (this.lightboxCategory) this.lightboxCategory.textContent = category;
            
            // Show lightbox
            this.lightbox.style.display = 'flex';
            setTimeout(() => {
                this.lightboxImg.style.transform = 'scale(1)';
            }, 50);
        }
    }

    showImage(index) {
        if (this.images[index]) {
            this.lightboxImg.src = this.images[index].src;
            this.currentIndex = index;
            
            // Update counter
            if (this.currentIndexSpan) this.currentIndexSpan.textContent = index + 1;
            if (this.totalImagesSpan) this.totalImagesSpan.textContent = this.images.length;
            
            // Update like button state
            this.updateLikeButtonState(this.images[index].src);
        }
    }

    showPreviousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(this.currentIndex);
    }

    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(this.currentIndex);
    }

    closeLightbox() {
        this.lightboxImg.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.lightbox.style.display = 'none';
        }, 300);
    }

    toggleLike(likeBtn, imageSrc) {
        if (this.likedImages.has(imageSrc)) {
            this.likedImages.delete(imageSrc);
            likeBtn.innerHTML = '<i class="far fa-heart"></i>';
            likeBtn.style.color = 'white';
        } else {
            this.likedImages.add(imageSrc);
            likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
            likeBtn.style.color = '#ff6b6b';
        }
        
        // Update all like buttons for this image
        this.updateAllLikeButtons(imageSrc);
    }

    updateAllLikeButtons(imageSrc) {
        const allLikeBtns = document.querySelectorAll('.like-btn');
        const isLiked = this.likedImages.has(imageSrc);
        
        allLikeBtns.forEach(btn => {
            const item = btn.closest('.gallery-item');
            if (item && item.querySelector('img').src === imageSrc) {
                if (isLiked) {
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                    btn.style.color = '#ff6b6b';
                } else {
                    btn.innerHTML = '<i class="far fa-heart"></i>';
                    btn.style.color = 'white';
                }
            }
        });
    }

    updateLikeButtonState(imageSrc) {
        const lightboxLikeBtn = document.getElementById('lightbox-like');
        if (lightboxLikeBtn) {
            if (this.likedImages.has(imageSrc)) {
                lightboxLikeBtn.innerHTML = '<i class="fas fa-heart"></i>';
                lightboxLikeBtn.style.color = '#ff6b6b';
            } else {
                lightboxLikeBtn.innerHTML = '<i class="far fa-heart"></i>';
                lightboxLikeBtn.style.color = 'white';
            }
        }
    }

    downloadImage() {
        const link = document.createElement('a');
        link.href = this.lightboxImg.src;
        link.download = `gallerio-image-${this.currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    updateImages() {
        const visibleItems = Array.from(this.galleryItems).filter(item => 
            item.style.display !== 'none'
        );
        this.images = visibleItems.map(item => item.querySelector('img'));
    }

    initializeGallery() {
        this.updateImages();
        console.log('Gallerio Gallery initialized successfully!');
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GallerioGallery();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-100px);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 