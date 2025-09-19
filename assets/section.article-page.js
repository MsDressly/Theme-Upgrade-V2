(function($){

    'use strict';

    class ArticlePage extends HTMLElement {
        constructor() {
            super();
            
            this.load();
        }

        load() {
            var $slider = $(this).find('.article-slider'),
                $insert = $('#article-slider');

            if($insert.length && $slider.length) {
                $insert.append($slider);

                var $slick = $slider.find('.article-slider__slick'),
                    $dots = $slider.find('.article-slider__dots'),
                    autoplay = $slick.attr('data-autoplay') === 'true' ? true : false,
                    speed = +$slick.attr('data-speed'),
                    infinite = $slick.attr('data-infinite') === 'true' ? true : false;

                $slider.removeClass('d-none');

                $slick.slick({
                    prevArrow: '<div class="slick-prev d-none d-md-flex flex-center position-absolute left-0 ml-10 rounded-circle overflow-hidden cursor-pointer"><i class="position-relative mr-2">' + theme.Global.getIcon('006', true) + '</i></div>',
                    nextArrow: '<div class="slick-next d-none d-md-flex flex-center position-absolute right-0 mr-10 rounded-circle overflow-hidden cursor-pointer"><i class="position-relative ml-3">' + theme.Global.getIcon('007', true) + '</i></div>',
                    dots: true,
                    appendDots: $dots,
                    dotsClass: 'slick-dots d-flex flex-wrap flex-center list-unstyled m-0 my-15',
                    adaptiveHeight: true,
                    autoplay: autoplay,
                    autoplaySpeed: speed,
                    infinite: infinite,
                    rtl: theme.rtl
                });

                $slider.removeClass('invisible');
                this.$slick = $slick;
            }
        }

        disconnectedCallback() {
            this.$slick.slick('destroy');
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('article-page', ArticlePage);
    });
})(jQueryTheme);