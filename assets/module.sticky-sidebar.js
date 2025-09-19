(function($){

    'use strict';

    function StickySidebar() {
        this.settings = {
            offset: 15,
            min_height_diff: 100
        };

        this.current = {
            scroll: 0
        };

        this.load();
    };

    StickySidebar.prototype = $.extend({}, StickySidebar.prototype, {
        load: function() {
            var _ = this,
                $popups = $('.js-popup'),
                $popup_quick_view = $popups.find('.popup-quick-view');

            this._getSidebars();
            
            theme.Global.responsiveHandler({
                namespace: '.sticky-sidebar',
                element: $window,
                on_desktop: true,
                is_mobile_prop: 'is_mobile_md',
                is_desktop_prop: 'is_desktop_md',
                onbindload: true,
                onunbind_func: function() {
                    $.each(_.sidebars, function (i, sidebar) {
                        _._resetSidebar(sidebar);
                    });
                },
                events: {
                    'theme.resize.sticky-sidebar scroll.sticky-sidebar sticky-sidebar.update': function() {
                        _.update();
                    }
                }
            });

            if($popup_quick_view.length) {
                theme.Global.responsiveHandler({
                    namespace: '.sticky-sidebar',
                    element: $('.js-popup'),
                    on_desktop: true,
                    is_mobile_prop: 'is_mobile_md',
                    is_desktop_prop: 'is_desktop_md',
                    onbindload: true,
                    events: {
                        'scroll.sticky-sidebar': function() {
                            _.update(null, ($popup_quick_view[0].getBoundingClientRect().top * -1) + 31);
                        }
                    }
                });
            }
        },
        reload: function () {
            this._getSidebars();
            this.update();
        },
        _getSidebars: function () {
            var _ = this;

            this.sidebars = [];

            $('.js-sticky-sidebar').each(function () {
                var $elem = $(this),
                    $body = $elem.find('[data-js-sticky-sidebar-body]');

                _.sidebars.push({
                    $elem: $elem,
                    $parent: $elem.parent(),
                    $body: $body,
                    state: null,
                    disable_offsets: $body[0].hasAttribute('data-js-disable-offsets') ? true : false
                });
            });
        },
        _resetSidebar: function (sidebar) {
            sidebar.$elem.removeClass('sidebar-fixed-bottom sidebar-static-bottom sidebar-fixed-top sidebar-offset-top');
            sidebar.$body.removeAttr('style');
        },
        _startAction: function (state, sidebar, func) {
            if(sidebar.state !== state) {
                func();
                sidebar.state = state;
            }
        },
        update: function (action, scroll) {
            if(!theme.current.is_desktop_md) {
                return;
            } else if(action === 'listener-enable') {
                this.fixed = true;
            } else if(action === 'listener-disable') {
                this.fixed = null;
                return;
            }
            
            scroll = scroll ? scroll : window.scrollY;

            var _ = this,
                stickyHeader = document.querySelector('sticky-header'),
                header_offset_top = stickyHeader && stickyHeader.getStickyHeight ? Math.ceil(stickyHeader.getStickyHeight()) : 0,
                footbar_offset_bottom = theme.ProductFootbar && theme.ProductFootbar.$footbar ? Math.ceil(theme.ProductFootbar.getFootbarHeight()) : 0;

            $.each(this.sidebars, function (i, sidebar) {
                var parent_pos = sidebar.$parent[0].getBoundingClientRect(),
                    body_pos = sidebar.$body[0].getBoundingClientRect(),
                    offset_top = null;

                if((body_pos.height + _.settings.min_height_diff >= parent_pos.height) || (sidebar.$elem.hasClass('sticky-sidebar-xl') && theme.current.bp !== 'xl') || (sidebar.$elem.hasClass('sticky-sidebar-lg') && !theme.current.is_desktop)) {
                    //off
                    _._startAction(1, sidebar, function () {
                        _._resetSidebar(sidebar);
                    });

                    sidebar.parent_pos = parent_pos;
                    sidebar.body_pos = body_pos;

                    return;
                }

                if(sidebar.disable_offsets) {
                    header_offset_top = 0;
                    footbar_offset_bottom = 0;
                }

                if(action === 'listener-enable') {
                    sidebar.$elem.addClass('sidebar-fixed-top');

                    sidebar.$elem.removeClass('sidebar-offset-top sidebar-fixed-bottom sidebar-static-bottom');

                    sidebar.$body.css({
                        'width': sidebar.$elem.width() + 'px',
                        'top': body_pos.top + 'px',
                        'bottom': '',
                        'margin-top': ''
                    });

                    sidebar.state = null;
                    sidebar.parent_pos = parent_pos;
                    sidebar.body_pos = body_pos;

                    return;
                } else if(action === 'listener-process') {
                    if(body_pos.height >= parent_pos.height) {
                        _._startAction(1, sidebar, function () {
                            _._resetSidebar(sidebar);
                        });
                    } else if(parent_pos.height > sidebar.parent_pos.height && parent_pos.bottom > _.settings.offset + header_offset_top && body_pos.top < _.settings.offset + header_offset_top) {
                        //$parent larger
                        if(parent_pos.bottom < theme.current.height - _.settings.offset - footbar_offset_bottom) {
                            offset_top = parent_pos.height - body_pos.height;
                        } else if(body_pos.top > parent_pos.top && sidebar.parent_pos.bottom < theme.current.height) {
                            offset_top = parent_pos.height - body_pos.height - (parent_pos.bottom - theme.current.height) - _.settings.offset - footbar_offset_bottom;
                        }

                        if(offset_top && offset_top > 0) {
                            sidebar.$elem.removeClass('sidebar-fixed-top sidebar-static-bottom').addClass('sidebar-offset-top');

                            sidebar.$body.css({
                                'width': '',
                                'top': '',
                                'margin-top': offset_top + 'px'
                            });
                        }
                    } else if(parent_pos.height < sidebar.parent_pos.height) {
                        //$parent smaller
                        if(sidebar.$elem.hasClass('sidebar-fixed-top')) {
                            if(Math.ceil(parent_pos.bottom) < Math.floor(body_pos.bottom)) {
                                sidebar.$elem.removeClass('sidebar-fixed-top sidebar-offset-top').addClass('sidebar-static-bottom');
                                sidebar.$body.removeAttr('style');
                            }
                        }
                    } else if(body_pos.height !== sidebar.body_pos.height) {
                        //$body smaller
                        if(parent_pos.bottom < theme.current.height - _.settings.offset - footbar_offset_bottom) {
                            if(body_pos.top !== parent_pos.top) {
                                sidebar.$body.css({
                                    'top': (body_pos.height - theme.current.height) * -1 - (theme.current.height - parent_pos.bottom) + 'px'
                                });
                            }
                        } else if(body_pos.bottom < theme.current.height) {
                            if(body_pos.height > theme.current.height - _.settings.offset * 2 - header_offset_top - footbar_offset_bottom) {
                                sidebar.$body.css({
                                    'top': (body_pos.height -  theme.current.height) * -1 - _.settings.offset - footbar_offset_bottom + 'px'
                                });
                            } else if(parent_pos.top < _.settings.offset + header_offset_top) {
                                sidebar.$body.css({
                                    'top': _.settings.offset + header_offset_top + 'px'
                                });
                            }
                        } else if(body_pos.bottom > parent_pos.bottom) {
                            sidebar.$body.css({
                                'top': (body_pos.height - theme.current.height) * -1 - (theme.current.height - parent_pos.bottom) + 'px'
                            });
                        }
                    }

                    sidebar.body_pos = body_pos;
                    sidebar.parent_pos = parent_pos;

                    return;
                }

                if(_.fixed) {
                    return;
                }

                if(body_pos.height > theme.current.height - _.settings.offset * 2 - header_offset_top - footbar_offset_bottom) {
                    //longer
                    if(scroll > _.current.scroll) {
                        //down
                        if(Math.floor(body_pos.bottom) > Math.ceil(theme.current.height - _.settings.offset - footbar_offset_bottom)) {
                            //$body bottom below window bottom
                            _._startAction(2, sidebar, function () {
                                if(parent_pos.top < _.settings.offset + header_offset_top && !sidebar.$elem.hasClass('sidebar-offset-top')) {
                                    offset_top = parent_pos.top - body_pos.top;
                                    sidebar.$elem.addClass('sidebar-offset-top');
                                }

                                sidebar.$elem.removeClass('sidebar-fixed-bottom sidebar-static-bottom sidebar-fixed-top');
                                sidebar.$body.css({
                                    'width': '',
                                    'bottom': '',
                                    'top': ''
                                });

                                if(offset_top) {
                                    sidebar.$body.css({'margin-top': offset_top * -1 + 'px'});
                                    offset_top = null;
                                }
                            });
                        } else {
                            //$body bottom above window bottom
                            if(Math.floor(parent_pos.bottom) > Math.ceil(theme.current.height - _.settings.offset - footbar_offset_bottom)) {
                                //$parent bottom below window bottom
                                _._startAction(3, sidebar, function () {
                                    sidebar.$body.css({
                                        'width': sidebar.$elem.width() + 'px',
                                        'bottom': _.settings.offset + footbar_offset_bottom + 'px',
                                        'top': '',
                                        'margin-top': ''
                                    });
                                    sidebar.$elem.removeClass('sidebar-static-bottom sidebar-fixed-top sidebar-offset-top').addClass('sidebar-fixed-bottom');
                                });
                            } else {
                                //$parent bottom above window bottom
                                _._startAction(4, sidebar, function () {
                                    sidebar.$elem.removeClass('sidebar-fixed-bottom sidebar-fixed-top sidebar-offset-top').addClass('sidebar-static-bottom');
                                    sidebar.$body.removeAttr('style');
                                });
                            }
                        }
                    } else if(scroll < _.current.scroll) {
                        //up
                        if(body_pos.top < _.settings.offset + header_offset_top) {
                            //$body top above window top
                            _._startAction(5, sidebar, function () {
                                if(parent_pos.top < _.settings.offset + header_offset_top && !sidebar.$elem.hasClass('sidebar-offset-top')) {
                                    offset_top = parent_pos.top - body_pos.top;
                                    sidebar.$elem.addClass('sidebar-offset-top');
                                }

                                sidebar.$elem.removeClass('sidebar-fixed-top sidebar-fixed-bottom');

                                sidebar.$body.css({
                                    'width': '',
                                    'top': '',
                                    'bottom': ''
                                });

                                if(offset_top) {
                                    sidebar.$body.css({'margin-top': offset_top * -1 + 'px'});
                                    offset_top = null;
                                }
                            });
                        } else {
                            //$body top below window top
                            if(parent_pos.top < _.settings.offset + header_offset_top) {
                                //$parent top below window top
                                _._startAction(6, sidebar, function () {
                                    sidebar.$body.css({
                                        'width': sidebar.$elem.width() + 'px',
                                        'top': _.settings.offset + header_offset_top + 'px',
                                        'bottom': '',
                                        'margin-top': ''
                                    });
                                    sidebar.$elem.removeClass('sidebar-offset-top sidebar-fixed-bottom sidebar-static-bottom').addClass('sidebar-fixed-top');
                                });
                            } else {
                                //$this bottom above window bottom
                                _._startAction(1, sidebar, function () {
                                    _._resetSidebar(sidebar);
                                });
                            }
                        }
                    }
                } else {
                    //shorter
                    if(parent_pos.top < _.settings.offset + header_offset_top) {
                        //$body top above window top
                        if(body_pos.height < parent_pos.bottom - _.settings.offset - header_offset_top) {
                            //$body bottom below parent bottom
                            _._startAction(7, sidebar, function () {
                                sidebar.$body.css({
                                    'width': sidebar.$elem.width() + 'px',
                                    'top': _.settings.offset + header_offset_top + 'px',
                                    'bottom': '',
                                    'margin-top': ''
                                });
                                sidebar.$elem.removeClass('sidebar-static-bottom sidebar-fixed-bottom sidebar-offset-top').addClass('sidebar-fixed-top');
                            });
                        } else {
                            //$body bottom above parent bottom
                            _._startAction(8, sidebar, function () {
                                sidebar.$elem.removeClass('sidebar-fixed-top sidebar-offset-top sidebar-fixed-bottom').addClass('sidebar-static-bottom');
                                sidebar.$body.removeAttr('style');
                            });
                        }
                    } else {
                        //$body top below window top
                        _._startAction(1, sidebar, function () {
                            _._resetSidebar(sidebar);
                        });
                    }
                }
            });

            this.current.scroll = scroll;
        }
    });

    theme.AssetsLoader.onPageLoaded(function() {
        if(window.moz) return;
         
        theme.StickySidebar = new StickySidebar;
    });
})(jQueryTheme);