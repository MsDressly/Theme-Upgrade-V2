(function($){

    'use strict';

    function Notifications() {
        this.selectors = {
            elems: '.js-notification'
        };

        this.settings = {
            close_limit: 40,
            translate_limit: 50,
            opacity_limit: 0.4
        };

        this.load();
    };

    Notifications.prototype = $.extend({}, Notifications.prototype, {
        load: function() {
            var _ = this,
                dif;

            $body.on('mousedown', this.selectors.elems, function(e) {
                if(e.target.tagName === 'A' || $(e.target).parents('[data-js-action]').length) {
                    return;
                }

                _.is_holded = true;

                var $this = $(this),
                    start_posX = e.screenX;

                dif = 0;

                $this.addClass('animate');
                setTimeout(function () {
                    $this.addClass('pressed');
                }, 0);

                $body.on('mousemove.notification', function(e) {
                    var posX = e.screenX,
                        set_posX = Math.min(start_posX + _.settings.translate_limit, Math.max(start_posX - _.settings.translate_limit, posX));

                    dif = set_posX - start_posX;

                    $this.removeClass('animate');

                    setTimeout(function () {
                        $this.css({
                            transform: 'translateX(' + dif + 'px) scale(0.95)',
                            opacity: Math.max((_.settings.translate_limit - Math.abs(dif)) / _.settings.translate_limit, _.settings.opacity_limit)
                        });
                    }, 0);

                    setTimeout(function () {
                        $this.addClass('animate');
                    }, 0);
                });

                $body.one('mouseup.notification', function() {
                    $this.trigger('mouseup');
                });

                e.preventDefault();
                return false;
            });

            $body.on('mouseup', this.selectors.elems, function() {
                var $this = $(this);

                _.is_holded = false;
                
                $body.unbind('mousemove.notification mouseup.notification');

                setTimeout(function () {
                    if(Math.abs(dif) > _.settings.close_limit) {
                        var $notification = $this.find('[data-js-notification-inner]'),
                            $btn_close = $notification.find('[data-js-action="close"]').first();

                        if($notification.hasClass('d-none')) {
                            return;
                        }

                        $this.one('transitionend', function() {
                            dif = 0;

                            $this.trigger('mouseup').trigger('transitionend');

                            $btn_close.trigger('click');
                            // if(true) _._hide($notification);
                            $notification.trigger('transitionend');

                            $this.trigger('onpressedend');
                        });

                        $this.css({
                            transform: 'translateX(' + (dif + 20) + 'px) scale(0.95)',
                            opacity: 0
                        });
                    } else {
                        $this.removeClass('pressed');

                        $this.one('transitionend' ,function () {
                            $this.removeClass('animate');
                            $this.trigger('onpressedend');
                        });

                        $this.css({
                            transform: '',
                            opacity: ''
                        });
                    }

                    if($this.css('transition-duration') === '0s') {
                        $this.trigger('transitionend');
                    }
                }, 0);
            });

            $body.on('close', this.selectors.elems, function() {
                var $this = $(this);

                $body.unbind('mousemove.notification');
                $this.trigger('mouseup').trigger('transitionend');
            });

            this._products();
            this._cookies();
        },
        _cookies: function() {
            var _ = this,
                $notification = $('.js-notification-cookies'),
                $btn_close,
                cookie,
                show_once,
                delay,
                cookies_life;

            function closeNotificationEvent() {
                $btn_close.one('click', function() {
                    if(show_once === 'true') {
                        var date = new Date(),
                            timer = 24 * 60 * 60 * 1000 * cookies_life;

                        date.setTime(date.getTime() + timer);

                        theme.Cookie.set('notification-cookies', 'off', {
                            expires: date
                        });
                    }

                    _._hide($notification, function () {
                        $notification.remove();
                    });

                    $(this).off();
                });
            };

            if($notification.length) {
                $btn_close = $notification.find('[data-js-action="close"]');
                cookie = theme.Cookie.get('notification-cookies');
                show_once = $notification.attr('data-js-show-once');
                delay = +$notification.attr('data-js-delay');
                cookies_life = +$notification.attr('data-js-cookies-life');

                if(cookie !== 'off') {
                    if(delay > 0) {
                        setTimeout(function () {
                            _._show($notification, function () {
                                closeNotificationEvent();
                            });
                        }, delay * 1000);
                    } else {
                        closeNotificationEvent();
                    }
                }

                return $btn_close;
            }
        },
        _products: function() {
            var _ = this,
                $notification = $('.js-notification-products');

            if(!$notification.length) {
                return;
            }

            var $btns_close = $notification.find('[data-js-action="close"]'),
                $items = $notification.find('[data-js-notification-products-item]'),
                delay = +$notification.attr('data-js-delay'),
                interval_min = +$notification.attr('data-js-interval-min'),
                interval_max = +$notification.attr('data-js-interval-max'),
                max_time_life = +$notification.attr('data-js-max-time-life'),
                $current_item,
                interval_random,
                max_time_life_interval,
                autoplay_timeout;

            function randomInteger(min, max) {
                return Math.round(min - 0.5 + Math.random() * (max - min + 1));
            };

            function hide() {
                _._hide($notification, function () {
                    autoplay();
                });
            };

            function autoplay() {
                clearInterval(max_time_life_interval);
                if(!$notification.hasClass('d-none') || _.is_holded) {
                    if(_.is_holded) {
                        $notification.parents('.js-notification').one('onpressedend', function() {
                            hide();
                        });
                    } else if($notification.is(':hover')) {
                        $notification.one('mouseleave', function() {
                            hide();
                        });
                    } else {
                        hide();
                    }
                } else {
                    $current_item = $items.eq(randomInteger(0, $items.length - 1));
                    interval_random = randomInteger(interval_min, interval_max);

                    $items.addClass('d-none');
                    $current_item.removeClass('d-none');

                    _._show($notification, function () {
                        autoplay_timeout = setTimeout(function () {
                            autoplay();
                        }, interval_random * 1000);

                        if(max_time_life !== 0) {
                            max_time_life_interval = setTimeout(function () {
                                _._hide($notification);
                            }, max_time_life * 1000);
                        }
                    }, function(onVisible) {
                        onVisible();
                    });
                }
            };

            setTimeout(function () {
                autoplay();
            }, delay * 1000);

            $btns_close.on('click', function() {
                clearTimeout(autoplay_timeout);

                _._hide($notification);
            });

            return $btns_close;
        },
        _show: function ($notification, callback, beforeShow) {
            $notification.unbind('transitionend');

            if(callback) {
                $notification.one('transitionend', function () {
                    callback();
                });
            }

            $notification.removeClass('d-none');
            $notification.addClass('animate');

            function onVisible() {
                setTimeout(function () {
                    $notification.addClass('visible');
                }, 0);

                if($notification.css('transition-duration') === '0s') {
                    $notification.trigger('transitionend');
                }
            };

            if(beforeShow) {
                beforeShow(onVisible);
            } else {
                onVisible();
            }
        },
        _hide: function ($notification, callback) {
            $notification.unbind('transitionend');

            $notification.one('transitionend', function () {
                $notification.addClass('d-none').removeClass('animate').removeAttr('style');

                $notification.parents('.js-notification').trigger('close');

                if(callback) {
                    callback();
                }
            });

            $notification.removeClass('visible');

            if($notification.css('transition-duration') === '0s') {
                $notification.trigger('transitionend');
            }
        },
        destroy: function () {
            $('.js-notification-cookies, .js-notification-products').find('[data-js-action="close"]').off();
        }
    });
    
    theme.AssetsLoader.onPageLoaded(function() {
        theme.Notifications = new Notifications;
    });
})(jQueryTheme);