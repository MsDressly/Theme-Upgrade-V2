(function($){

    'use strict';

    class StickyHeader extends HTMLElement {
        constructor() {
            super();

            this.stickyClass = 'header__content--sticky';
            this.stickyHeaderClass = 'header--sticky';
            this.params = {
                bp: 1024
            };
            this.currentScroll = 0;
            this.fixedScrollOffset = 100;

            this.init();

            if(!this.hideWhenScrollDown && theme.current.is_desktop && theme.StickySidebar && theme.StickySidebar.update && this.currentSticky && this.currentSticky.querySelectorAll('.header__content--sticky').length) {
                theme.StickySidebar.update(); 
            }
        }

        init() {
            const type = this.dataset.stickyType;
            const needSidebar = this.dataset.desktopStickySidebar;

            this.header = this.closest('header');
            this.hideWhenScrollDown = this.dataset.hideWhenScrollDown === 'true' ? true : false;

            if(type === 'desktop_and_mobile' || type === 'desktop') {
                this.params.desktop = {
                    sticky: '[data-js-desktop-sticky]',
                    limit: 'bottom',
                    fade: true,
                    duration: function () {
                        return theme.animations.sticky_header.duration * 1000;
                    }
                };

                if(needSidebar === 'true') {
                    this.params.desktop.move = [
                        {
                            selector: '[data-js-sticky-replace-element="logo"]',
                            appendToSelector: '[data-js-sticky-replace-here="logo"]'
                        },
                        {
                            selector: '[data-js-sticky-replace-element="cart"]',
                            appendToSelector: '[data-js-sticky-replace-here="cart"]'
                        },
                        {
                            selector: '[data-js-sticky-replace-element="wishlist"]',
                            appendToSelector: '[data-js-sticky-replace-here="wishlist"]'
                        },
                        {
                            selector: '[data-js-sticky-replace-element="compare"]',
                            appendToSelector: '[data-js-sticky-replace-here="compare"]'
                        }
                    ];
                }
            }
            if(type === 'desktop_and_mobile' || type === 'mobile') {
                this.params.mobile = {
                    sticky: '[data-js-mobile-sticky]',
                    limit: 'bottom',
                    fade: false
                };
            }
            if(this.params.mobile) {
                this.stickyMobile = this.querySelector(this.params.mobile.sticky);
                this.spacerMobile = document.createElement('div');

                this.spacerMobile.classList.add('header__spacer');
                this.spacerMobile.classList.add('header__spacer--m');
                this.stickyMobile.parentNode.insertBefore(this.spacerMobile, this.stickyMobile);
            }
            if(this.params.desktop) {
                this.stickyDesktop = this.querySelector(this.params.desktop.sticky);
                this.spacerDesktop = document.createElement('div');

                this.spacerDesktop.classList.add('header__spacer');
                this.spacerDesktop.classList.add('header__spacer--d');
                this.stickyDesktop.parentNode.insertBefore(this.spacerDesktop, this.stickyDesktop);
            }
            
            const fix = () => {
                this.fix(this.currentSticky, this.currentSpacer);
                this.move(this.params[this.bp].move);

                window.dispatchEvent(new Event('verticalmenu.checkheight'));
            };

            const unfix = () => {
                this.unfix(this.currentSticky, this.currentSpacer);
                this.return(this.params[this.bp].move);

                window.dispatchEvent(new Event('verticalmenu.checkheight'));
            };

            const onResize = () => {
                const isDesktop = theme.current.is_desktop;

                this.bp = isDesktop ? 'desktop' : 'mobile';
                this.currentSticky = isDesktop ? this.stickyDesktop : this.stickyMobile;
                this.currentSpacer = isDesktop ? this.spacerDesktop : this.spacerMobile;

                if(!this.currentSticky) return;
                if (isDesktop) {
                    if(this.spacerDesktop) this.spacerDesktop.classList.add('header__spacer--visible');
                    if(this.spacerMobile) {
                        this.spacerMobile.classList.remove('header__spacer--visible');
                        if (this.stickyMobile.classList.contains(this.stickyClass)) {
                            this.unfix(this.stickyMobile, this.spacerMobile);
                            this.return(this.params.mobile.move);
                        }
                    }
                } else {
                    if(this.spacerMobile) this.spacerMobile.classList.add('header__spacer--visible');
                    if(this.spacerDesktop) {
                        this.spacerDesktop.classList.remove('header__spacer--visible');
                        
                        if (this.stickyDesktop.classList.contains(this.stickyClass)) {
                            this.unfix(this.stickyDesktop, this.spacerDesktop);
                            this.return(this.params.desktop.move);
                        }
                    }
                }
            };

            const onScroll = () => {
                if(!this.currentSticky) return;
                
                const stickyParams = this.currentSticky.getBoundingClientRect();
                const spacerParams = this.currentSpacer.getBoundingClientRect();
                const fixedVerticalMenu = this.querySelector('.menu--vertical.menu--fixed');
                const verticalMenuSpacer = document.querySelector('.vertical-menu-spacer');
                let alwaysFixSticky = false;
                let limit = this.params[this.bp].limit ? this.params[this.bp].limit : 0;

                if (limit === 'bottom') {
                    limit = this.currentSticky.classList.contains(this.stickyClass) ? spacerParams.height : stickyParams.height;
                }

                limit *= -1;

                if(spacerParams.top < limit && (!this.hideWhenScrollDown || (fixedVerticalMenu && verticalMenuSpacer && fixedVerticalMenu.getBoundingClientRect().bottom > 0) || document.querySelectorAll('.sidebar-fixed-top').length)) {
                    alwaysFixSticky = true;
                }
                if ((spacerParams.top < limit && window.pageYOffset < this.currentScroll && !this.querySelectorAll('.menu .visible').length) || alwaysFixSticky) {
                    if (!this.currentSticky.classList.contains(this.stickyClass) && (alwaysFixSticky || (!this.unfixedScroll || window.pageYOffset < this.unfixedScroll))) {
                        fix();
                    }
                    if(!ie) {
                        this.checkHeight(this.currentSticky, this.params[this.bp]);
                    }
                    if(!document.body.classList.contains('position-fixed')) {
                        this.fixedScroll = window.pageYOffset + this.fixedScrollOffset;
                    }
                } else {
                    if ((this.querySelectorAll('.menu .visible').length && spacerParams.top >= limit) || (spacerParams.top >= limit && this.currentSticky.classList.contains(this.stickyClass)) || (this.currentSticky.classList.contains(this.stickyClass) && (!this.fixedScroll || window.pageYOffset > this.fixedScroll) && !this.querySelectorAll('.menu .visible').length)) {
                        unfix();
                    }

                    this.unfixedScroll = window.pageYOffset - this.fixedScrollOffset;
                }

                this.currentScroll = window.pageYOffset;
            };

            onResize();
            onScroll();

            if(theme.current.is_desktop && theme.VerticalMenu && theme.VerticalMenu.checkHeightVerticalMenu) {
                setTimeout(function () {
                    window.dispatchEvent(new Event('verticalmenu.checkheight'));
                }, 50);
            }

            window.addEventListener('theme.resize', () => {
                onResize();
                onScroll();
            });
            window.addEventListener('scroll', () => {
                if(document.body.classList.contains('position-fixed')) return;

                onScroll();
            });
        }

        fix(sticky, spacer) {
            spacer.style.height = `${sticky.getBoundingClientRect().height}px`;

            if(this.params[this.bp].fade) {
                sticky.style.opacity = theme.animations.sticky_header.opacity === 1 ? 1 : 0;
                $(sticky).animate({ opacity: theme.animations.sticky_header.opacity }, this.params[this.bp].duration());
            }

            sticky.classList.add(this.stickyClass);
            this.header.classList.add(this.stickyHeaderClass);
        }

        unfix(sticky, spacer) {
            spacer.removeAttribute('style');

            if(this.params[this.bp].fade) {
                $(sticky).stop();
            }

            sticky.removeAttribute('style');
            sticky.classList.remove(this.stickyClass);
            this.header.classList.remove(this.stickyHeaderClass);
        }

        move(obj) {
            if (!obj) return;

            for(let i = 0; i < obj.length; i++) {
                const element = this.querySelector(obj[i].selector);
                const appendTo = this.querySelector(obj[i].appendToSelector);
                
                if(!element || !appendTo) continue;

                obj[i].element = element;
                obj[i].parent = element.parentNode;

                appendTo.appendChild(obj[i].element);
            }
        }

        return(obj) {
            if (!obj) return;

            for(let i = 0; i < obj.length; i++) {
                if(!obj[i].element) continue;

                obj[i].parent.appendChild(obj[i].element);
                obj[i].element = null;
                obj[i].parent = null;
            }
        }

        checkHeight(sticky, obj) {
            if(!obj.height) return;

            const spacerParams = this.currentSpacer.getBoundingClientRect();
            const height = spacerParams.bottom <= obj.height ? obj.height : spacerParams.bottom;

            sticky.style.minHeight = `${height}px`;
        }

        getStickyHeight() {
            if(this.currentSticky && this.params[this.bp]) {
                if(this.params[this.bp].height) {
                    return this.params[this.bp].height;
                } else {
                    return this.currentSticky.getBoundingClientRect().height;
                }
            } else {
                return 0;
            }
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('sticky-header', StickyHeader);
    });
})(jQueryTheme);