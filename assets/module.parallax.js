(function($){

    'use strict';

    class Parallax extends HTMLElement {
        constructor() {
            super();
            this.factor = 0;

            setTimeout(() => {
                this.init();
            }, 0);
        }

        init() {
            this.image = this.querySelector('[data-parallax-image]');
            this.direction = this.dataset.direction || 'to_top';
            this.imageAspectRatio = this.image.dataset.aspectRatio;

            this.calculateSize();
            this.calculateScroll();

            window.addEventListener('theme.resize', () => {
                this.calculateSize();
                this.calculateScroll();
            });
            window.addEventListener('scroll', () => {
                this.calculateScroll();
            });

            this.classList.add('parallax--init');
        }

        calculateSize() {
            const containerParams = this.getBoundingClientRect();
            const imageHeight = containerParams.width / this.imageAspectRatio;
            this.imageStroke = imageHeight - containerParams.height;
            this.factorBody = imageHeight / 100 * this.factor;
            this.scrollStroke = window.innerHeight + containerParams.height;
            this.imageScrollRatio = (this.imageStroke + this.factorBody * 2) / this.scrollStroke;
        }

        calculateScroll() {
            if(this.imageStroke > 0) {
                this.classList.add('parallax--moved-image');

                const containerParam = this.getBoundingClientRect();
                let setTop = containerParam.bottom * this.imageScrollRatio;

                if(this.direction === 'to_top') {
                    setTop = this.imageStroke - setTop;
                }
                if(containerParam.bottom >= this.factorBody && containerParam.bottom <= this.scrollStroke - this.factorBody) {
                    this.image.style.transform = `translateY(${setTop * -1 + this.factorBody}px)`;
                }
            } else {
                this.classList.add('parallax--moved-image');
                this.image.removeAttribute('style');
            }
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('parallax-element', Parallax);
    });
})(jQueryTheme);