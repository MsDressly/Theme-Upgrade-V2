(function($){

    'use strict';

    class CarouselReviews extends HTMLElement {
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

            var _= this,
                $carousel = this.$container.find('[data-js-carousel]'),
                $slick = $carousel.find('[data-js-carousel-slick]');


            function initialize() {
                var $prev = $carousel.find('[data-js-carousel-prev]'),
                    $next = $carousel.find('[data-js-carousel-next]'),
                    $arrows = $carousel.find('[data-js-carousel-arrow]'),
                    count = $carousel.attr('data-count'),
                    autoplay = $carousel.attr('data-autoplay') === 'true' ? true : false,
                    speed = +$carousel.attr('data-speed'),
                    itemsLength = +$carousel.attr('data-items-length'),
                    infinite = $carousel.attr('data-infinite') === 'true' ? true : false,
                    arrows = $carousel.attr('data-arrows') === 'true' ? true : false,
                    bullets = false;

                _.$slick = $slick;

                function slidesHeight() {
                    var $slides = $carousel.find('.carousel-reviews__item_content');

                    $slides.css({
                        'min-height': ''
                    });

                    $slides.css({
                        'min-height': $carousel.find('.slick-track').height()
                    });

                    $arrows.add($prev).add($next)[theme.current.is_desktop && itemsLength <= count ? 'addClass' : 'removeClass']('d-none-important');
                };

                $slick.on('init', function () {
                    $window.trigger('checkImages');
                    slidesHeight();
                    $carousel.removeClass('invisible');
                    theme.Preloader.unset($carousel.parent());
                });

                $slick.on('afterChange', function (event, slick, currentSlide, nextSlide) {
                    $window.trigger('checkImages');
                });

                $window.on('theme.resize', function () {
                    slidesHeight();
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
                    infinite: true,
                    slidesToShow: count,
                    slidesToScroll: 1,
                    touchMove: false,
                    rtl: theme.rtl,
                    responsive: [
                        {
                            breakpoint: theme.breakpoints.values.xl,
                            settings: {
                                slidesToShow: Math.min(3, count),
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: theme.breakpoints.values.lg,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
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

                $window.unbind('theme.resize.carousel-reviews');
            }
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('carousel-reviews', CarouselReviews);
    });
})(jQueryTheme);