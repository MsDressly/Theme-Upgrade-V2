(function($){

    'use strict';

    function ProductFootbar() {
        this.settings = {
            height: 0
        };

        this.load();
    };

    ProductFootbar.prototype = $.extend({}, ProductFootbar.prototype, {
        duration: function () {
            return theme.animations.footbar_product.duration * 1000;
        },
        load: function() {
            var _ = this,
                $footbar = $('.js-footbar-product'),
                $spacer = $('.js-footer'),
                $limit = $('[data-js-footbar-product-limit]');

            if($footbar.length && $limit.length) {
                this.$footbar = $footbar;

                $window.on('load theme.resize.productFootbar scroll.productFootbar', function () {
                    _._checkVisible($footbar, $limit, $spacer);
                });
            }
        },
        _checkVisible: function ($footbar, $limit, $spacer) {
            var limit = $limit[0].getBoundingClientRect(),
                stickyHeader = document.querySelector('sticky-header'),
                topSpacing = stickyHeader && stickyHeader.getStickyHeight ? stickyHeader.getStickyHeight() : 0,
                height = $footbar.innerHeight();

            if(limit.top < topSpacing && !$footbar.hasClass('footbar-product--visible')) {
                $footbar.addClass('footbar-product--visible');

                $footbar.stop().slideDown({
                    duration: this.duration(),
                    complete: function () {
                        
                    }
                });

                this.settings.height = $footbar.children().first().innerHeight();
            } else if(limit.top >= topSpacing && $footbar.hasClass('footbar-product--visible')) {
                $footbar.removeClass('footbar-product--visible');

                $footbar.stop().slideUp({
                    duration: this.duration(),
                    complete: function () {
                        
                    }
                });

                this.settings.height = 0;
            }

            if(height > 0) {
                if(theme.current.is_mobile) {
                    $spacer.css({
                        paddingBottom: ''
                    });

                    $spacer.parent().css({
                        paddingBottom: height
                    });
                } else {
                    $spacer.css({
                        paddingBottom: height
                    });

                    $spacer.parent().css({
                        paddingBottom: ''
                    });
                }
            }


        },
        getFootbarHeight: function () {
            return this.settings.height;
        },
        destroy: function () {
            $window.unbind('theme.resize.productFootbar scroll.productFootbar');
        }
    });
    
    theme.AssetsLoader.onPageLoaded(function() {
        theme.ProductFootbar = new ProductFootbar;
    });
})(jQueryTheme);