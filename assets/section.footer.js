(function($){

    'use strict';

    class FooterSection extends HTMLElement {
        constructor() {
            super();
            
            theme.AssetsLoader.onScrollOrUserAction(this, () => {
                this.load();
            });
        }

        load() {
            this.$container = $(this);
            this.namespace = '.footer';

            this.buttonToTopInit(this.namespace);
            this.fixedFooter(this.$container.find('.js-footer'), this.namespace);
        }

        buttonToTopInit(namespace) {
            var _ = this,
                $button = $('[data-js-button-back-to-top]'),
                namespace = namespace + '.buttonToTop';

            if(!$button.length) {
                return;
            }

            var bp = $button.attr('data-js-button-back-to-top') || 1000,
                duration = function () {
                    return theme.animations.backtotop.scroll_duration * 1000;
                },
                unbind = true;

            this.is_animate = false;

            $window.on('scroll' + namespace + ' theme.resize' + namespace, function () {
                var scroll_t = pageYOffset || Math.max($('body').scrollTop(), $('html').scrollTop());

                if(!$button.attr('data-bind')) {
                    $button[scroll_t > bp ? 'addClass' : 'removeClass']('show');
                }

                if(scroll_t > bp && unbind) {
                    $button.removeAttr('data-bind');
                }
            });

            $button.on('click', function(e) {
                if(_.is_animate) return;

                _.is_animate = true;

                var bind = $button.attr('data-bind');

                if(bind) {
                    $('html, body').stop().animate({
                        scrollTop: bind,
                        duration: duration()
                    });

                    setTimeout(() => {
                        _.is_animate = false;
                        $button.removeAttr('data-bind');
                    }, duration());
                } else {
                    var scroll_t = pageYOffset || Math.max($('body').scrollTop(), $('html').scrollTop());

                    unbind = false;

                    $button.attr('data-bind', scroll_t);

                    $('html, body').stop().animate({
                        scrollTop: 0,
                        duration: duration()
                    });

                    setTimeout(() => {
                        _.is_animate = false;
                        unbind = true;
                    }, duration());
                }
                

                e.preventDefault();
                e.stopPropagation();
                return false;
            });

            this.$buttonToTop = $button;
        }

        fixedFooter($footer, namespace) {
            if(!$footer.length || !$footer[0].hasAttribute('data-js-footer-fixed')) {
                return;
            }

            var $parent = $footer.parent(),
                $main = $('#MainContent');

            function calculate() {
                var footer_height = $footer.outerHeight(),
                    can_fix = $main.innerHeight() > footer_height + window.innerHeight;

                $footer[can_fix && theme.current.is_desktop ? 'addClass' : 'removeClass']('footer--fixed');

                $footer.css({
                    width: theme.current.is_desktop && $parent.hasClass('container') ? $parent.width() : ''
                });

                $main.css({
                    marginBottom: can_fix && theme.current.is_desktop ? footer_height + parseInt($footer.css('margin-top')) : ''
                });
            };

            $window.on('theme.resize' + namespace + ' scroll' + namespace, calculate);

            calculate();
        }

        disconnectedCallback() {
            if(this.$buttonToTop) $buttonToTop.off();

            $window.unbind('theme.resize' + namespace + ' scroll' + namespace);
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('footer-section', FooterSection);
    });
})(jQueryTheme);