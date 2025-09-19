(function($){

    'use strict';

    function PopupSubscription() {
        this.settings = {
            popup_name: 'subscription'
        };

        this.selectors = {
            popup: '.popup-subscription'
        };

        this.load();
    };

    PopupSubscription.prototype = $.extend({}, PopupSubscription.prototype, {
        load: function() {
            var $popup = theme.Popups.getByName(this.settings.popup_name);

            if($popup.length) {
                var $subscription = $(this.selectors.popup),
                    cookie = theme.Cookie.get('subscription'),
                    cookies_life = +$subscription.attr('data-js-cookies-life') || 1;

                function addCookie() {
                    var date = new Date(),
                        timer = 24 * 60 * 60 * 1000 * cookies_life;

                    date.setTime(date.getTime() + timer);

                    theme.Cookie.set('subscription', 'off', {
                        expires: date
                    });
                };

                if(window.location.href.indexOf('customer_posted=true') !== -1) {
                    addCookie();
                } else if($('.js-subscription-confirmation-error').length && $('[data-js-popup-name="subscription-confirmation"]').length) {
                    
                } else if(cookie !== 'off') {
                    var $dont_show = $subscription.find('[data-js-popup-subscription-dont-show]'),
                        show_once = $subscription.attr('data-js-show-once') || false,
                        delay = +$subscription.attr('data-js-delay') || 3;

                    theme.Popups.addHandler(this.settings.popup_name, 'close.after', function() {
                        if(show_once === 'true' || $dont_show.is(':checked')) {
                            addCookie();
                        }
                    });

                    setTimeout(function () {
                        theme.Popups.callByName('subscription');
                    }, delay * 1000);
                }

                $popup.on('click', '[data-js-popup-subscription-close-website]', function () {
                    history.back();
                });
            }
        }
    });
    
    theme.AssetsLoader.onPageLoaded(function() {
        theme.PopupSubscription = new PopupSubscription;
    });
})(jQueryTheme);