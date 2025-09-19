(function($){

    'use strict';

    function PopupAgeConfirmation() {
        this.settings = {
            popup_name: 'age-confirmation'
        };

        this.selectors = {
            popup: '.popup-age-confirmation'
        };

        this.load();
    };

    PopupAgeConfirmation.prototype = $.extend({}, PopupAgeConfirmation.prototype, {
        load: function() {
            var $popup = theme.Popups.getByName(this.settings.popup_name);

            if($popup.length) {
                var cookie = theme.Cookie.get('age-confirmation'),
                    $age_confirmation,
                    $checkbox,
                    $close;

                function addCookie() {
                    var date = new Date(),
                        timer = 24 * 60 * 60 * 1000 * 365;

                    date.setTime(date.getTime() + timer);

                    theme.Cookie.set('age-confirmation', 'off', {
                        expires: date
                    });
                };

                if(cookie !== 'off') {
                    $body.addClass('hide-page-content');

                    $age_confirmation = $(this.selectors.popup);
                    $checkbox = $age_confirmation.find('[data-js-popup-age-confirmation-checkbox]');
                    $close = $age_confirmation.find('[data-js-popup-close]');

                    $popup.on('click', '[data-js-popup-age-confirmation-close-website]', function () {
                        history.back();
                    });

                    $checkbox.on('change', function () {
                        $close[$(this).is(':checked') ? 'removeClass' : 'addClass']('pointer-events-none');
                    });

                    theme.Popups.addHandler(this.settings.popup_name, 'close.before', function() {
                        $body.removeClass('hide-page-content');
                    });

                    theme.Popups.addHandler(this.settings.popup_name, 'close.after', function() {
                        addCookie();
                    });

                    theme.Popups.callByName('age-confirmation');
                }
            }
        }
    });
    
    theme.AssetsLoader.onPageLoaded(function() {
        theme.PopupAgeConfirmation = new PopupAgeConfirmation;
    });
})(jQueryTheme);