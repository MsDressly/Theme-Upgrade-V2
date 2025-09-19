(function($){

    'use strict';

    function ShippingRatesCalculation() {
        this.load();
    };

    ShippingRatesCalculation.prototype = $.extend({}, ShippingRatesCalculation.prototype, {
        load: function() {
            var $calculator = $('#shipping-calculator');

            if($calculator.length) {
                var $info = $('.shipping-calculator-info'),
                    replaces_texts = {
                        shipping_calculator_success_text: theme.strings.shipping_calculator_success_text,
                        shipping_calculator_do_not_ship_text: theme.strings.shipping_calculator_do_not_ship_text
                    };

                Shopify.Cart.ShippingCalculator.show({
                    submitButton: theme.strings.shippingCalcSubmitButton,
                    submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
                    customerIsLoggedIn: theme.strings.shippingCalcCustomerIsLoggedIn,
                    moneyFormat: theme.strings.shippingCalcMoneyFormat
                });

                $calculator.on('updated', function () {
                    setTimeout(function () {
                        var $result = $('#shipping-rates-feedback.success'),
                            html = $result.text(),
                            data = {
                                zip: $('#address_zip').val(),
                                province: $('#address_province').val(),
                                country: $('#address_country').val()
                            },
                            info = '';
                        
                        $result.html(html.replace('Rates start at', replaces_texts.shipping_calculator_success_text).replace('We do not ship to this destination.', replaces_texts.shipping_calculator_do_not_ship_text));

                        var $price = $('<span>').addClass('price'),
                            $money = $result.find('span');

                        $money.replaceWith($price);
                        $price.append($money);

                        if(theme.MultiCurrency) {
                            theme.MultiCurrency.update();
                        }

                        if($('#shipping-rates-feedback.success').length) {
                            $.each(data, function (i, v) {
                                if(v) {
                                    if(info) {
                                        info += ', ';
                                    }

                                    info += v;
                                }
                            });

                            $info.text(theme.strings.cart.general.shipping_calculator_data_info.replace('{{ data }}', info)).fadeIn({
                                complete: function () {
                                    $info.removeAttr('style');
                                }
                            }).removeClass('d-none');
                        } else {
                            $info.text('').addClass('d-none');
                        }
                    }, 100);
                });
            }
        }
    });
    
    theme.AssetsLoader.onPageLoaded(function() {
        theme.ShippingRatesCalculation = new ShippingRatesCalculation;
    });
})(jQueryTheme);