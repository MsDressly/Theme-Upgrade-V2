(function($){

    'use strict';

    class SortingCollections extends HTMLElement {
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

            var $control = this.$container.find('[data-sorting-collections-control]'),
                $collections = this.$container.find('[data-sorting-collections-ajax] [data-collection]'),
                $products = this.$container.find('[data-sorting-collections-items]'),
                $button_more = this.$container.find('[data-sorting-collections-more]'),
                xhr = null;

            this.$control = $control;

            function loadProducts($button, preloader, callback) {
                if(xhr) {
                    xhr.abort();
                }

                if(preloader) {
                    theme.Preloader.set($products);
                }

                var collection = $button.attr('data-collection'),
                    count_limit = $products.attr('data-limit'),
                    grid_classes = $products.attr('data-grid');

                xhr = $.ajax({
                    type: 'GET',
                    url: theme.routes.root_url + 'collections/' + collection,
                    cache: false,
                    data: {
                        view: 'sorting',
                        count_limit: count_limit,
                        grid_classes: encodeURIComponent(grid_classes)
                    },
                    dataType: 'html',
                    success: function (data) {
                        var $children;

                        $products.html(data);

                        if($products[0].hasAttribute('data-is-design-mode')) {
                            $children = $products.children();

                            $children.addClass(grid_classes);

                            if($children.length > count_limit) {
                                for(var i = count_limit; i < $children.length; i++) {
                                    $children.eq(i).remove();
                                }
                            }
                        }

                        theme.LazyImage.update();
                        if(theme.MultiCurrency) {
                            theme.MultiCurrency.update();
                        }
                        $control.find('a').removeClass('active');
                        $button.addClass('active');

                        if($button_more) {
                            $button_more.text(theme.strings.homepage.sorting_collections.button_more_products.replace('{{ collection }}', $button.text())).attr('href', $button.attr('href'));
                        }

                        if(preloader) {
                            theme.Preloader.unset($products);
                        }

                        xhr = null;

                        if(callback) {
                            callback();
                        }
                    }
                });
            };

            if($collections.length) {
                loadProducts($collections.first(), false, function () {
                    if($button_more.length) {
                        $button_more.removeClass('invisible');
                    }
                });
            }

            $control.on('click', 'a', function (e) {
                var $this = $(this);

                if(!$this.hasClass('active')) {
                    loadProducts($this, true);
                }

                e.preventDefault();
                return false;
            });
        }

        disconnectedCallback() {
            this.$control.off();
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('sorting-collections', SortingCollections);
    });
})(jQueryTheme);