(function($){

    'use strict';

    class LookBook extends HTMLElement {
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

            var $items = this.$container.find('.lookbook__item'),
				$header = $('.header');

			function checkProductPosition($product) {
				var $btn = $product.parents('[data-lookbook-picker]').find('[data-lookbook-picker-button]'),
					$sticky_header = $('.header__content--sticky'),
					$top_spacer = $sticky_header.length ? $sticky_header : $header;

				if($btn[0].getBoundingClientRect().top - $product.innerHeight() - 10 > $top_spacer[0].getBoundingClientRect().bottom) {
					$product.addClass('bottom-0').removeClass('top-0');
				} else {
					$product.removeClass('bottom-0').addClass('top-0');
				}
			};

			theme.Global.responsiveHandler({
				namespace: '.lookbook',
				element: $items,
				delegate: '[data-lookbook-picker-button]',
				on_desktop: true,
				events: {
					'click': function() {
						var $this = $(this),
							$product = $this.parents('[data-lookbook-picker]').find('[data-lookbook-product]');

						$this[$this.hasClass('open') ? 'removeClass' : 'addClass']('open');
						$product[$this.hasClass('open') ? 'removeClass' : 'addClass']('d-none');

						if($this.hasClass('open')) {
							checkProductPosition($product);
						}
					}
				}
			});

			theme.Global.responsiveHandler({
				namespace: '.lookbook',
				element: $items,
				delegate: '[data-lookbook-picker]',
				on_desktop: true,
				events: {
					'mouseenter mouseleave': function(e) {
						var $this = $(this),
							$btn = $this.find('[data-lookbook-product-button]'),
							$product = $this.find('[data-lookbook-product]');

						if(!$btn.hasClass('open')) {
							$product[e.type === 'mouseenter' ? 'removeClass' : 'addClass']('d-none');

							if(e.type === 'mouseenter') {
								checkProductPosition($product);
							}
						}
					}
				}
			});

			theme.Global.responsiveHandler({
				namespace: '.lookbook',
				element: $items,
				delegate: '[data-lookbook-product-close]',
				on_desktop: true,
				events: {
					'click': function() {
						$(this).parents('[data-lookbook-picker]').find('[data-lookbook-picker-button]').addClass('open').trigger('click');
					}
				}
			});

			if($items.length && theme.isLoaded) {
				theme.LazyImage.update();
			}
        }

        disconnectedCallback() {
            this.$container.find('.lookbook__item').unbind();
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('lookbook-section', LookBook);
    });
})(jQueryTheme);