(function($){

    'use strict';

    class ProductGallery extends HTMLElement {
        constructor() {
            super();
            
            this.options = {
                id: 1,
                single: false,
                media_id_index: [],
                gallery_has_video: false,
                gallery_has_model: false,
                video_autoplay: true,
                grouped: false,
                enable_zoom: true,
                gallery_size: '6',
                zoom_scale_coef: theme.product.gallery_zoom_scale_coef || 3,
                zoom_offset_coef: 0.75,
                zoom_type: 'default',
                main: {
                    enabled: false,
                    device: 'all',
                    stretch_size: 'auto',
                    slick: {
                        lazyLoad: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                        arrows: true,
                        infinite: false,
                        touchMove: false,
                        adaptiveHeight: true,
                        rtl: theme.rtl
                    }
                },
                thumbnail: {
                    enabled: false,
                    device: 'desktop',
                    slick: {
                        lazyLoad: false,
                        vertical: true,
                        verticalSwiping: true,
                        slidesToShow: 6,
                        slidesToScroll: 6,
                        dots: false,
                        arrows: true,
                        infinite: false,
                        touchMove: false,
                        rtl: theme.rtl,
                        responsive: [
                            {
                                breakpoint: 1260,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4
                                }
                            },
                            {
                                breakpoint: 1025,
                                settings: {
                                    slidesToShow: 5,
                                    slidesToScroll: 5
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    vertical: false,
                                    verticalSwiping: false,
                                    slidesToShow: 5,
                                    slidesToScroll: 5,
                                    arrows: false
                                }
                            }
                        ]
                    }
                },
                collage: {
                    enabled: false,
                    device: 'desktop'
                },
                sheet: {
                    enabled: false,
                    device: 'desktop'
                },
                fullscreen: {
                    enabled: false,
                    device: 'desktop',
                    slick: {
                        lazyLoad: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                        arrows: true,
                        infinite: false,
                        touchMove: false,
                        adaptiveHeight: false,
                        rtl: theme.rtl
                    }
                }
            };

            if(this.classList.contains('product-gallery--autoinit')) {
                this.load();
            }
        }

        load() {
            var _ = this,
                $popup = $('.js-popup.active');

            this.$gallery = $(this);
            this.$main_slider = this.$gallery.find('[data-js-product-gallery-main-slider]');

            this.$scroll_elem = $popup.length ? $popup : $window;

            var options_global = this.$gallery.find('[data-json-options-global]'),
                options_layout = this.$gallery.find('[data-json-options-layout]');

            options_global = options_global.length ? JSON.parse(options_global.html()) : {};
            options_layout = options_layout.length ? JSON.parse(options_layout.html()) : {};

            this.options = $.extend(true, {}, this.options, options_global, options_layout);
            this.main_slides = [];
            this.indexes = [];

            let slidesPlus = 0;

            if(this.options.gallery_size === '7') {
                slidesPlus = 1;
            } else if(this.options.gallery_size === '8') {
                slidesPlus = 2;
            }

            this.options.thumbnail.slick.slidesToShow = this.options.thumbnail.slick.slidesToShow + slidesPlus;
            this.options.thumbnail.slick.slidesToScroll = this.options.thumbnail.slick.slidesToScroll + slidesPlus;
            this.options.thumbnail.slick.responsive[0].settings.slidesToShow = this.options.thumbnail.slick.responsive[0].settings.slidesToShow + slidesPlus;
            this.options.thumbnail.slick.responsive[0].settings.slidesToScroll = this.options.thumbnail.slick.responsive[0].settings.slidesToScroll + slidesPlus;
            this.options.thumbnail.slick.responsive[1].settings.slidesToShow = this.options.thumbnail.slick.responsive[0].settings.slidesToShow + slidesPlus;
            this.options.thumbnail.slick.responsive[1].settings.slidesToScroll = this.options.thumbnail.slick.responsive[0].settings.slidesToScroll + slidesPlus;
            this.options.thumbnail.slick.responsive[2].settings.slidesToShow = this.options.thumbnail.slick.responsive[0].settings.slidesToShow + slidesPlus;
            this.options.thumbnail.slick.responsive[2].settings.slidesToScroll = this.options.thumbnail.slick.responsive[0].settings.slidesToScroll + slidesPlus;
            
            $.each(this.options.media_id_index, function (i) {
                _.indexes.push(i);
            });

            if(this.options.grouped) {
                this.indexes_cache = this.indexes;
            }

            if(this.options.gallery_has_model) {
                this._checkModelXrButton = (slides_namespace, currentSlide) => {
                    let modelId;
                    
                    for(let i of this.indexes) {
                        if(this[slides_namespace][i].$model) {
                            modelId = this[slides_namespace][i].id;
                        }

                        if(i >= currentSlide && modelId) {
                            break;
                        }
                    }

                    this.$buttonXr.attr('data-shopify-model3d-id', modelId);
                };
            }

            if(this.options.gallery_has_video || this.options.gallery_has_model) {
                this.$control_gallery = this.$gallery.find('[data-js-product-gallery-control-video]');

                this._loadMedia = (slides_namespace, index) => {
                    var $model,
                        $source,
                        dataSrc;

                    if(this[slides_namespace][this.indexes[index]].$video && !this[slides_namespace][this.indexes[index]].$video.hasClass('video-loaded')) {
                        this[slides_namespace][this.indexes[index]].$video.attr('poster', this[slides_namespace][this.indexes[index]].$video.attr('data-poster'));

                        $source = this[slides_namespace][this.indexes[index]].$video.find('source').first();
                        dataSrc = $source.attr('data-src');

                        // $source.attr('src', dataSrc);
                        this[slides_namespace][this.indexes[index]].$video.attr('disablePictureInPicture', true).attr('controlsList', 'nodownload noremoteplayback').attr('src', dataSrc).addClass('video-loaded');
                    } else if(this[slides_namespace][this.indexes[index]].$iframe && !this[slides_namespace][this.indexes[index]].$iframe.hasClass('loaded')) {
                        this[slides_namespace][this.indexes[index]].$iframe.addClass('loading').one('load', function () {
                            $(this).addClass('loaded').removeClass('loading');
                        }).attr('src', this[slides_namespace][this.indexes[index]].$iframe.attr('data-src'));
                    } else if(this[slides_namespace][this.indexes[index]].$template && !this[slides_namespace][this.indexes[index]].$template[0].hasAttribute('src')) {
                        $model = $(this[slides_namespace][this.indexes[index]].$template[0].content).children().first();

                        if(this[slides_namespace][this.indexes[index]].$blockratio) {
                            this[slides_namespace][this.indexes[index]].$blockratio.find('[data-js-product-gallery-blockratio-content]').html('');
                            this[slides_namespace][this.indexes[index]].$blockratio.find('[data-js-product-gallery-blockratio-content]').append($model);
                        } else {
                            this[slides_namespace][this.indexes[index]].$item.html('');
                            this[slides_namespace][this.indexes[index]].$item.append($model);
                        }

                        this[slides_namespace][this.indexes[index]].$model = $model;
                        this[slides_namespace][this.indexes[index]].$template = null;
                    }
                    
                    if(this.$buttonXr && this._checkModelXrButton) {
                        this._checkModelXrButton(slides_namespace, index);
                    }
                };

                this._playVideo = ($video) => {
                    if(!$video.hasClass('playing')) {
                        $video.addClass('playing')[0].play();
                    }
                };

                this._pauseVideo = ($video) => {
                    if($video.hasClass('playing')) {
                        $video.removeClass('playing')[0].pause();
                    }
                };

                this._playIframe = ($iframe) => {
                    if(!$iframe.hasClass('playing')) {
                        $iframe.addClass('playing')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
                    }
                };

                this._pauseIframe = ($iframe) => {
                    if($iframe.hasClass('playing')) {
                        $iframe.removeClass('playing')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                    }
                };

                this.switchMedia = (slides_namespace, index, action) => {
                    if(action === 'play' && this.options.video_autoplay) {
                        if(this[slides_namespace][this.indexes[index]].$video && (this[slides_namespace][this.indexes[index]].$video[0].hasAttribute('src') || this[slides_namespace][this.indexes[index]].$video.find('source').first()[0].hasAttribute('src'))) {
                            this._playVideo(this[slides_namespace][this.indexes[index]].$video);
                        } else if(this[slides_namespace][this.indexes[index]].$iframe) {
                            if(this[slides_namespace][this.indexes[index]].$iframe.hasClass('loaded')) {
                                this._playIframe(this[slides_namespace][this.indexes[index]].$iframe);
                            } else if(this[slides_namespace][this.indexes[index]].$iframe.hasClass('loading')) {
                                this[slides_namespace][this.indexes[index]].$iframe.one('load', function () {
                                    _._playIframe(_[slides_namespace][_.indexes[index]].$iframe);
                                });
                            } else if(this[slides_namespace][this.indexes[index]].$iframe[0].hasAttribute('src')) {
                                this._playIframe(this[slides_namespace][this.indexes[index]].$iframe);
                            }
                        }
                    } else if(action === 'pause') {
                        if(this[slides_namespace][this.indexes[index]].$video && this[slides_namespace][this.indexes[index]].$video[0].hasAttribute('src')) {
                            this._pauseVideo(this[slides_namespace][this.indexes[index]].$video);
                        } else if(this[slides_namespace][this.indexes[index]].$iframe) {
                            if(this[slides_namespace][this.indexes[index]].$iframe.hasClass('loaded')) {
                                this._pauseIframe(this[slides_namespace][this.indexes[index]].$iframe);
                            } else if(this[slides_namespace][this.indexes[index]].$iframe.hasClass('loading')) {
                                this[slides_namespace][this.indexes[index]].$iframe.one('load', function () {
                                    _._pauseIframe(_[slides_namespace][_.indexes[index]].$iframe);
                                });
                            }
                        }
                    }
                };
            }

            if(this.options.enable_zoom) {
                this._initZoom = () => {
                    this._getZoomObj = () => {
                        _.zooms = {
                            dom: []
                        };

                        _.fullscreenZooms = {
                            dom: []
                        };

                        var $zooms = this.$gallery.find('[data-js-product-gallery-zoom]'),
                            $fullscreenZooms = this.$gallery.find('[data-js-product-gallery-fullscreen-zoom]');

                        $zooms.each(function () {
                            var $this = $(this);

                            _.zooms.dom.push({
                                $zoom: $this,
                                $container: $this.find('[data-js-product-gallery-zoom-container]'),
                                $ration: $this.find('[data-js-product-gallery-zoom-ratio]'),
                                $image: $this.find('[data-js-product-gallery-zoom-image]')
                            });
                        });

                        $fullscreenZooms.each(function () {
                            var $this = $(this);

                            _.fullscreenZooms.dom.push({
                                $zoom: $this,
                                $container: $this.find('[data-js-product-gallery-zoom-container]'),
                                $ration: $this.find('[data-js-product-gallery-zoom-ratio]'),
                                $image: $this.find('[data-js-product-gallery-zoom-image]')
                            });
                        });
                    };

                    this._updateZoomSize = (zoomNamespace, slides_namespace, zoomIndex, imgIndex) => {
                        if(this[slides_namespace][this.indexes[imgIndex]].$img) {
                            this[zoomNamespace].current_size = {
                                main_image_width: this[slides_namespace][this.indexes[imgIndex]].$img.innerWidth(),
                                main_image_height: this[slides_namespace][this.indexes[imgIndex]].$img.innerHeight()
                            };

                            if(this[slides_namespace][this.indexes[imgIndex]].blockratio_width) {
                                if(this[slides_namespace][this.indexes[imgIndex]].blockratio_width < 100) {
                                    this[zoomNamespace].dom[zoomIndex].$container.attr('style', 'width: ' + Math.round(this[slides_namespace][this.indexes[imgIndex]].blockratio_width) + '% !important;' + (this[slides_namespace][this.indexes[imgIndex]].blockratio_width > 100 ? ' margin-left: -' + (this[slides_namespace][this.indexes[imgIndex]].blockratio_width - 100) / 2 + '% !important;' : ''));
                                }
                            }

                            this[zoomNamespace].dom[zoomIndex].$ration.css({
                                'padding-top': 100 / +this[slides_namespace][this.indexes[imgIndex]].$img.attr('data-aspect-ratio') + '%'
                            });

                            this[zoomNamespace].dom[zoomIndex].$image.css({
                                'padding-top': 100 / +this[slides_namespace][this.indexes[imgIndex]].$img.attr('data-aspect-ratio') + '%'
                            });
                        }
                    };

                    this._switchZoom = (zoomNamespace, slides_namespace, zoomIndex, imgIndex, enable) => {
                        if(enable) {
                            if(this[slides_namespace][this.indexes[imgIndex]].$img && this[zoomNamespace].current_image_index !== imgIndex) {
                                var enableZoom = () => {
                                    var $img = _[slides_namespace][_.indexes[imgIndex]].$img.clone();

                                    if($img[0].hasAttribute('srcset')) {
                                        $img.addClass('donothide');
                                    }

                                    _._updateZoomSize(zoomNamespace, slides_namespace, zoomIndex, imgIndex);

                                    _[zoomNamespace].dom[zoomIndex].$image.append($img.removeAttr('data-ll-status').removeClass('loaded entered'));
                                    
                                    theme.LazyImage.update($img[0]);
                                    _[zoomNamespace].dom[zoomIndex].$zoom.removeClass('invisible');
                                    _[zoomNamespace].current_index = zoomIndex;
                                    _[zoomNamespace].current_image_index = imgIndex;
                                };

                                if(this[slides_namespace][this.indexes[imgIndex]].lazyloaded || !this[slides_namespace][this.indexes[imgIndex]].lazyload_hold) {
                                    enableZoom();
                                } else {
                                    this[slides_namespace][this.indexes[imgIndex]].event_zoom_load = true;
                                    this[slides_namespace][this.indexes[imgIndex]].$img.one('load.zoom', function () {
                                        enableZoom();

                                        _[slides_namespace][_.indexes[imgIndex]].event_zoom_load = null;
                                    });
                                }
                            }
                        } else {
                            if(!zoomIndex && this[zoomNamespace].current_index) {
                                zoomIndex = this[zoomNamespace].current_index;
                                imgIndex = this[zoomNamespace].current_image_index;
                            }

                            if(this[slides_namespace][this.indexes[imgIndex]] && this[slides_namespace][this.indexes[imgIndex]].$img) {
                                if(this[slides_namespace][this.indexes[imgIndex]].event_zoom_load) {
                                    this[slides_namespace][this.indexes[imgIndex]].$img.unbind('load.zoom');
                                    this[slides_namespace][this.indexes[imgIndex]].event_zoom_load = null;
                                }

                                this[zoomNamespace].dom[zoomIndex].$zoom.addClass('invisible');
                                this[zoomNamespace].dom[zoomIndex].$image.html('');
                                this[zoomNamespace].dom[zoomIndex].$container.add(this[zoomNamespace].dom[zoomIndex].$image).removeAttr('style');
                            }

                            this[zoomNamespace].current_size = null;
                            this[zoomNamespace].current_index = null;
                            this[zoomNamespace].current_image_index = null;
                        }
                    };

                    this._updateZoomPosition = (e, zoomNamespace, slides_namespace, zoomIndex, $img, getOnlyData) => {
                        var zoom_offset_coef = e && e.changedTouches ? 1 : this.options.zoom_offset_coef,
                            clientY = e ? e.clientY || e.changedTouches[0].clientY : this.clientY,
                            clientX = e ? e.clientX || e.changedTouches[0].clientX : this.clientX,
                            img_pos = $img[0].getBoundingClientRect(),
                            range_height = this[zoomNamespace].current_size.main_image_height * zoom_offset_coef,
                            range_width = this[zoomNamespace].current_size.main_image_width * zoom_offset_coef,
                            offset_height = (this[zoomNamespace].current_size.main_image_height - range_height) / 2,
                            offset_width = (this[zoomNamespace].current_size.main_image_width - range_width) / 2,
                            cursor_top = clientY - img_pos.top,
                            cursor_left = clientX - img_pos.left,
                            zoom_top = 0,
                            zoom_left = 0;

                        this.clientY = clientY;
                        this.clientX = clientX;

                        // this.clientY = Math.max(Math.min(clientY, img_pos.height), 0);
                        // this.clientX = Math.max(Math.min(clientX, img_pos.width), 0);

                        // this.clientY = Math.max(Math.min(clientY, img_pos.height + 90), 90);
                        // this.clientX = Math.max(Math.min(clientX, img_pos.width), 0);

                        // cursor_top = Math.max(Math.min(cursor_top, img_pos.height), 0);
                        // cursor_left = Math.max(Math.min(cursor_left, img_pos.width), 0);


                        // clearTimeout(window.gg);
                        // window.gg = setTimeout(function () {
                        //     log(_.clientY, range_height, offset_height, cursor_top)
                        // }, 100);

                        if(cursor_top >= this[zoomNamespace].current_size.main_image_height - offset_height) {
                            zoom_top = Math.floor((this[zoomNamespace].current_size.main_image_height - offset_height * 2) * (this[zoomNamespace].current_size.main_image_height * this.options.zoom_scale_coef - this[zoomNamespace].current_size.main_image_height) / range_height);
                        } else if(cursor_top > offset_height) {
                            zoom_top = Math.floor((cursor_top - offset_height) * (this[zoomNamespace].current_size.main_image_height * this.options.zoom_scale_coef - this[zoomNamespace].current_size.main_image_height) / range_height);
                        }

                        if(cursor_left >= this[zoomNamespace].current_size.main_image_width - offset_width) {
                            zoom_left = Math.floor((this[zoomNamespace].current_size.main_image_width - offset_width * 2) * (this[zoomNamespace].current_size.main_image_width * this.options.zoom_scale_coef - this[zoomNamespace].current_size.main_image_width) / range_width);
                        } else if(cursor_left > offset_width) {
                            zoom_left = Math.floor((cursor_left - offset_width) * (this[zoomNamespace].current_size.main_image_width * this.options.zoom_scale_coef - this[zoomNamespace].current_size.main_image_width) / range_width);
                        }

                        if(!getOnlyData) {
                            this[zoomNamespace].dom[zoomIndex].$image.css({
                                transform: `translate3d(${zoom_left * -1}px, ${zoom_top * -1}px, 0)`
                            });
                        }

                        return {
                            clientY: this.clientY,
                            clientX: this.clientX
                        };
                    };

                    this._addZoomImgEvents = (zoomNamespace, $container, slides_namespace, zoomIndex, imgIndex) => {
                        if(window.touch) {
                            return;
                        }

                        $container.on({
                            'mouseenter': function () {
                                _._switchZoom(zoomNamespace, slides_namespace, zoomIndex, (typeof imgIndex === 'function' ? imgIndex() : imgIndex), true);
                            },
                            'mouseleave': function () {
                                _[zoomNamespace].dom[zoomIndex].$image.addClass('invisible');
                                $container.removeClass('is-zooming');
                            },
                            'mousemove': function (e) {
                                if(_[zoomNamespace].current_size) {
                                    _._updateZoomPosition(e, zoomNamespace, slides_namespace, zoomIndex, $(this));
                                    $container.addClass('is-zooming');
                                    _[zoomNamespace].dom[zoomIndex].$image.removeClass('invisible');
                                }
                            }
                        }, 'img');
                    };

                    this._addZoomImgTouchEvents = (zoomNamespace, $container, slides_namespace, zoomIndex, imgIndex) => {
                        if(!window.touch) {
                            return;
                        }

                        let wasFirstTouchEvent = false,
                            isZoomEnable = false,
                            isTouchHold = false,
                            firstTouchTimeout,
                            lastPosition,
                            lastPositionDiff,
                            lastMovePosition;

                        function savePositionDiff(e, that) {
                            lastMovePosition = _._updateZoomPosition(e, zoomNamespace, slides_namespace, zoomIndex, $(that), true);
                            lastPositionDiff = lastMovePosition;
                            lastPositionDiff.clientX = lastPosition.clientX - lastPositionDiff.clientX;
                            lastPositionDiff.clientY = lastPosition.clientY - lastPositionDiff.clientY;
                        };

                        $container.on({
                            'close beforeChange': function () {
                                isZoomEnable = false;
                                isTouchHold = false;
                                _[zoomNamespace].dom[zoomIndex].$image.addClass('invisible');
                                $container.removeClass('is-zooming');
                            }
                        });

                        $container.on({
                            'touchstart': function (e) {
                                e.preventDefault();

                                let dbltouch = false;

                                if(wasFirstTouchEvent) {
                                    wasFirstTouchEvent = false;
                                    dbltouch = true;
                                }

                                if(dbltouch) {
                                    if(isZoomEnable) {
                                        _[zoomNamespace].dom[zoomIndex].$image.addClass('invisible');
                                        $container.removeClass('is-zooming');
                                        $container.slick('slickSetOption', 'swipe', true);
                                        isZoomEnable = false;
                                        isTouchHold = false;
                                    } else {
                                        clearTimeout(firstTouchTimeout);
                                        _._switchZoom(zoomNamespace, slides_namespace, zoomIndex, (typeof imgIndex === 'function' ? imgIndex() : imgIndex), true);
                                        lastPosition = _._updateZoomPosition(e, zoomNamespace, slides_namespace, zoomIndex, $(this));
                                        savePositionDiff(e, this);
                                        $container.slick('slickSetOption', 'swipe', false);
                                        $container.addClass('is-zooming');
                                        _[zoomNamespace].dom[zoomIndex].$image.removeClass('invisible');
                                        isZoomEnable = true;
                                        isTouchHold = true;
                                    }
                                } else if(isZoomEnable) {
                                    savePositionDiff(e, this);
                                    isTouchHold = true;
                                }

                                if(!dbltouch) {
                                    wasFirstTouchEvent = true;
                                    firstTouchTimeout = setTimeout(() => wasFirstTouchEvent = false, 400);
                                }
                            },
                            'touchend': function () {
                                isTouchHold = false;
                            },
                            'touchmove': function (e) {
                                if(isZoomEnable && isTouchHold && _[zoomNamespace].current_size) {
                                    _._updateZoomPosition(e, zoomNamespace, slides_namespace, zoomIndex, $(this));

                                    // lastPosition = _._updateZoomPosition({
                                    //     changedTouches: [
                                    //         {
                                    //             clientX: lastMovePosition.clientX + (e.changedTouches[0].clientX - lastMovePosition.clientX) + lastPositionDiff.clientX,
                                    //             clientY: lastMovePosition.clientY + (e.changedTouches[0].clientY - lastMovePosition.clientY) + lastPositionDiff.clientY
                                    //         }
                                    //     ]
                                    // }, zoomNamespace, slides_namespace, zoomIndex, $(this));
                                }
                            }
                        }, 'img');
                    };

                    this._addSingleZoomImgEvents = (zoomNamespace, $container, slides_namespace, imgIndex) => {
                        this._addZoomImgEvents(zoomNamespace, $container, slides_namespace, 0, imgIndex);

                        this.$scroll_elem.on('scroll.productgallery.' + this.options.id, () => {
                            if(_[slides_namespace][_.indexes[(typeof imgIndex === 'function' ? imgIndex() : imgIndex)]] && _[slides_namespace][_.indexes[(typeof imgIndex === 'function' ? imgIndex() : imgIndex)]].$img && $container.hasClass('is-zooming')) {
                                _._updateZoomPosition(null, zoomNamespace, slides_namespace, 0, _[slides_namespace][_.indexes[(typeof imgIndex === 'function' ? imgIndex() : imgIndex)]].$img);
                            }
                        });
                    };

                    this._addMultipleZoomImgEvents = (zoomNamespace, slides_namespace, slides_all_namespace) => {
                        var zoomIndex = 0;
                        
                        $.each(this[slides_namespace], (i) => {
                            if(this[slides_namespace][i].$img) {
                                _._addZoomImgEvents(zoomNamespace, this[slides_namespace][i].$item, slides_namespace, zoomIndex++, () => {
                                    return _.indexes.indexOf(i);
                                });
                            }
                        });

                        this.$scroll_elem.on('scroll.productgallery.' + this.options.id, () => {
                            var zoomIndex = 0;

                            $.each(_[slides_all_namespace], (i) => {
                                if(_[slides_all_namespace][i].$img) {
                                    if(_[slides_all_namespace][i].$item.hasClass('is-zooming')) {
                                        _._updateZoomPosition(null, zoomNamespace, slides_namespace, zoomIndex, _[slides_all_namespace][i].$img);

                                        return false;
                                    }

                                    zoomIndex++;
                                }
                            });
                        });
                    };

                    this._getZoomObj();

                    delete this._initZoom;
                };

                this._initZoom();
            }

            if(this.options.main.enabled || this.options.fullscreen.enable) {
                this._loadSlideImage = (slides_namespace, index) => {
                    if(this[slides_namespace][this.indexes[index]].lazyload_hold) {
                        this[slides_namespace][this.indexes[index]].lazyload_hold = null;

                        if(!this[slides_namespace][this.indexes[index]].$img.hasClass('loaded')) {
                            this[slides_namespace][this.indexes[index]].$img.removeClass('lazyload--hold').one('load', () => {
                                _[slides_namespace][_.indexes[index]].lazyloaded = true;
                            });
                        } else {
                            this[slides_namespace][this.indexes[index]].lazyloaded = true;
                        }

                        theme.LazyImage.update(this[slides_namespace][this.indexes[index]].$img[0]);
                    }
                };

                this._loadSlideContent = (slides_namespace, index) => {
                    this._loadSlideImage(slides_namespace, index);

                    if(this._loadMedia) {
                        this._loadMedia(slides_namespace, index);
                    }
                };

                this._timeoutCheckSliderContent = (timeout) => {
                    this.check_slider_content_timeout = setTimeout(() => {
                        _._checkSliderContent('main_slides');
                    }, timeout);
                };

                this._clearTimeoutCheckSliderContent = () => {
                    if(this.check_slider_content_timeout) {
                        clearTimeout(this.check_slider_content_timeout);

                        this.check_slider_content_timeout = null;
                    }
                };

                this._checkSliderContent = (slides_namespace, preload_off) => {
                    this._clearTimeoutCheckSliderContent();

                    var was_video = false,
                        active_index;

                    $.each(this.indexes, (i) => {
                        if(_[slides_namespace][_.indexes[i]].$item.hasClass('slick-active')) {
                            _._loadSlideContent(slides_namespace, i);

                            if(_[slides_namespace][_.indexes[i]].$video || _[slides_namespace][_.indexes[i]].$iframe) {
                                if(_.options.gallery_has_video) {
                                    _.switchMedia(slides_namespace, i, (was_video ? 'pause' : 'play'));
                                }

                                was_video = true;
                            }

                            if(!preload_off && !active_index && i > 0) {
                                _._loadSlideContent(slides_namespace, i - 1);
                            }

                            active_index = i;
                        } else {
                            if(_.options.gallery_has_video) {
                                _.switchMedia(slides_namespace, i, 'pause');
                            }

                            if(active_index !== undefined && i === active_index + 1) {
                                _._loadSlideContent(slides_namespace, i);
                            }

                            if(!preload_off && active_index !== undefined && i === active_index + 2) {
                                _._loadSlideContent(slides_namespace, i);
                            }
                        }
                    });
                };

                var sliderOnChangeEvents = (slider_namespace, slides_namespace, slick_namespace) => {
                    _[slider_namespace].on({
                        'afterChange': (event, slick) => {
                            _[slick_namespace] = slick;

                            _._checkSliderContent(slides_namespace);
                        }
                    });
                };
            }

            if(this.options.main.enabled) {
                this._initMainSlider = () => {
                    this.$main_slider_wrapper = this.$main_slider.parent('[data-js-product-gallery-main-slider-wrapper]');
                    this.$buttonXr = this.$gallery.find('[data-js-product-gallery-button-xr]');

                    this.$main_slider.removeClass('d-none-important');

                    if(this.options.main.slick.arrows) {
                        this.options.main.slick.prevArrow = this.$main_slider_wrapper.find('[data-js-product-gallery-main-arrow-prev]');
                        this.options.main.slick.nextArrow = this.$main_slider_wrapper.find('[data-js-product-gallery-main-arrow-next]');
                    }

                    if(this.options.grouped) {
                        this._groupMainSlider = (group) => {
                            if(this.current_group_main_slider !== group) {
                                if(this.options.gallery_has_video) {
                                    this.switchMedia('main_slides', this.main_slick.currentSlide, 'pause');
                                }

                                if(this._switchZoom) {
                                    this._switchZoom('zooms', 'main_slides', 0, this.main_slick.currentSlide);
                                }

                                this.$main_slider.slick('slickUnfilter');

                                if(this.options.group_values.indexOf(group) !== -1) {
                                    this.$main_slider.slick('slickFilter', '[data-group="' + group + '"], [data-group="video_group"]');
                                }

                                this.$main_slider.slick('setPosition');

                                this.main_slick = this.$main_slider.slick('getSlick');

                                this._updateData('main_slides', 'main_slick', 0, group);

                                _._mainGoToSlide(0);

                                this._checkSliderContent('main_slides');

                                this.current_group_main_slider = group;
                            }
                        };
                    }

                    this.$main_slider.one('init', (event, slick) => {
                        _.$main_slider_wrapper.addClass('initialized');
                        theme.Preloader.unset(_.$main_slider_wrapper);
                        _.main_slick = slick;
                        _._updateData('main_slides', 'main_slick', _.options.main.slick.initialSlide);

                        if(!_.options.first_load_group) {
                            _._checkSliderContent('main_slides', true);

                            /*_._checkSliderContent('main_slides');
                            if(!window.tst && !window.isDesignMode) {
                                _._timeoutCheckSliderContent(1500);
                            }*/
                        }

                        _._mainGoToSlide = (index) => {
                            this.$main_slider.slick('slickGoTo', index, true);
                        };

                        $window.on('theme.changed.breakpoint.productgallery.' + _.options.id, () => {
                            _.$main_slider.slick('setPosition');
                        });

                        sliderOnChangeEvents('$main_slider', 'main_slides', 'main_slick');
                    });

                    if(this.options.gallery_has_video) {
                        this.$control_gallery.on('click', () => {
                            _.goToSlide(_.first_video_index);
                        });
                    }

                    this.$main_slider.slick(this.options.main.slick);

                    if(this.options.enable_zoom) {
                        this._initMainZoom = () => {
                            this.$main_slider.on({
                                'beforeChange': (event, slick, currentSlide) => {
                                    _._switchZoom('zooms', 'main_slides', 0, currentSlide);
                                },
                                'afterChange': (event, slick, currentSlide) => {
                                    _._switchZoom('zooms', 'main_slides', 0, currentSlide, true);
                                }
                            });

                            if(this.options.main.slick.slidesToShow === 1) {
                                this._addSingleZoomImgEvents('zooms', this.$main_slider, 'main_slides', () => {
                                    return _.main_slick.currentSlide;
                                });
                            } else {
                                this._addMultipleZoomImgEvents('zooms', 'main_slides', 'main_slides');
                            }

                            delete this._initMainZoom;
                        };

                        !this.$main_slider.hasClass('slick-initialized') ? this.$main_slider.on('init', this._initMainZoom.apply(this)) : this._initMainZoom.call(this);
                    }

                    if(this.options.fullscreen.enable) {
                        this.$main_slider.on('click', (e) => {
                            if(e.target.closest('.product-gallery__main_item--type-video')) return;

                            const $item = $(e.target).parents('[data-js-product-gallery-main-item]');
                            let initialSlide = 0;

                            for(let i = 0; i < _.indexes.length; i++) {
                                if(_.main_slides[_.indexes[i]].$item[0] === $item[0]) {
                                    initialSlide = i;
                                    break;
                                }
                            }

                            _.onFullscreenShow(initialSlide);
                        });
                    }

                    if(this.options.gallery_has_model) {
                        const setupShopifyXr = () => {
                            if (!window.ShopifyXR) {
                                document.addEventListener('shopify_xr_initialized', () => {
                                    setupShopifyXr();
                                });
                            } else {
                                window.ShopifyXR.addModels(_.options.models_json);
                                window.ShopifyXR.setupXRElements();
                            }
                        };

                        window.Shopify.loadFeatures([
                            {
                                name: 'shopify-xr',
                                version: '1.0',
                                onLoad: setupShopifyXr
                            }
                        ]);
                    }

                    delete this._initMainSlider;
                };

                this._resizeInit(() => {
                    _._initMainSlider.call(_);

                    if(_.options.first_load_group) {
                        _._groupMainSlider(_.options.first_load_group);
                    }
                }, this.options.main.device);
            }

            if(this.options.thumbnail.enabled) {
                this.$thumbnail_slider = this.$gallery.find('[data-js-product-gallery-thumbnail-slider]');

                this._initThumbnailSlider = () => {
                    this.$thumbnail_items = this.$thumbnail_slider.find('[data-js-product-gallery-thumbnail-item]');

                    if(this.options.grouped) {
                        this._groupThumbnailSlider = group => {
                            if(this.current_group_thumbnail !== group) {
                                this.$thumbnail_slider.slick('slickUnfilter');

                                if(this.options.group_values.indexOf(group) !== -1) {
                                    this.$thumbnail_slider.slick('slickFilter', '[data-group="' + group + '"], [data-group="video_group"]');
                                }

                                this.$thumbnail_slider.slick('setPosition');
                                this.$thumbnail_items = this.$thumbnail_slider.find('[data-js-product-gallery-thumbnail-item]');
                                this._thumbnailGoToSlide(0);
                                
                                this.$thumbnail_slider[0].dispatchEvent(new Event('slider-initialized'));
                            
                                this.current_group_thumbnail = group;

                                theme.LazyImage.update();
                            }
                        };
                    }

                    this.$thumbnail_slider.removeClass('d-none-important');

                    this.options.thumbnail.slick.prevArrow = this.$gallery.find('[data-js-product-gallery-thumbnail-arrow-prev]');
                    this.options.thumbnail.slick.nextArrow = this.$gallery.find('[data-js-product-gallery-thumbnail-arrow-next]');

                    this.$thumbnail_slider.one('init', () => {
                        _.$thumbnail_items.removeClass('current').eq(_.main_slick.currentSlide).addClass('current');

                        $window.on('theme.changed.breakpoint.productgallery.' + _.options.id, function () {
                            _.$thumbnail_slider.slick('setPosition');
                        });

                        _._thumbnailGoToSlide = (index) => {
                            _.$thumbnail_slider.slick('slickGoTo', index);

                            _.$thumbnail_items.removeClass('current').eq(index).addClass('current');
                        };

                        _.$main_slider.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
                            _._thumbnailGoToSlide(nextSlide);
                        });

                        _.$thumbnail_items.on('click', function () {
                            var $this = $(this);

                            if(!$this.hasClass('current')) {
                                _.goToSlide(_.$thumbnail_items.index($this));
                            }
                        });
                    });

                    const currentBpSlidesToShow = theme.current.width >= 1260 ? this.options.thumbnail.slick.slidesToShow :
                                                    theme.current.width >= 1025 ? this.options.thumbnail.slick.responsive[0].settings.slidesToShow :
                    								theme.current.width >= 768 ? this.options.thumbnail.slick.responsive[1].settings.slidesToShow :
                    								this.options.thumbnail.slick.responsive[2].settings.slidesToShow;
                                                    
                    if(this.main_slick.currentSlide) {
                        this.options.thumbnail.slick.initialSlide = this.main_slick.currentSlide - 1 > currentBpSlidesToShow ? Math.min(this.main_slick.currentSlide, this.indexes.length - currentBpSlidesToShow) : 0;
                    }

                    this.$thumbnail_slider.slick(this.options.thumbnail.slick);

                    delete this._initThumbnailSlider;
                };

                this._resizeInit(() => {
                    _._initThumbnailSlider.call(_);

                    if(_.current_group_main_slider) {
                        _._groupThumbnailSlider(_.current_group_main_slider);
                    }
                }, this.options.thumbnail.device);
            }

            if(this.options.collage.enabled) {
                this.$collage = this.$gallery.find('[data-js-product-gallery-collage]');

                this._initCollage = () => {
                    this.$collage_items = this.$collage.find('[data-js-product-gallery-thumbnail-item]');

                    if(this.options.grouped) {
                        this._groupCollage = (group) => {
                            var $collage_items;

                            if(this.current_group_collage !== group) {
                                $collage_items = this.$collage.find('[data-js-product-gallery-thumbnail-item]');

                                $collage_items.removeClass('d-none');

                                if(this.options.group_values.indexOf(group) !== -1) {
                                    $collage_items.not('[data-group="' + group + '"], [data-group="video_group"]').addClass('d-none');
                                }

                                this.$collage_items = this.$collage.find('[data-js-product-gallery-thumbnail-item]').not('.d-none');

                                this._collageGoToSlide(0);

                                this.current_group_collage = group;
                            }
                        };
                    }

                    this.$collage_items.removeClass('current').eq(this.indexes[this.main_slick.currentSlide]).addClass('current');

                    this._collageGoToSlide = (index) => {
                        this.$collage_items.removeClass('current').eq(index).addClass('current');
                    };

                    this.$main_slider.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
                        _._collageGoToSlide(nextSlide);
                    });

                    this.$collage_items.on('click', function () {
                        var $this = $(this);

                        if(!$this.hasClass('current')) {
                            _.goToSlide(_.$collage_items.index($this));
                        }
                    });

                    delete this._initCollage;
                };

                this._resizeInit(() => {
                    _._initCollage.call(_);
                }, this.options.collage.device);
            }

            if(this.options.sheet.enabled) {
                this._initSheet = () => {
                    this.$sheet = this.$gallery.find('[data-js-product-gallery-sheet]');
                    this.$sheet_items = this.$sheet.find('[data-js-product-gallery-sheet-item]');

                    this.sheet_slides = [];
                    this.sheet_contents = {
                        currentSlide: 0,
                        $slides: []
                    };

                    this._updateSheetContentData = (get_all) => {
                        this.sheet_contents.$slides = get_all ? this.$sheet_items : this.$sheet_items.not('.d-none');
                    };

                    this._updateSheetContentData(true);
                    this._updateData('sheet_slides', 'sheet_contents', 0);

                    this.sheet_slides_all = this.sheet_slides;

                    if(this.options.grouped) {
                        this._groupSheet = (group) => {
                            if(this.current_group_sheet !== group) {
                                if(this._switchZoom) {
                                    this._switchZoom('zooms', 'sheet_slides');
                                }

                                this.$sheet_items.removeClass('d-none');

                                if(this.options.group_values.indexOf(group) !== -1) {
                                    this.$sheet_items.not('[data-group="' + group + '"], [data-group="video_group"]').addClass('d-none');
                                }

                                this._updateSheetContentData();

                                this._updateData('sheet_slides', 'sheet_contents', 0, group);

                                this.current_group_sheet = group;
                            }
                        };
                    } else {
                        if(this.options.gallery_has_video && this.options.video_autoplay) {
                            this.switchMedia('sheet_slides', this.first_video_index, 'play');
                        }
                    }

                    if(this.options.gallery_has_video) {
                        this.$control_gallery.on('click', function () {
                            if(_.$scroll_elem[0] === window) {
                                const $video = _.sheet_slides[_.indexes[_.first_video_index]].$video || _.sheet_slides[_.indexes[_.first_video_index]].$iframe;

                                $('html, body').animate({
                                    scrollTop: $video.offset().top,
                                    duration: 500,
                                    complete: function () {
                                        if(_.options.gallery_has_video) {
                                            _.switchMedia('sheet_slides', _.first_video_index, 'play');
                                        }
                                    }
                                });
                            } else {
                                _.$scroll_elem.animate({
                                    //scrollTop: (_.$scroll_elem[0].getBoundingClientRect().top - _.sheet_slides[_.indexes[_.first_video_index]].$video[0].getBoundingClientRect().top) * -1
                                    scrollTop: 0
                                }, {
                                    duration: 500,
                                    complete: function () {
                                        /*if(_.options.gallery_has_video) {
                                            _.switchMedia('sheet_slides', _.first_video_index, 'play');
                                        }*/
                                    }
                                });
                            }
                        });

                        $window.on('product-gallery-fullscreen.open.' + this.options.id, function () {
                            $.each(_.indexes, function (i) {
                                if(_.options.gallery_has_video) {
                                    _.switchMedia('sheet_slides', i, 'pause');
                                }
                            });
                        });
                    }

                    if(this.options.fullscreen.enable) {
                        this.$sheet_items.on('click', function(e) {
                            const $item = $(e.target).parents('[data-js-product-gallery-sheet-item]');
                            let initialSlide = 0;

                            for(let i = 0; i < _.indexes.length; i++) {
                                if(_.sheet_slides[_.indexes[i]].$item[0] === $item[0]) {
                                    initialSlide = i;
                                    break;
                                }
                            }

                            _.onFullscreenShow(initialSlide);
                        });
                    }

                    if(this.options.enable_zoom) {
                        this._initSheetZoom = () => {
                            this._addMultipleZoomImgEvents('zooms', 'sheet_slides', 'sheet_slides_all');

                            delete this._initSheetZoom;
                        };

                        this._resizeInit(() => {
                            _._initSheetZoom.call(_);
                        }, 'desktop');
                    }

                    delete this._initSheet;
                };

                this._resizeInit(() => {
                    _._initSheet.call(_);

                    if(_.options.first_load_group) {
                        _._updateSheetContentData();
                        _._updateData('sheet_slides', 'sheet_contents', 0, _.options.first_load_group);
                    }
                }, this.options.collage.device);
            }

            if(this.options.single) {
                this._initSingle = () => {
                    this.$single = this.$gallery.find('[data-js-product-gallery-main-single]');

                    this.single_content = {
                        currentSlide: 0,
                        $slides: this.$single.find('[data-js-product-gallery-main-item]')
                    };

                    this._updateData('single_slides', 'single_content', 0);

                    if(this.options.enable_zoom) {
                        this._initSingleZoom = () => {
                            this._addSingleZoomImgEvents('zooms', this.$single, 'single_slides', 0);

                            delete this._initSingleZoom;
                        };

                        this._resizeInit(function() {
                            _._initSingleZoom.call(_);
                        }, 'desktop');
                    }

                    delete this._initSingle;
                };

                this._resizeInit(function () {
                    _._initSingle.call(_);
                }, 'desktop');
            }

            if(this.options.fullscreen.enable) {
                this._initFullscreen = () => {
                    this.$control_fullscreen = this.$gallery.find('[data-js-product-gallery-control-fullscreen]');
                    this.$fullscreen = this.$gallery.find('[data-js-product-gallery-fullscreen]');
                    this.$fullscreen_slider = this.$gallery.find('[data-js-product-gallery-fullscreen-slider]');

                    if(this.options.fullscreen.slick.arrows) {
                        this.options.fullscreen.slick.prevArrow = this.$fullscreen.find('[data-js-product-gallery-fullscreen-arrow-prev]');
                        this.options.fullscreen.slick.nextArrow = this.$fullscreen.find('[data-js-product-gallery-fullscreen-arrow-next]');
                    }

                    this.$fullscreenBlockratioHeightStyle = $(`.gallery-style-${this.options.id}`);
                    
                    this.fullscreenBlockratioHeightStyleTemplate = this.$fullscreenBlockratioHeightStyle.attr('data-template');
                    
                    this.setFullscreenBlockratioHeight = () => {
                        const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                        this.$fullscreenBlockratioHeightStyle.html($('<style>').html(this.fullscreenBlockratioHeightStyleTemplate.replace('[styles]', `padding-top: ${windowHeight}px !important;`)));
                    };

                    if(this.options.enable_zoom && this.options.zoom_type !== 'native') {
                        this._initFullscreenZoom = () => {
                            this.$fullscreen_slider.on({
                                'beforeChange close': function (event, slick, currentSlide) {
                                    _._switchZoom('fullscreenZooms', 'fullscreen_slides', 0, currentSlide);
                                },
                                'afterChange': function (event, slick, currentSlide) {
                                    _._switchZoom('fullscreenZooms', 'fullscreen_slides', 0, currentSlide, true);
                                }
                            });

                            this._addZoomImgTouchEvents('fullscreenZooms', this.$fullscreen_slider, 'fullscreen_slides', 0, function () {
                                return _.fullscreen_slick.currentSlide;
                            });
                        };
                    }

                    this._toggleFullscreen = (slides_namespace, contents_namespace, action, initialSlide) => {
                        action = action ? action : this.$fullscreen.hasClass('show') ? 'hide' : 'show';

                        if(action === 'show') {
                            $body.addClass('product-gallery-fullscreen');

                            this.$fullscreen.addClass('show').one('transitionend', function () {
                                _.$fullscreen.removeClass('animate');
                            }).addClass('animate');

                            setTimeout(function () {
                                _.$fullscreen.addClass('visible');

                                if(_.$fullscreen.css('transition-duration') === '0s') {
                                    _.$fullscreen.trigger('transitionend');
                                }
                            }, 0);

                            $.each(this.indexes, function (i) {
                                var $content,
                                    $img;

                                if(_[slides_namespace][_.indexes[i]].$img) {
                                    if(_[slides_namespace][_.indexes[i]].$blockratio) {
                                        $content = _[slides_namespace][_.indexes[i]].$blockratio.clone();
                                    } else {
                                        $content = `
                                        <div class="product-gallery__blockratio overflow-hidden" data-js-product-gallery-blockratio>
                                            <div class="product-gallery__blockratio_content w-100 w-100-inner" data-js-product-gallery-blockratio-content>
                                                ${_[slides_namespace][_.indexes[i]].$img.parent().parent().html()}
                                            </div>
                                        </div>
                                        `;

                                        $content = $($content);
                                    }

                                    $img = $content.find('img');

                                    $img.removeAttr('data-ll-status').removeClass('lazyload--hold loaded').addClass('rimage__img--contain');

                                    if($img[0].hasAttribute('srcset')) {
                                        $img.addClass('donothide');
                                    }
                                } else if(_[slides_namespace][_.indexes[i]].$video) {
                                    $content = _[slides_namespace][_.indexes[i]].$video.parent().clone();
                                    $content.find('video').removeClass('playing');
                                } else if(_[slides_namespace][_.indexes[i]].$iframe) {
                                    $content = _[slides_namespace][_.indexes[i]].$iframe.parent().clone();
                                    $content.find('iframe').removeClass('playing');
                                } else if(_[slides_namespace][_.indexes[i]].$template) {
                                    $content = _[slides_namespace][_.indexes[i]].$template.clone();
                                } else if(_[slides_namespace][_.indexes[i]].$item.find('.model-viewer-wrapper').length) {
                                    $content = _[slides_namespace][_.indexes[i]].$item.find('.model-viewer-wrapper').clone();
                                }

                                _.$fullscreen_slider.append($('<div>').addClass('product-gallery__fullscreen_item').attr('data-item-index', i).append($content));
                            });

                            $window.on('theme.resize.fullscreen.ratio.' + _.options.id, () => {
                                this._updateData('fullscreen_slides', 'fullscreen_slick', _[slides_namespace].currentSlide);
                                this.setFullscreenBlockratioHeight();

                                // if(this._switchZoom) {
                                //     this._switchZoom('fullscreenZooms', 'fullscreen_slides', 0);
                                // }
                            });

                            this.$fullscreen_slider.one('init', function (event, slick) {
                                _.fullscreen_slick = slick;
                                _.fullscreen_slides = [];

                                _._updateData('fullscreen_slides', 'fullscreen_slick', _[contents_namespace].currentSlide);
                                _.setFullscreenBlockratioHeight();
                                
                                if(_._initFullscreenZoom) {
                                    _._initFullscreenZoom.call(_);
                                }

                                // theme.LazyImage.update();

                                sliderOnChangeEvents('$fullscreen_slider', 'fullscreen_slides', 'fullscreen_slick');

                                if(_.options.gallery_has_video) {
                                    _.switchMedia(slides_namespace, _[contents_namespace].currentSlide, 'pause');
                                    _.switchMedia('fullscreen_slides', _[contents_namespace].currentSlide, 'play');
                                }
                            });

                            this.options.fullscreen.slick.initialSlide = initialSlide || _[contents_namespace].currentSlide;

                            this.$fullscreen_slider.slick(_.options.fullscreen.slick);

                            $body.on('keyup.productgallery.fullscreen.' + _.options.id, function(e) {
                                if(e.keyCode === 27) {
                                    _._toggleFullscreen(null, null, 'hide');
                                } else if(e.keyCode === 37 || e.keyCode === 40) {
                                    _.$fullscreen_slider.slick('slickGoTo', _.fullscreen_slick.currentSlide - 1);
                                } else if(e.keyCode === 38 || e.keyCode === 39) {
                                    _.$fullscreen_slider.slick('slickGoTo', _.fullscreen_slick.currentSlide + 1);
                                }
                            });
                        } else {
                            $window.unbind('theme.resize.fullscreen.ratio.' + this.options.id);

                            this.$fullscreen_slider.trigger('close');

                            this.$fullscreen.unbind('transitionend').one('transitionend', function () {
                                _.$fullscreen.removeClass('show animate');

                                $body.removeClass('product-gallery-fullscreen');

                                _.$fullscreen_slider.slick('unslick').off().html('');
                            }).addClass('animate');

                            setTimeout(function () {
                                if(!_.$fullscreen.hasClass('visible') || _.$fullscreen.css('transition-duration') === '0s') {
                                    _.$fullscreen.trigger('transitionend');
                                }

                                _.$fullscreen.removeClass('visible');
                            }, 0);

                            this.$fullscreen_slider.add(this.$fullscreen_slider.find('img')).off();
                            $window.unbind('theme.resize.productgallery.fullscreen.' + _.options.id);
                            $body.unbind('keyup.productgallery.fullscreen.' + _.options.id);

                            this.fullscreen_slick = null;
                            this.fullscreen_slides = null;
                        }
                    };

                    this.onFullscreenShow = (initialSlide) => {
                        if(window.touch && this.options.enable_zoom && this.options.zoom_type === 'native' && theme.current.is_mobile) {
                            return;
                        }

                        var device = theme.current.is_desktop_md ? 'desktop' : 'mobile',
                            slider_namespace = _.options.sheet.enabled && device === _.options.sheet.device ? 'sheet_slides' : _.options.single ? 'single_slides' : 'main_slides',
                            contents_namespace = _.options.sheet.enabled && device === _.options.sheet.device ? 'sheet_contents' : _.options.single ? 'single_content' : 'main_slick';

                        theme.AssetsLoader.loadManually([
                            ['styles', 'plugin_slick'],
                            ['scripts', 'plugin_slick']
                        ],
                        () => {
                            this._toggleFullscreen(slider_namespace, contents_namespace, null, initialSlide);
                        });

                        $window.trigger('product-gallery-fullscreen.open.' + _.options.id);
                    };

                    this.$control_fullscreen.on('click', () => this.onFullscreenShow());

                    delete this._initFullscreen;
                };

                !this.$main_slider.hasClass('slick-initialized') ? this.$main_slider.on('init', this._initFullscreen.apply(this)) : this._initFullscreen.call(this);
            }

            if(window.touch && this.options.enable_zoom && this.options.zoom_type === 'native') {
                const $galleryMobileZoom = $('gallery-mobile-zoom');
                const $galleryContent = $galleryMobileZoom.find('.gallery-mobile-zoom__content');
                const $galleryImg = $galleryMobileZoom.find('.gallery-mobile-zoom__image');
                const $galleryClose = $galleryMobileZoom.find('.gallery-mobile-zoom__close');

                this.$gallery.find('img[data-master]').on('click', function() {
                    const $img = $('<img>');

                    $galleryImg.html('').append($img).addClass('active'); 
                    $galleryMobileZoom.addClass('active');
                    $img.on('load', () => {
                        $galleryContent[0].scrollTo(
                            $galleryContent[0].getBoundingClientRect().width / 2, 
                            $galleryContent[0].getBoundingClientRect().height / 2
                        );
                        $galleryImg.addClass('visible');
                    });
                    theme.Global.fixBody();
                    $img.attr('src', $(this).attr('data-master').replace('{width}', theme.current.width * 2));
                });

                $galleryClose.on('click', function() {
                    $galleryMobileZoom.add($galleryImg).removeClass('active');
                    $galleryImg.removeClass('visible');
                    theme.Global.unfixBody();
                });
            }

            this.$gallery.addClass('initialized');

            delete this._create;
        }

        _updateData(slides_namespace, contents_namespace, initialSlide, group) {
            var _ = this,
                i = 0;

            if(group) {
                if(this.options.group_values.indexOf(group) !== -1) {
                    this.indexes = [];

                    $.each(this.options.group_values, function (i, v) {
                        if(v === group || v === 'video_group') {
                            _.indexes.push(i);
                        }
                    });
                } else {
                    this.indexes = this.indexes_cache;
                }
            }

            if(this[contents_namespace]) {
                this[slides_namespace] = [];
                this.first_video_index = null;

                for(; i < this.indexes.length; i++) {
                    var $item = $(this[contents_namespace].$slides[i]),
                        obj = {},
                        $content = $item.find('img, video, iframe, template').first(),
                        $content_model = $item.find('.model-viewer-wrapper'),
                        blockratio_width;

                    obj.$item = $item;

                    if($content.length) {
                        obj['$' + $content[0].tagName.toLowerCase()] = $content;
                    } else if($content_model.length) {
                        obj.$model = $content_model;
                        obj.id = $content_model.attr('data-model3d-id');
                    }

                    if($content_model.length || $content[0].tagName === 'TEMPLATE') {
                        if(slides_namespace === 'main_slides') {
                            obj.$blockratio = $item.find('[data-js-product-gallery-blockratio]');
                        }
                    } else if($content[0].tagName === 'IMG') {
                        if(slides_namespace === 'main_slides' || slides_namespace === 'fullscreen_slides') {
                            if(i === initialSlide && !group) {
                                obj.lazyloaded = true;
                            } else {
                                obj.lazyload_hold = true;
                            }

                            obj.$blockratio = $item.find('[data-js-product-gallery-blockratio]');

                            if(slides_namespace === 'fullscreen_slides') {
                                blockratio_width = theme.current.height_percent / (100 / +obj.$img.attr('data-aspect-ratio')) * 100;

                                if(blockratio_width < 100) {
                                    obj.$blockratio.attr('data-width', blockratio_width).css({
                                        'max-width': `${blockratio_width}%`
                                    });

                                    obj.blockratio_width = blockratio_width;
                                } else {
                                    obj.$blockratio.removeAttr('data-width').css({
                                        'max-width': ''
                                    });
                                }
                            } else {
                                obj.blockratio_width = obj.$blockratio.attr('data-width');
                            }
                        }
                    } else if(($content[0].tagName === 'VIDEO' || $content[0].tagName === 'IFRAME') && _.first_video_index === null) {
                        _.first_video_index = i;
                    }

                    this[slides_namespace][_.indexes[i]] = obj;
                }
            }
        }

        _resizeInit(func, device) {
            var resize_event = 'theme.changed.breakpoint.productgallery.init.' + this.options.id + '.' + Math.random();

            if(device === 'all' || (device === 'desktop' && theme.current.is_desktop_md) || (device === 'mobile' && theme.current.is_mobile)) {
                func();
            } else if(device === 'desktop' || device === 'mobile') {
                $window.on(resize_event, function () {
                    if((device === 'desktop' && theme.current.is_desktop_md) || (device === 'mobile' && theme.current.is_mobile)) {
                        $window.unbind(resize_event);
                        func();
                    }
                });
            }
        }

        goToSlide(index) {
            if(this._mainGoToSlide) {
                this._mainGoToSlide(index);
            }

            if(this._thumbnailGoToSlide) {
                this._thumbnailGoToSlide(index);
            }

            if(this._collageGoToSlide) {
                this._collageGoToSlide(index);
            }
        }

        goToSlideById(id, group) {
            var index;

            if(this.options.grouped) {
                if(this._groupMainSlider) {
                    this._groupMainSlider(group);
                }

                if(this._groupThumbnailSlider) {
                    this._groupThumbnailSlider(group);
                }

                if(this._groupCollage) {
                    this._groupCollage(group);
                }

                if(this._groupSheet) {
                    this._groupSheet(group);
                }
            } else {
                index = this.options.media_id_index.indexOf(id);

                if(index === -1) {
                    index = 0;
                }

                this.goToSlide(index);
            }
        }

        destroy() {
            if(this.$main_slider && this.$main_slider.hasClass('slick-initialized')) {
                this._clearTimeoutCheckSliderContent();
                this.$main_slider.slick('unslick').off();
            }
            if(this.$thumbnail_items) {
                this.$thumbnail_slider.slick('unslick').off();
            }

            $window.unbind('theme.changed.breakpoint.productgallery' + this.options.id);
            $window.unbind('theme.resize.productgallery.' + this.options.id);
            $window.unbind('product-gallery-fullscreen.open.' + this.options.id);
            $window.unbind('scroll.productgallery.' + this.options.id);
            $window.unbind('theme.resize.fullscreen.ratio.' + this.options.id);

            $body.unbind('keyup.productgallery.fullscreen.' + this.options.id);

            this.$gallery.find('*').off();

            this.$gallery.removeClass('initialized');
        }

        connectedCallback() {
            if(!window.isDesignMode) return;
            theme.LazyImage.update();
        }

        disconnectedCallback() {
            this.destroy();
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('product-gallery', ProductGallery);
    });

    class DeliveryCountdown extends HTMLElement {
        constructor() {
            super();
    
            this.daysOfWeek = [
                theme.strings.delivery_countdown.days_of_week.sunday,
                theme.strings.delivery_countdown.days_of_week.monday,
                theme.strings.delivery_countdown.days_of_week.tuesday,
                theme.strings.delivery_countdown.days_of_week.wednesday,
                theme.strings.delivery_countdown.days_of_week.thursday,
                theme.strings.delivery_countdown.days_of_week.friday,
                theme.strings.delivery_countdown.days_of_week.saturday
            ];
    
            setTimeout(() => {
                this.elementCounter = this.querySelector('[data-js-delivery-countdown-counter]');
                this.elementDelivery = this.querySelector('[data-js-delivery-countdown-delivery]');
    
                this.deliveryTime = +this.dataset.deliveryTime;
                this.resetTime = +this.dataset.resetTime;
                this.deliveryFormat = this.dataset.deliveryFormat;
                this.excludes = this.dataset.deliveryExcludes.replace(/ /gi, '').toLowerCase().split(',');
    
                this.start();
            }, 0);
        }
    
        start() {
            this.display();
            this.interval = setInterval(() => this.display(), 1000);
        }
    
        display() {
            this.render(this.getRemainingTime());
        }
    
        getTotal() {
            return Date.parse(this.finalDate) - Date.parse(new Date());
        }
    
        getRemainingTime() {
            const now = new Date();
    
            this.finalDate = new Date();
            this.finalDate.setDate(this.finalDate.getDate() + 1);
            this.finalDate.setHours(this.resetTime, 0, 0, 0);

            const counterTotal = this.getTotal();
            const counterMinutes = Math.floor((counterTotal / 1000 / 60) % 60);
            const counterHours = Math.floor((counterTotal / (1000 * 60 * 60)) % 24);
    
            let finalyDeliveryTime = this.deliveryTime;
            let startExcludesDate = 0;
    
            if (now.getHours() >= this.finalDate.getHours() && now.getMinutes() >= this.finalDate.getMinutes() && now.getSeconds() >= this.finalDate.getSeconds()) {
                finalyDeliveryTime++;
                startExcludesDate++;
            }
            
            const deliveryDate = now;
            
            let endExcludesDate = this.deliveryTime + startExcludesDate + 1;
            
            for (let i = startExcludesDate; i < endExcludesDate; i++) {
                let currentDate = new Date();
    
                currentDate.setDate(currentDate.getDate() + i);
    
                if (this.excludes.indexOf(this.daysOfWeek[currentDate.getDay()].toLowerCase()) !== -1) {
                    deliveryDate.setDate(deliveryDate.getDate() + 1);
                    endExcludesDate++;
                }
            }
             
            deliveryDate.setDate(deliveryDate.getDate() + finalyDeliveryTime);
    
            return {
                counter: {
                    hours: counterHours,
                    minutes: counterMinutes
                },
                delivery: deliveryDate
            };
        }
    
        render(data) {
            const {counter, delivery} = data;
            let counterHTML = '';
    
            if(counter.hours) {
                counterHTML += `${counter.hours} ${theme.strings.delivery_countdown.hours.toLowerCase()} `;
            }
    
            counterHTML += `${counter.minutes} ${theme.strings.delivery_countdown.minutes.toLowerCase()}`;
            this.elementCounter.innerHTML = counterHTML;
            this.elementDelivery.innerHTML = this.deliveryFormat.toLowerCase()
                .replace('day', this.daysOfWeek[delivery.getDay()])
                .replace('dd', ('0' + delivery.getDate()).slice(-2))
                .replace('mm', ('0' + (delivery.getMonth() + 1)).slice(-2))
                .replace('yyyy', delivery.getFullYear())
                .replace('yy', delivery.getFullYear().toString().slice(-2));
        }
    
        disconnectedCallback() {
            if(this.inrerval) clearInterval(this.inrerval);
        }
    }
    
    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('delivery-countdown', DeliveryCountdown);
    });

    
    class VisitorsCounter extends HTMLElement {
        constructor() {
            super();
            this.load();
        }

        load() {
            this.counter = this.querySelector('[data-js-counter]');
            this.valueMin = this.dataset.min;
            this.valueMax = this.dataset.max;
            this.intervalMin = this.dataset.intervalMin;
            this.intervalMax = this.dataset.intervalMax;
            this.stroke = this.dataset.stroke;

            this.interval = setInterval(() => {
                this.update();
            }, this.randomInteger(this.intervalMin, this.intervalMax) * 1000);
        }

        update() {
            this.getNewValue();
            this.render();
        }

        render() {
            this.counter.innerHTML = this.currentValue;
        }

        getNewValue() {
            const currentValue = this.counter.text;
            const newValue = this.randomInteger(this.valueMin, this.valueMax);

            if(Math.abs(currentValue - newValue) > this.stroke) {
                newValue = newValue > currentValue ? currentValue + this.stroke : currentValue - this.stroke;
                newValue = this.randomInteger(currentValue, newValue);
            }

            this.currentValue = newValue;
        }

        randomInteger(min, max) {
            return Math.round(min - 0.5 + Math.random() * (max - min + 1));
        }

        disconnectedCallback() {
            clearInterval(this.interval);
        }
    }
    
    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('visitors-counter', VisitorsCounter);
    });
    

    class SingleProduct extends HTMLElement {
        constructor() {
            super();
            
            setTimeout(() => {
                this.update();
            }, 0);
        }

        update() {
            if(theme.isLoaded) {
                theme.StoreLists.checkProductStatus(this);
            }
            theme.dynamicCheckout.load(this);
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('single-product', SingleProduct);
    });
})(jQueryTheme);