(function($){

  'use strict';

  theme.AssetsLoader.onPageLoaded(function() {
    var config = {
      qrCode: '#QrCode',
      printButton: '#PrintGiftCard',
      giftCardCode: '.giftcard__code'
    },
    $qrCode = $(config.qrCode);

    new QRCode($qrCode[0], {
      text: $qrCode.attr('data-identifier'),
      width: 120,
      height: 120
    });

    $(config.printButton).on('click', function() {
      window.print();
    });

    $(config.giftCardCode).on('click', {element: 'GiftCardDigits'}, selectText);

    function selectText(evt) {
      var text = document.getElementById(evt.data.element),
          range = '',
          selection;

      if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
      } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
})(jQueryTheme);