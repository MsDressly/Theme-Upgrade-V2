(function($){

    'use strict';

    theme.MenuBuilder = function ($menu, params) {
        function Menu($menu, params) {
            this.settings = {
                popup_name: 'navigation',
                button_navigation: 'data-js-popup-navigation-button'
            };
    
            this.selectors = {
                popup_navigation: '.js-popup-navigation'
            };
    
            this.params = {};
    
            this.init($menu, params);
        };
    
        Menu.prototype = $.extend({}, Menu.prototype, {
            is_vertical: false,
            is_open_animate: false,
            mobile_level: 0,
            duration: function () {
                return window.theme.animations.menu.duration > 0.1 ? (window.theme.animations.menu.duration - 0.1) * 1000 : 0;
            },
            init: function($menu, params) {
                var _ = this,
                    $panel = $menu.find('.menu__panel'),
                    $megamenus = $panel.find('.menu__megamenu'),
                    $dropdowns = $panel.find('.menu__dropdown'),
                    $popup_navigation = $(this.selectors.popup_navigation),
                    $button_navigation = $popup_navigation.find('[' + this.settings.button_navigation + ']'),
                    $curtain = $menu.find('.menu__curtain');
    
                this.$menu = $menu;
                this.$panel = $panel;
                this.$megamenus = $megamenus;
                this.$dropdowns = $dropdowns;
                this.$curtain = $curtain;
    
                this.is_vertical = $menu.hasClass('menu--vertical');
                this.is_vertical_fixed = $menu[0].hasAttribute('data-js-menu-vertical-fixed');
    
                if(this.is_vertical) {
                    var $menu_vertical_btn = $('.js-menu-vertical-btn-toggle'),
                        $menu_vertical_spacer = $('.vertical-menu-spacer'),
                        $panel_items = $panel.find('> .menu__item'),
                        $btn_see_all = $menu.find('[data-js-menu-vertical-see-all]'),
                        pannel_y_offsets = parseInt($panel.css('padding-top')) + parseInt($panel.css('padding-bottom'));
    
                    this.$menu_vertical_btn = $menu_vertical_btn;
                    this.$menu_vertical_spacer = $menu_vertical_spacer;
                    this.$btn_see_all = $btn_see_all;
    
                    this.$megamenus_width = $('[data-js-megamenu-width]');
    
                    this.handlerMenu = theme.Global.responsiveHandler({
                        namespace: params.namespace,
                        element: $menu_vertical_btn,
                        on_desktop: true,
                        events: {
                            'click': function(e) {
                                var $this = $(this);
    
                                if($this.hasClass('menu-vertical-btn--fixed')) {
                                    return;
                                }
    
                                $this.toggleClass('menu-vertical-btn--open');
    
                                $menu[$this.hasClass('menu-vertical-btn--open') ? 'addClass' : 'removeClass']('menu--open');
                            }
                        }
                    });
    
                    this.handlerMenu = theme.Global.responsiveHandler({
                        namespace: params.namespace,
                        element: $body,
                        delegate: '[data-js-menu-vertical-see-all]',
                        on_desktop: true,
                        events: {
                            'click': function(e) {
                                $menu.toggleClass('menu--items-visible');
                            }
                        }
                    });
    
                    this.closeVerticalMenu = function () {
                        $menu_vertical_btn.removeClass('menu-vertical-btn--open');
                        $menu.removeClass('menu--open');
                    };
    
                    if(this.is_vertical_fixed) {
                        this.openVerticalMenu = function () {
                            $menu_vertical_btn.addClass('menu-vertical-btn--open');
                            $menu.addClass('menu--open');
                        };
    
                        this.fixVerticalMenu = function () {
                            $menu_vertical_btn.addClass('menu-vertical-btn--fixed');
                            $menu.addClass('menu--fixed');
                        };
    
                        this.unfixVerticalMenu = function () {
                            $menu_vertical_btn.removeClass('menu-vertical-btn--fixed');
                            $menu.removeClass('menu--fixed');
                        };
    
                        if($menu_vertical_spacer.length) {
                            this.checkHeightVerticalMenu = function () {
                                var height = $menu_vertical_spacer[0].getBoundingClientRect().bottom - $menu[0].getBoundingClientRect().top,
                                    btn_see_all_height = $btn_see_all.innerHeight(),
                                    all_items_height = 0,
                                    items_result_height = 0,
                                    has_hidden_items = false,
                                    inner_height;
    
                                $panel.innerHeight(Math.max(height, btn_see_all_height + pannel_y_offsets));
    
                                inner_height = height - pannel_y_offsets;
    
                                $panel_items.each(function () {
                                    all_items_height += $(this).innerHeight();
                                });
    
                                $panel_items.each(function () {
                                    var $this = $(this);
    
                                    items_result_height += $this.innerHeight();
    
                                    if(all_items_height < inner_height || items_result_height < inner_height - btn_see_all_height) {
                                        $this.attr('data-js-menu-vertical-item', null);
                                    } else {
                                        $this.attr('data-js-menu-vertical-item', 'hidden');
                                        has_hidden_items = true;
                                    }
                                });
    
                                $btn_see_all[has_hidden_items ? 'addClass' : 'removeClass']('menu__see-all--visible');
                            };
    
                            this.handlerMenu = theme.Global.responsiveHandler({
                                namespace: params.namespace,
                                element: $window,
                                on_desktop: true,
                                onbindtrigger: 'verticalmenu.checkheight',
                                events: {
                                    'load.verticalmenu scroll.verticalmenu theme.resize.verticalmenu verticalmenu.checkheight': function(e) {
                                        $menu.removeClass('menu--items-visible');
    
                                        if($menu_vertical_btn[0].getBoundingClientRect().bottom + pannel_y_offsets + $panel_items.first().innerHeight() + $btn_see_all.innerHeight() > $menu_vertical_spacer[0].getBoundingClientRect().bottom) {
                                            $panel.css({
                                                'height': ''
                                            });
                                            
                                            _.closeVerticalMenu();
                                            _.unfixVerticalMenu();
                                        } else {
                                            _.openVerticalMenu();
                                            _.fixVerticalMenu();
                                            _.checkHeightVerticalMenu();
                                        }
                                    }
                                }
                            });
                        } else {
                            this.handlerMenu = theme.Global.responsiveHandler({
                                namespace: params.namespace,
                                element: $window,
                                on_desktop: true,
                                events: {
                                    'load.verticalmenu scroll.verticalmenu theme.resize.verticalmenu verticalmenu.checkheight': function(e) {
                                        $menu.removeClass('menu--items-visible');
    
                                        if($menu.parents('.header__content--sticky').length) {
                                            _.closeVerticalMenu();
                                            _.unfixVerticalMenu();
                                        } else {
                                            _.openVerticalMenu();
                                            _.fixVerticalMenu();
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        this.handlerMenu = theme.Global.responsiveHandler({
                            namespace: params.namespace,
                            element: $window,
                            on_desktop: true,
                            events: {
                                'load.verticalmenu scroll.verticalmenu theme.resize.verticalmenu verticalmenu.checkheight': function(e) {
                                    $menu.removeClass('menu--items-visible');
    
                                    _.closeVerticalMenu();
                                }
                            }
                        });
                    }
                }
    
                if($panel.find('[data-js-menu-preview-image]').length) {
                    this.handlerMenu = theme.Global.responsiveHandler({
                        namespace: params.namespace,
                        element: $panel,
                        delegate: '.menu__item > a',
                        on_desktop: true,
                        events: {
                            'mouseenter': function() {
                                var $this = $(this),
                                    $preview = $this.find('[data-js-menu-preview-image]'),
                                    $image,
                                    $header,
                                    bounce;
    
                                if($preview.length) {
                                    $image = $preview.children().first();
                                    $header = $('.header__content--sticky');
    
                                    if(!$header.length) {
                                        $header = $('.header');
                                    }
    
                                    bounce = $window.innerHeight() - $image[0].getBoundingClientRect().bottom;
    
                                    if(bounce < 0) {
                                        bounce *= -1;
    
                                        if($header.length) {
                                            bounce = Math.min(bounce + 20, $this[0].getBoundingClientRect().bottom - $header[0].getBoundingClientRect().bottom - 20);
                                        }
    
                                        $image.css({ 'margin-top': bounce * -1 });
                                    }
                                }
                            },
                            'mouseleave': function() {
                                var $this = $(this),
                                    $preview = $this.find('[data-js-menu-preview-image]'),
                                    $image;
    
                                if($preview.length) {
                                    $image = $preview.children().first();
    
                                    $preview.one('transitionend', function () {
                                        $image.removeAttr('style');
                                    });
    
                                    if($preview.css('transition-duration') === '0s') {
                                        $preview.trigger('transitionend');
                                    }
                                }
                            }
                        }
                    });
                }
    
                function checkScroll($list) {
                    $menu[$list.height() > $menu.height() ? 'addClass' : 'removeClass']('menu--scroll-visible');
    
                    $menu.unbind('scroll');
    
                    $menu.one('scroll', function () {
                        $menu.removeClass('menu--scroll-visible');
                    });
                };
    
                function checkMinHeight($list) {
                    var $popup_content = $panel.parents('[data-popup-content]'),
                        min_height;
    
                    $panel.css({
                        'min-height': ''
                    });
    
                    min_height = $list.innerHeight();
    
                    $panel.css({
                        'min-height': Math.ceil(min_height)
                    });
    
                    $popup_content.css({
                        'overflow': 'hidden'
                    });
    
                    setTimeout(function() {
                        $popup_content.removeAttr('style');
                    }, 100);
                };
    
                this.handlerMenu = theme.Global.responsiveHandler({
                    namespace: params.namespace,
                    element: $menu,
                    delegate: 'a',
                    on_mobile: true,
                    events: {
                        'click': function(e) {
                            var $this = $(this),
                                $item = $this.parent(),
                                $list = $item.find('.menu__list').first(),
                                level;
    
                            $panel.unbind('transitionend');
    
                            if($list.length) {
                                if ($item.parents('.menu__level-03').length) {
                                    level = 4;
                                } else if ($item.parents('.menu__level-02').length) {
                                    level = 3;
                                } else {
                                    level = 2;
                                }
    
                                $menu.scrollTop(0);
    
                                $item.addClass('open');
    
                                $list.addClass('show');
    
                                $panel.attr('data-mobile-level', level);
    
                                checkMinHeight($list);
    
                                checkScroll($list);
    
                                $button_navigation.attr(_.settings.button_navigation, 'back');
    
                                _.mobile_level = level;
    
                                e.preventDefault();
                                return false;
                            }
                        }
                    }
                });
    
                this.handlerBack = theme.Global.responsiveHandler({
                    namespace: params.namespace,
                    element: $popup_navigation,
                    delegate: '[' + this.settings.button_navigation + '="back"]',
                    on_mobile: true,
                    events: {
                        'click': function() {
                            var level = $panel.attr('data-mobile-level') - 1,
                                button_status = level > 1 ? 'back' : 'close',
                                $item = $menu.find('.menu__item.open').last(),
                                $list = $item.find('.menu__list').first();
    
                            $menu.scrollTop(0);
    
                            _.mobile_level = level;
    
                            if(_.is_vertical && theme.Menu) {
                                if(theme.Menu.mobile_level > 1) {
                                    button_status = 'back';
                                }
                            } else if(!_.is_vertical && theme.VerticalMenu) {
                                if(theme.VerticalMenu.mobile_level > 1) {
                                    button_status = 'back';
                                }
                            }
    
                            $item.removeClass('open');
    
                            $panel.one('transitionend', function () {
                                $list.removeClass('show');
                            });
    
                            $panel.attr('data-mobile-level', level);
    
                            checkMinHeight($item.parents('.menu__list').first());
    
                            checkScroll($list.parents('.menu__list').first());
    
                            $button_navigation.attr(_.settings.button_navigation, button_status);
    
                            if($panel.css('transition-duration') === '0s') {
                                $panel.trigger('transitionend');
                            }
                        }
                    }
                });
    
                theme.Popups.addHandler(this.settings.popup_name, 'close.before.closeMobileMenu', function() {
                    if(theme.current.is_mobile) {
                        _.closeMobileMenu();
    
                        $button_navigation.attr(_.settings.button_navigation, 'close');
                    }
                });
    
                this.handlerDropdown = theme.Global.responsiveHandler({
                    namespace: params.namespace,
                    element: $panel,
                    delegate: '> .menu__item',
                    on_desktop: true,
                    events: {
                        'mouseenter mouseleave': function(e) {
                            if(theme.SearchAjax) {
                                theme.SearchAjax.closeAll();
                            }
    
                            _._toggleMegamenu($(this), e);
                        }
                    }
                });
    
                this.handlerDropdown = theme.Global.responsiveHandler({
                    namespace: params.namespace,
                    element: $panel,
                    delegate: '> .menu__item > a',
                    on_desktop: true,
                    events: {
                        'touchstart': function(e) {
                            $body.unbind('touchstart.menu-item');
    
                            var $item = $(this).parent(),
                                $megamenuOrDropdown = $item.find('.menu__megamenu, .menu__dropdown');
    
                            if($megamenuOrDropdown.length) {
                                if(!$megamenuOrDropdown.hasClass('show')) {
                                    $item.trigger('mouseenter');
    
                                    $body.one('touchstart.menu-item', function (e) {
                                        if(!$.contains($megamenuOrDropdown[0], e.target)) {
                                            $item.trigger('mouseleave');
                                        }
                                    });
                                } else {
                                    location.href = $item.find('> a').attr('href');
                                }
    
                                e.preventDefault;
                                return false;
                            } else {
                                var $openedMenu = $panel.find('.menu__megamenu, .menu__dropdown').filter('.show')
    
                                if($openedMenu.length) {
                                    $openedMenu.first().parents('.menu__item').find('> a').trigger('mouseleave');
    
                                    setTimeout(function() {
                                        location.href = $item.find('> a').attr('href');
                                    }, (window.theme.animations.menu.duration > 0.1 ? (window.theme.animations.menu.duration - 0.1) * 1000 : 0));
    
                                    e.preventDefault;
                                    return false;
                                }
                            }
                        }
                    }
                });
    
                $window.on('theme.changed.breakpoint' + params.namespace, function () {
                    if(theme.current.is_desktop) {
                        _.closeMobileMenu(true);
    
                        $button_navigation.attr(_.settings.button_navigation, 'close');
                    }
                });
    
                $menu.addClass('menu--loaded');
    
                return {
                    destroy: function() {
                        theme.Popups.removeHandler(_.settings.popup_name, 'close.before.closeMobileMenu');
                        _.handlerMenu.unbind();
                        _.handlerBack.unbind();
                        _.handlerDropdown.unbind();
                    }
                }
            },
            _toggleMegamenu: function ($item, e) {
                var _ = this,
                    $megamenu = $item.find('.menu__megamenu'),
                    $dropdown = $item.find('.menu__dropdown'),
                    $holder = $item.find('.menu__holder'),
                    width_limit;
    
                if(e.type === 'mouseenter') {
                    if($megamenu.length) {
                        this.is_open_animate = true;
    
                        $holder.removeClass('d-none').css({
                            height: this.$panel[0].getBoundingClientRect().bottom - $item[0].getBoundingClientRect().bottom + 'px'
                        });
    
                        $megamenu.stop();
                        this.$dropdowns.finish();
    
                        if(this.is_vertical) {
                            width_limit = $megamenu.attr('data-js-width-limit');
    
                            width_limit = width_limit ? +width_limit : Infinity;
    
                            $megamenu.add(this.$curtain).css({
                                'width': Math.ceil(Math.min(width_limit, this.$megamenus_width.innerWidth())) + 1
                            });
    
                            if(!this.$megamenus.filter('.show').length) {
                                this.$curtain.add($megamenu).css({
                                    'height': Math.ceil($menu.innerHeight())
                                });
                            }
                        }
    
                        this.$megamenus.not($megamenu).removeClass('show animate visible').removeAttr('style');
                        this.$dropdowns.removeClass('show animate visible').removeAttr('style');
    
                        $megamenu.addClass('show overflow-hidden');
    
                        var max_height = theme.current.height - $megamenu[0].getBoundingClientRect().top,
                            /*height = Math.min($megamenu.children().innerHeight(), max_height);*/
                            height = $megamenu.children().innerHeight();
    
                        if(this.is_vertical) {
                            height = Math.max($menu.innerHeight(), height);
                        }
    
                        /*$megamenu.css({
                            'max-height': Math.ceil(max_height)
                        });*/
    
                        this.$curtain.animate({
                            height: height,
                            // tween: [height, this.$curtain.height()]
                        }, {
                            duration: this.duration(),
                            start: function () {
                                _.$curtain.addClass('show');
                                $megamenu.addClass('animate visible');
                            },
                            step: function (value) {
                                $megamenu.height(value);
                            },
                            complete: function () {
                                $megamenu.removeClass('overflow-hidden').css({
                                    'max-height': ''
                                });
    
                                _.is_open_animate = false;
                            }
                        });
                    } else if($dropdown.length) {
                        if($(e.target).parents('.menu__dropdown').length) {
                            return;
                        }
    
                        $dropdown.addClass('show');
    
                        $dropdown.stop();
                        this.$megamenus.finish();
    
                        this.$dropdowns.not($dropdown).removeClass('show animate visible').removeAttr('style');
                        this.$megamenus.removeClass('show animate visible').removeAttr('style');
    
                        $dropdown.hide().slideDown({
                            duration: this.duration(),
                            start: function () {
                                setTimeout(function () {
                                    $dropdown.addClass('animate visible');
                                }, 0);
                            },
                            complete: function () {
                                $dropdown.removeAttr('style');
                            }
                        });
                    }
                } else if(e.type === 'mouseleave') {
                    if($megamenu.length && $megamenu.hasClass('show')) {
                        this.$curtain.stop();
    
                        $holder.addClass('d-none').removeAttr('style');
    
                        $megamenu.height(_.$curtain.height()).animate({
                            height: 0,
                            // tween: [0, $megamenu.height()]
                        }, {
                            duration: this.duration(),
                            start: function () {
                                $megamenu.addClass('overflow-hidden').removeClass('visible');
                            },
                            step: function (value) {
                                _.$curtain.height(value);
                            },
                            complete: function () {
                                $megamenu.removeClass('show animate overflow-hidden').removeAttr('style');
    
                                if(!_.is_open_animate) {
                                    _.$curtain.removeClass('show').removeAttr('style');
                                }
                            }
                        });
                    } else if($dropdown.length) {
                        $dropdown.slideUp({
                            duration: this.duration(),
                            start: function () {
                                $dropdown.removeClass('visible');
                            },
                            complete: function () {
                                $dropdown.removeClass('show animate').removeAttr('style');
                            }
                        });
                    }
                }
            },
            closeMobileMenu: function(manually) {
                if(theme.current.is_mobile || manually) {
                    var $panel = this.$menu.find('.menu__panel');
    
                    $panel.find('.menu__item').removeClass('open');
    
                    $panel.one('transitionend', function () {
                        $panel.find('.menu__list').removeClass('show');
                    });
    
                    $panel.attr('data-mobile-level', '1');
    
                    if($panel.css('transition-duration') === '0s') {
                        $panel.trigger('transitionend');
                    }
    
                    this.$menu.scrollTop(0);
    
                    this.mobile_level = 0;
                }
            }
        });
    
        var api = new Menu($menu, params);
    
        return api;
    };

    const selectors = {
        menu: '.js-menu',
        vertical_menu: '.js-vertical-menu'
    };

    class HeaderSection extends HTMLElement {
        constructor() {
            super();
            this.load();
        }

        load() {
            this.$container = $(this);
            this.namespace = '.header';

            if(theme.isLoaded) {
                theme.Position.update('menu');
                theme.Position.update('currency');
            }

            theme.StoreLists.updateHeaderCount();

            this.widthLimitInit(this.$container, this.namespace);
            this.menuInit(this.namespace);
            this.tapeInit();
            this.currencyInit();
            this.languagesInit();
        }

        currencyInit() {
            this.$currencies_form = $('.js-currencies-form');

            this.$currencies_form.find('select').on('change', function() {
                $(this).parents('form').find('[name="country_code"]').val(this.value);
                $(this).parents('form').submit();
            });
        }

        currencyDestroy() {
            if(this.$currencies_form) {
                this.$currencies_form.off();
            }
        }

        tapeInit() {
            var $tape = this.$container.find('.js-header-tape'),
                duration = function () {
                    return theme.animations.header_tape.duration * 1000;
                };

            if(!$tape.length) return;

            var $btn_close = $tape.find('[data-js-action="close"]'),
                cookie = theme.Cookie.get('header-tape'),
                show_once = $tape.attr('data-js-show-once'),
                delay = +$tape.attr('data-js-delay'),
                cookies_life = +$tape.attr('data-js-cookies-life');

            if(cookie !== 'off') {
                if($tape.hasClass('d-none')) {
                    setTimeout(function () {
                        $tape.hide().removeClass('d-none');

                        $tape.slideDown({
                            duration: duration(),
                            complete: function () {
                                $tape.removeAttr('style');
                                $window.trigger('fullscreenimage.update');
                            }
                        });
                    }, delay * 1000);
                }
                
                $btn_close.on('click', function() {
                    if(show_once === 'true') {
                        var date = new Date(),
                            timer = 24 * 60 * 60 * 1000 * cookies_life;

                        date.setTime(date.getTime() + timer);

                        theme.Cookie.set('header-tape', 'off', {
                            expires: date
                        });
                    }

                    $(this).off();

                    $tape.slideUp({
                        duration: duration(),
                        complete: function () {
                            $tape.remove();
                        }
                    });
                });
            }

            this.tapeButtonClose = $btn_close;
        }

        menuInit(namespace) {
            var $menu = $(selectors.menu),
                $vertical_menu = $(selectors.vertical_menu);

            if($menu.length) {
                this.$menu = $menu.first();

                theme.Menu = new theme.MenuBuilder(this.$menu, {
                    namespace: namespace
                });
            }

            if($vertical_menu.length) {
                this.$vertical_menu = $vertical_menu.first();

                theme.VerticalMenu = new theme.MenuBuilder(this.$vertical_menu, {
                    namespace: namespace
                });
            }
        }

        menuDestroy() {
            if(this.api) {
                this.$menu.unbind('mouseenter');

                this.api.destroy();
                this.api = null;
            }

            if(this.vertical_api) {
                this.$vertical_menu.unbind('mouseenter');

                this.vertical_api.destroy();
                this.vertical_api = null;
            }

            if(this.handler) {
                this.handler.destroy();
            }
        }

        languagesInit() {
            var _ = this,
                $languages = $('.js-languages-list'),
                $weglot = $('.weglot-container').eq(0);

            if($languages.length && $weglot.length) {
                var $weglot_current = $weglot.find('.wgcurrent'),
                    $weglot_list = $weglot.find('ul'),
                    $header_current = $languages.find('.header__btn-language span'),
                    $header_list = $languages.find('ul');

                _.$header_list = $header_list;

                function insert() {
                    var current_html = $weglot_current.find('a').html(),
                        $span = $('<span>').html(current_html),
                        $li = $('<li>').addClass('active').attr('data-l', $weglot_current.attr('data-l')).append($span);

                    $header_current.html(current_html);

                    $header_list.html('').append($li);

                    $weglot_list.find('li').each(function() {
                        var $this = $(this),
                            $span = $('<span>').html($this.find('a').html()),
                            $li = $('<li>').attr('data-l', $this.attr('data-l')).append($span);

                        $header_list.append($li);
                    });
                };

                function update() {
                    var current_code = $weglot_current.attr('data-l'),
                        current_html = $weglot_current.find('a').html();

                    $header_current.html(current_html);

                    $header_list.find('li').removeClass('active').filter('[data-l="' + current_code + '"]').addClass('active');
                };

                if($languages.hasClass('js-weglot')) {
                    insert();
                }

                $languages.removeClass('d-none-important');

                const observer = new MutationObserver(() => update());

                observer.observe($weglot[0], { attributes: true, subtree: true });

                $header_list.on('click', 'li:not(.active)', function() {
                    var $this = $(this);

                    $weglot_list.find('li[data-l="' + $this.attr('data-l') + '"]').trigger('click');

                    $this.parents('[data-js-dropdown]').trigger('hide');
                });
            } else if($weglot.length) {
                $weglot.find('ul').addClass('list-unstyled');
                $weglot.addClass('show');
            }
        }

        languagesDestroy() {
            if(this.api) {
                this.api.destroy();
                this.api = null;
            }

            if(this.$header_list) {
                this.$header_list.off();
            }
        }

        widthLimitInit($container, namespace) {
            var $elems = $container.find('[data-js-header-width-limit]');

            if($elems.length) {
                this.handlerWidthLimit = theme.Global.responsiveHandler({
                    namespace: namespace,
                    element: $window,
                    on_desktop: true,
                    onbindtrigger: 'header.widthlimit',
                    events: {
                        'load.widthlimit theme.resize.widthlimit header.widthlimit': function(e) {
                            if(theme.current.is_desktop) {
                                $elems.each(function () {
                                    var $elem = $(this),
                                        elem_pos = $elem[0].getBoundingClientRect(),
                                        name = $elem.attr('data-js-header-width-limit'),
                                        margin = +$elem.attr('data-js-header-width-limit-margin') || 0,
                                        $edge = $container.find('[data-js-header-width-limit-edge="' + name + '"]').first(),
                                        edge_pos = $edge[0].getBoundingClientRect();

                                    if(theme.rtl) {
                                        $elem.css({
                                            'max-width': theme.current.width - theme.current.scrollW - (theme.current.width - theme.current.scrollW - elem_pos.right) - edge_pos.right - margin + 'px'
                                        });
                                    } else {
                                        $elem.css({
                                            'max-width': theme.current.width - theme.current.scrollW - elem_pos.left - (theme.current.width - theme.current.scrollW - edge_pos.left) - margin + 'px'
                                        });
                                    }

                                    $elem.removeClass('invisible-lg');
                                });
                            }
                        }
                    }
                });
            }
        }

        widthLimitDestroy() {
            if(this.handlerWidthLimit) {
                this.handlerWidthLimit.unbind();
            }
        }

        disconnectedCallback() {
            this.$container.off(this.namespace);
            this.widthLimitDestroy();
            this.menuDestroy();
            this.currencyDestroy();
            this.languagesInit();

            if(this.tapeButtonClose) this.tapeButtonClose.off();
        }
    }

    theme.AssetsLoader.onPageLoaded(function() {
        customElements.define('header-section', HeaderSection);
    });

    if (!customElements.get('localization-form')) {
        customElements.define(
          'localization-form',
          class LocalizationForm extends HTMLElement {
            constructor() {
              super();
              this.elements = {
                input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
                panel: this.querySelector('.disclosure__list-wrapper'),
              };
      
              this.querySelectorAll('a').forEach((item) => item.addEventListener('click', this.onItemClick.bind(this)));
            }
      
            onItemClick(event) {
              event.preventDefault();
              const form = this.querySelector('form');
              this.elements.input.value = event.currentTarget.dataset.value;
              if (form) form.submit();
            }
          }
        );
    }
})(jQueryTheme);