(function($){

    'use strict';

    function PopupSubscriptionСonfirmation() {
        this.settings = {
            popup_subscription_name: 'subscription-confirmation',
            popup_contact_name: 'contact-confirmation'
        };

        this.load();
    };
    
    PopupSubscriptionСonfirmation.prototype = $.extend({}, PopupSubscriptionСonfirmation.prototype, {
        load: function() {
            var $error = $('.js-subscription-confirmation-error'),
                $error_contact = $('[data-js-popup-name="message"] .note--error'),
                $popup,
                cookies_life = 10;

            function addCookie() {
                var date = new Date(),
                    timer = 24 * 60 * 60 * 1000 * cookies_life;

                date.setTime(date.getTime() + timer);

                theme.Cookie.set('subscription', 'off', {
                    expires: date
                });
            };
            
            if(window.location.href.indexOf('customer_posted=true') !== -1 || window.location.href.indexOf('contact%5Btags%5D=newsletter&form_type=customer') !== -1) {
                addCookie();

                theme.Popups.callByName(this.settings.popup_subscription_name);

                theme.Popups.addHandler(this.settings.popup_subscription_name, 'close.after', function () {
                    var newurl = window.location.href.replace('?customer_posted=true', '').replace('customer_posted=true', '');

                    window.history.replaceState({path: newurl}, '', newurl);
                });
            } else if(window.location.href.indexOf('contact_posted=true') !== -1) {
                addCookie();

                theme.Popups.callByName(this.settings.popup_contact_name);

                theme.Popups.addHandler(this.settings.popup_contact_name, 'close.after', function () {
                    var newurl = window.location.href.replace('?contact_posted=true', '').replace('contact_posted=true', '');

                    window.history.replaceState({path: newurl}, '', newurl);
                });
            } else if($error.length) {
                $popup = theme.Popups.getByName(this.settings.popup_subscription_name);
                
                $popup.find('[data-popup-confirmation-success]').addClass('d-none');
                $popup.find('[data-popup-confirmation-error-message]').html($error.first().html());
                $popup.find('[data-popup-confirmation-error]').removeClass('d-none');

                theme.Popups.callByName(this.settings.popup_subscription_name);
            } else if($error_contact.length) {
                $popup = theme.Popups.getByName(this.settings.popup_contact_name);

                $popup.find('[data-popup-confirmation-success]').addClass('d-none');
                $popup.find('[data-popup-confirmation-error-message]').html($error_contact.first().html());
                $popup.find('[data-popup-confirmation-error]').removeClass('d-none');

                theme.Popups.callByName(this.settings.popup_contact_name);
            } else if(window.location.href.indexOf('form_type=contact') !== -1 && window.location.href.indexOf('contact_posted=true') === -1 && window.location.href.indexOf('was_reloaded=true') !== -1) {
                window.location.href = window.location.href + '&was_reloaded=true';
                return;

                $popup = theme.Popups.getByName(this.settings.popup_contact_name);

                $popup.find('[data-popup-confirmation-success]').addClass('d-none');
                $popup.find('[data-popup-confirmation-error-message]').text(window.theme.strings.general.form.default.error);
                $popup.find('[data-popup-confirmation-error]').removeClass('d-none');

                theme.Popups.callByName(this.settings.popup_contact_name);
            }
        }
    });
    
    theme.AssetsLoader.onPageLoaded(function() {
        theme.PopupSubscriptionСonfirmation = new PopupSubscriptionСonfirmation;
    });
})(jQueryTheme);