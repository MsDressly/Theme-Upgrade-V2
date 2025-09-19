(function($){

    'use strict';

    class CarouselBrands extends HTMLElement {
        constructor() {
            super();
            
            setTimeout(() => {
                theme.AssetsLoader.onScrollOrUserAction(this, () => {
                    this.load();
                });
            }, 0);
        }

        load() {
            this.$container = $(this);

            var _ = this,
                $carousel = this.$container.find('[data-js-carousel]'),
                $slick = $carousel.find('[data-js-carousel-slick]');

            function initialize() {
                var $prev = $carousel.find('[data-js-carousel-prev]'),
                    $next = $carousel.find('[data-js-carousel-next]'),
                    $arrows = $carousel.find('[data-js-carousel-arrow]'),
                    count = +$carousel.attr('data-count'),
                    autoplay = $carousel.attr('data-autoplay') === 'true' ? true : false,
                    speed = +$carousel.attr('data-speed'),
                    infinite = $carousel.attr('data-infinite') === 'true' ? true : false,
                    arrows = $carousel.attr('data-arrows') === 'true' ? true : false,
                    bullets = $carousel.attr('data-bullets') === 'true' ? true : false;

                _.$slick = $slick;

                function arrowsPosition() {
                    var max_height = 0;

                    $slick.find('.carousel__item').each(function () {
                        max_height = Math.max(max_height, $(this).innerHeight());
                    });

                    $arrows.css({top: max_height / 2});
                };

                if (arrows) {
                    $window.on('theme.resize.carousel-brands', arrowsPosition);
                }

                $slick.on('init', function () {
                    if (arrows) {
                        arrowsPosition();
                    }

                    $(window).trigger('checkImages');
                    $carousel.removeClass('invisible');
                    theme.Preloader.unset($carousel.parent());
                });

                $slick.slick({
                    lazyLoad: false,
                    arrows: arrows,
                    prevArrow: $prev,
                    nextArrow: $next,
                    dots: bullets,
                    dotsClass: 'slick-dots d-flex flex-wrap flex-center list-unstyled pt-40',
                    adaptiveHeight: true,
                    autoplay: autoplay,
                    autoplaySpeed: speed,
                    infinite: infinite,
                    slidesToShow: count,
                    slidesToScroll: count,
                    touchMove: false,
                    rtl: theme.rtl,
                    responsive: [
                        {
                            breakpoint: theme.breakpoints.values.xl,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 5
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.lg,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.md,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.sm,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        }
                    ]
                });
            };

            if($slick.length) {
                theme.AssetsLoader.loadManually([
                    ['styles', 'plugin_slick'],
                    ['scripts', 'plugin_slick']
                ],
                function() {
                    initialize();
                });
            }
        }

        disconnectedCallback() {
            if(this.$slick) {
                this.$slick.slick('destroy').off();
                this.$slick = null;

                $window.unbind('theme.resize.carousel-brands');
            }
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('carousel-brands', CarouselBrands);
    });
})(jQueryTheme);