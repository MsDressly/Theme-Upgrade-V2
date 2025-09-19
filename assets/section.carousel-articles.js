(function($){

    'use strict';

    class CarouselArticles extends HTMLElement {
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

                    $slick.find('.carousel__item img').each(function () {
                        max_height = Math.max(max_height, $(this).innerHeight());
                    });

                    $arrows.css({ top: max_height/2 });
                    $prev.add($next).css({'max-height': max_height});
                };

                if(arrows) {
                    $window.on('theme.resize.carousel-articles', arrowsPosition);
                }

                $slick.one('init', function() {
                    if(arrows) {
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
                    dotsClass: 'slick-dots d-flex flex-wrap flex-center list-unstyled pt-35',
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
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.lg,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.sm,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
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

                $window.unbind('theme.resize.carousel-articles');
            }
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('carousel-articles', CarouselArticles);
    });
})(jQueryTheme);