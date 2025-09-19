(function($){

    'use strict';

    function ContentBuilder() {
        this.selectors = {
            elem: '.js-content-builder',
            button: '[data-js-content-builder-copy]',
            textarea: '[data-js-content-builder-textarea]'
        };

        this.attrs = {
            textarea_name: 'data-textarea-name'
        };

        this.load();
    };

    ContentBuilder.prototype = $.extend({}, ContentBuilder.prototype, {
        load: function() {
            var _ = this;

            $body.on('click', this.selectors.button, function () {
                var $this = $(this),
                    name = $this.attr(_.attrs.textarea_name),
                    $textarea = $this.parents(_.selectors.elem).find(_.selectors.textarea + '[name="' + name + '"]');

                _.copyContent($textarea);
            });
        },
        copyContent: function ($textarea, callback) {
            if (!navigator.clipboard) {
                $textarea.focus();
                $textarea.select();

                try {
                    console.log('Fallback: Copying text command was ' + document.execCommand('copy') ? 'successful' : 'unsuccessful');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }

                $textarea.blur();

                if(callback) {
                    callback();
                }
            } else {
                navigator.clipboard.writeText($textarea.text()).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                });
            }
        }
    });
})(jQueryTheme);