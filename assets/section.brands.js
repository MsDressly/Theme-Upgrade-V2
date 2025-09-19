(function($){

    'use strict';

    class Brands extends HTMLElement {
        constructor() {
            super();
            
            setTimeout(() => {
                theme.AssetsLoader.onScrollOrUserAction(this, () => {
                    this.load();
                });
            }, 0);
        }

        load() {
            const _ = this;

            this.$container = $(this);
            this.animateionDuration = 350;
            this.selectorElement = '.js-brands';
            this.$element = $(this.selectorElement);
            this.$content = this.$element.find('[data-js-brands-content]');
            this.$buttons = this.$element.find('[data-js-brands-letter]');
            this.$sections = this.$element.find('[data-js-brands-section]');

            this.$element.on('click', '[data-js-brands-letter]:not(.active)', function(e) {
                if(_.isAnimate) return;

                _.isAnimate = true;

                const $this = $(this),
                    letter = $this.attr('data-js-brands-letter'),
                    $currentSection = _.$sections.filter(`[data-js-brands-section="${letter}"]`),
                    $withoutCurrent = _.$sections.not('.d-none');

                // _.$sections.addClass('d-none');
                // _.$sections.filter(`[data-js-brands-section="${letter}"]`).removeClass('d-none');

                _.$content.prepend($currentSection);
                $withoutCurrent.slideUp({
                    duration: _.animateionDuration,
                    complete: function () {
                        _.isAnimate = false;
                    }
                });
                $currentSection.hide().removeClass('d-none');
                $currentSection.slideDown({
                    duration: _.animateionDuration,
                    complete: function () {
                        $withoutCurrent.addClass('d-none').removeAttr('style');
                        _.isAnimate = false;
                    }
                });
                _.$buttons.removeClass('active');
                _.$buttons.filter(`[data-js-brands-letter="${letter}"]`).addClass('active');
                e.preventDefault();
            });
        }

        disconnectedCallback() {
            this.$element.off();
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('brands-section', Brands);
    });
})(jQueryTheme);