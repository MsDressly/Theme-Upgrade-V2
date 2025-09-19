/*DOCUMENTATION https://github.com/verlok/lazyload*/
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).LazyLoad=n()}(this,(function(){"use strict";function t(){return(t=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t}).apply(this,arguments)}var n="undefined"!=typeof window,e=n&&!("onscroll"in window)||"undefined"!=typeof navigator&&/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),i=n&&"IntersectionObserver"in window,o=n&&"classList"in document.createElement("p"),r=n&&window.devicePixelRatio>1,a={elements_selector:".lazy",container:e||n?document:null,threshold:300,thresholds:null,data_src:"src",data_srcset:"srcset",data_sizes:"sizes",data_bg:"bg",data_bg_hidpi:"bg-hidpi",data_bg_multi:"bg-multi",data_bg_multi_hidpi:"bg-multi-hidpi",data_poster:"poster",class_applied:"applied",class_loading:"loading",class_loaded:"loaded",class_error:"error",class_entered:"entered",class_exited:"exited",unobserve_completed:!0,unobserve_entered:!1,cancel_on_exit:!0,callback_enter:null,callback_exit:null,callback_applied:null,callback_loading:null,callback_loaded:null,callback_error:null,callback_finish:null,callback_cancel:null,use_native:!1},c=function(n){return t({},a,n)},s=function(t,n){var e,i="LazyLoad::Initialized",o=new t(n);try{e=new CustomEvent(i,{detail:{instance:o}})}catch(t){(e=document.createEvent("CustomEvent")).initCustomEvent(i,!1,!1,{instance:o})}window.dispatchEvent(e)},l="loading",u="loaded",d="applied",f="error",_="native",g="data-",v="ll-status",p=function(t,n){return t.getAttribute(g+n)},b=function(t){return p(t,v)},h=function(t,n){return function(t,n,e){var i="data-ll-status";null!==e?t.setAttribute(i,e):t.removeAttribute(i)}(t,0,n)},m=function(t){return h(t,null)},E=function(t){return null===b(t)},y=function(t){return b(t)===_},A=[l,u,d,f],I=function(t,n,e,i){t&&(void 0===i?void 0===e?t(n):t(n,e):t(n,e,i))},L=function(t,n){o?t.classList.add(n):t.className+=(t.className?" ":"")+n},w=function(t,n){o?t.classList.remove(n):t.className=t.className.replace(new RegExp("(^|\\s+)"+n+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")},k=function(t){return t.llTempImage},O=function(t,n){if(n){var e=n._observer;e&&e.unobserve(t)}},x=function(t,n){t&&(t.loadingCount+=n)},z=function(t,n){t&&(t.toLoadCount=n)},C=function(t){for(var n,e=[],i=0;n=t.children[i];i+=1)"SOURCE"===n.tagName&&e.push(n);return e},N=function(t,n,e){e&&t.setAttribute(n,e)},M=function(t,n){t.removeAttribute(n)},R=function(t){return!!t.llOriginalAttrs},G=function(t){if(!R(t)){var n={};n.src=t.getAttribute("src"),n.srcset=t.getAttribute("srcset"),n.sizes=t.getAttribute("sizes"),t.llOriginalAttrs=n}},T=function(t){if(R(t)){var n=t.llOriginalAttrs;N(t,"src",n.src),N(t,"srcset",n.srcset),N(t,"sizes",n.sizes)}},j=function(t,n){N(t,"sizes",p(t,n.data_sizes)),N(t,"srcset",p(t,n.data_srcset)),N(t,"src",p(t,n.data_src))},D=function(t){M(t,"src"),M(t,"srcset"),M(t,"sizes")},F=function(t,n){var e=t.parentNode;e&&"PICTURE"===e.tagName&&C(e).forEach(n)},P={IMG:function(t,n){F(t,(function(t){G(t),j(t,n)})),G(t),j(t,n)},IFRAME:function(t,n){N(t,"src",p(t,n.data_src))},VIDEO:function(t,n){!function(t,e){C(t).forEach((function(t){N(t,"src",p(t,n.data_src))}))}(t),N(t,"poster",p(t,n.data_poster)),N(t,"src",p(t,n.data_src)),t.load()}},S=function(t,n){var e=P[t.tagName];e&&e(t,n)},V=function(t,n,e){x(e,1),L(t,n.class_loading),h(t,l),I(n.callback_loading,t,e)},U=["IMG","IFRAME","VIDEO"],$=function(t,n){!n||function(t){return t.loadingCount>0}(n)||function(t){return t.toLoadCount>0}(n)||I(t.callback_finish,n)},q=function(t,n,e){t.addEventListener(n,e),t.llEvLisnrs[n]=e},H=function(t,n,e){t.removeEventListener(n,e)},B=function(t){return!!t.llEvLisnrs},J=function(t){if(B(t)){var n=t.llEvLisnrs;for(var e in n){var i=n[e];H(t,e,i)}delete t.llEvLisnrs}},K=function(t,n,e){!function(t){delete t.llTempImage}(t),x(e,-1),function(t){t&&(t.toLoadCount-=1)}(e),w(t,n.class_loading),n.unobserve_completed&&O(t,e)},Q=function(t,n,e){var i=k(t)||t;B(i)||function(t,n,e){B(t)||(t.llEvLisnrs={});var i="VIDEO"===t.tagName?"loadeddata":"load";q(t,i,n),q(t,"error",e)}(i,(function(o){!function(t,n,e,i){var o=y(n);K(n,e,i),L(n,e.class_loaded),h(n,u),I(e.callback_loaded,n,i),o||$(e,i)}(0,t,n,e),J(i)}),(function(o){!function(t,n,e,i){var o=y(n);K(n,e,i),L(n,e.class_error),h(n,f),I(e.callback_error,n,i),o||$(e,i)}(0,t,n,e),J(i)}))},W=function(t,n,e){!function(t){t.llTempImage=document.createElement("IMG")}(t),Q(t,n,e),function(t,n,e){var i=p(t,n.data_bg),o=p(t,n.data_bg_hidpi),a=r&&o?o:i;a&&(t.style.backgroundImage='url("'.concat(a,'")'),k(t).setAttribute("src",a),V(t,n,e))}(t,n,e),function(t,n,e){var i=p(t,n.data_bg_multi),o=p(t,n.data_bg_multi_hidpi),a=r&&o?o:i;a&&(t.style.backgroundImage=a,function(t,n,e){L(t,n.class_applied),h(t,d),n.unobserve_completed&&O(t,n),I(n.callback_applied,t,e)}(t,n,e))}(t,n,e)},X=function(t,n,e){!function(t){return U.indexOf(t.tagName)>-1}(t)?W(t,n,e):function(t,n,e){Q(t,n,e),S(t,n),V(t,n,e)}(t,n,e)},Y=["IMG","IFRAME"],Z=function(t){return t.use_native&&"loading"in HTMLImageElement.prototype},tt=function(t,n,e){t.forEach((function(t){return function(t){return t.isIntersecting||t.intersectionRatio>0}(t)?function(t,n,e,i){h(t,"entered"),L(t,e.class_entered),w(t,e.class_exited),function(t,n,e){n.unobserve_entered&&O(t,e)}(t,e,i),I(e.callback_enter,t,n,i),function(t){return A.indexOf(b(t))>=0}(t)||X(t,e,i)}(t.target,t,n,e):function(t,n,e,i){E(t)||(L(t,e.class_exited),function(t,n,e,i){e.cancel_on_exit&&function(t){return b(t)===l}(t)&&"IMG"===t.tagName&&(J(t),function(t){F(t,(function(t){D(t)})),D(t)}(t),function(t){F(t,(function(t){T(t)})),T(t)}(t),w(t,e.class_loading),x(i,-1),m(t),I(e.callback_cancel,t,n,i))}(t,n,e,i),I(e.callback_exit,t,n,i))}(t.target,t,n,e)}))},nt=function(t){return Array.prototype.slice.call(t)},et=function(t){return t.container.querySelectorAll(t.elements_selector)},it=function(t){return function(t){return b(t)===f}(t)},ot=function(t,n){return function(t){return nt(t).filter(E)}(t||et(n))},rt=function(t,e){var o=c(t);this._settings=o,this.loadingCount=0,function(t,n){i&&!Z(t)&&(n._observer=new IntersectionObserver((function(e){tt(e,t,n)}),function(t){return{root:t.container===document?null:t.container,rootMargin:t.thresholds||t.threshold+"px"}}(t)))}(o,this),function(t,e){n&&window.addEventListener("online",(function(){!function(t,n){var e;(e=et(t),nt(e).filter(it)).forEach((function(n){w(n,t.class_error),m(n)})),n.update()}(t,e)}))}(o,this),this.update(e)};return rt.prototype={update:function(t){var n,o,r=this._settings,a=ot(t,r);z(this,a.length),!e&&i?Z(r)?function(t,n,e){t.forEach((function(t){-1!==Y.indexOf(t.tagName)&&(t.setAttribute("loading","lazy"),function(t,n,e){Q(t,n,e),S(t,n),h(t,_)}(t,n,e))})),z(e,0)}(a,r,this):(o=a,function(t){t.disconnect()}(n=this._observer),function(t,n){n.forEach((function(n){t.observe(n)}))}(n,o)):this.loadAll(a)},destroy:function(){this._observer&&this._observer.disconnect(),et(this._settings).forEach((function(t){delete t.llOriginalAttrs})),delete this._observer,delete this._settings,delete this.loadingCount,delete this.toLoadCount},loadAll:function(t){var n=this,e=this._settings;ot(t,e).forEach((function(t){O(t,n),X(t,e,n)}))}},rt.load=function(t,n){var e=c(n);X(t,e)},rt.resetStatus=function(t){m(t)},n&&function(t,n){if(n)if(n.length)for(var e,i=0;e=n[i];i+=1)s(t,e);else s(t,n)}(rt,window.lazyLoadOptions),rt}));
theme.LazyImage = Object.assign(theme.LazyImage, {
    load: function() {
        this.api = new LazyLoad({
            elements_selector: '.lazyload:not(.lazyload--hold)',
            threshold: 100,
            callback_enter: this.enter,
            callback_loaded: this.onLoadedEvents
        });
        window.addEventListener('theme.resize', this.checkImages);
        window.addEventListener('checkImages', this.checkImages);

        if(!window.isDesignMode) {
            theme.AssetsLoader.onUserAction(() => {
                setTimeout(() => {
                    this.postloadImage(20);
                }, (theme.current.is_mobile ? 100 : 50));
            });
        }
    },
    postloadImage: function(interval = 500) {
        let currentImage;

        document.querySelectorAll('main .lazyload').forEach(element => {
            if(!element.classList.contains('entered') && !element.dataset.bg && element.offsetWidth > 0 && element.offsetHeight > 0) {
                currentImage = element;
                return false;
            }
        });

        if(!currentImage) return;
        if(document.querySelectorAll('.lazyload.loading').length) {
            setTimeout(() => {
                this.postloadImage(interval);
            }, interval);
        } else {
            const onCurrentImageLoad = () => {
                currentImage.removeEventListener('load', onCurrentImageLoad);
                setTimeout(() => {
                    this.postloadImage(interval);
                }, interval);
            };

            currentImage.addEventListener('load', onCurrentImageLoad);
            this.update(currentImage);
        }
    },
    checkImages: function() {
        document.querySelectorAll('.lazyload.loaded').forEach(element => {
            const url = element.dataset.master;
            const srcset = element.getAttribute('srcset');
            const dataBg = element.dataset.bg;
            const newSrcset = theme.LazyImage.buildSrcset(element, url, (dataBg ? 'bg' : 'srcset'))

            if(srcset && srcset === newSrcset) return;
            if(dataBg) {
                element.style.backgroundImage = newSrcset;
            } else {
                element.setAttribute('srcset', newSrcset);
            }
        });
    }
});

theme.AssetsLoader.onPageLoaded(function() {
    theme.LazyImage.load();
});
(function($){
  function Dropdown() {
      this.selectors = {
          element: '.js-dropdown',
          button: '[data-js-dropdown-button]',
          dropdown: '[data-js-dropdown]'
      };
  
      this.settings = {
          namespace: '.dropdown'
      };
  
      this.load();
  };
  
  Dropdown.prototype = $.extend({}, Dropdown.prototype, {
      duration: function () {
          return theme.animations.dropdown.duration * 1000;
      },
      load: function() {
          var _ = this;
  
          theme.Global.responsiveHandler({
              namespace: this.settings.namespace,
              element: $body,
              delegate: this.selectors.button + ', ' + this.selectors.dropdown,
              on_desktop: true,
              events: {
                  'show hide close': function(e) {
                      var $elem = $(this).parents(_.selectors.element),
                          $btn = $elem.find(_.selectors.button),
                          $dropdown = $elem.find(_.selectors.dropdown);
  
                      _['_' + e.type]($elem, $dropdown, $btn);
                  }
              }
          });
  
          theme.Global.responsiveHandler({
              namespace: this.settings.namespace,
              element: $body,
              delegate: this.selectors.button,
              on_desktop: true,
              events: {
                  'mouseenter': function() {
                      var $this = $(this),
                          $elem = $this.parents(_.selectors.element),
                          $dropdown = $elem.find(_.selectors.dropdown);
  
                      if(!$this.hasClass('active') && !$dropdown.hasClass('show')) {
                          _._show($elem, $dropdown, $this);
                      }
                  },
                  'mousedown': function(e) {
                      var $this = $(this),
                          $elem = $this.parents(_.selectors.element),
                          $dropdown = $elem.find(_.selectors.dropdown);
  
                      if(!$this.hasClass('active')) {
                          _._show($elem, $dropdown, $this, true);
  
                          $body.on('mousedown' + _.settings.namespace, function (e) {
                              if(!$(e.target).parents(_.selectors.dropdown + ', ' + _.selectors.button).length && !$(e.target).hasClass('select__dropdown')) {
                                  $(_.selectors.dropdown).trigger('hide');
                              }
                          });
                      } else {
                          _._hide($elem, $dropdown, $this);
                      }
  
                      e.preventDefault();
                      return false;
                  }
              }
          });
  
          theme.Global.responsiveHandler({
              namespace: this.settings.namespace,
              element: $body,
              delegate: this.selectors.element,
              on_desktop: true,
              events: {
                  'mouseleave': function() {
                      var $this = $(this),
                          $btn = $this.find(_.selectors.button),
                          $dropdown = $this.find(_.selectors.dropdown);
  
                      if(!$btn.hasClass('active')) {
                          _._hide($this, $dropdown, $btn);
                      }
                  }
              }
          });
      },
      _show: function ($elem, $dropdown, $btn, is_click) {
          $(this.selectors.dropdown).not($dropdown).trigger('close');
  
          if(is_click) {
              $btn.addClass('active');
          }
  
          if($dropdown.hasClass('show')) {
              return;
          }
  
          $(this.selectors.element).removeClass('hovered');
          $elem.addClass('hovered');
  
          $dropdown.hide().addClass('show animate');
  
          if(window.edge) {
              $dropdown.addClass('visible').show();
          } else {
              $dropdown.stop();
  
              $dropdown.slideDown({
                  duration: this.duration(),
                  start: function () {
                      setTimeout(function () {
                          $dropdown.addClass('visible');
                      }, 0);
                  },
                  complete: function () {
                      $dropdown.removeAttr('style');
                  }
              });
          }
      },
      _hide: function ($elem, $dropdown, $btn) {
          if(window.edge) {
              $dropdown.removeClass('show animate visible');
              $elem.removeClass('hovered');
          } else {
              $dropdown.stop();
  
              $dropdown.slideUp({
                  duration: this.duration(),
                  start: function () {
                      $dropdown.removeClass('visible');
                  },
                  complete: function () {
                      $dropdown.removeClass('show animate').removeAttr('style');
                      $elem.removeClass('hovered');
                  }
              });
          }
  
          $btn.removeClass('active');
          $body.unbind('click' + this.settings.namespace);
      },
      _close: function ($dropdown, $btn) {
          $dropdown.stop();
          $dropdown.removeClass('show animate visible').removeAttr('style');
          $btn.removeClass('active');
          $body.unbind('click' + this.settings.namespace);
      }
  });
  
  theme.AssetsLoader.onPageLoaded(function() {
      theme.Dropdown = new Dropdown;
  });
  function Select() {
      this.selectors = {
          element: '.js-select',
          dropdown: '[data-js-select-dropdown]'
      };
  
      this.settings = {
          namespace: '.select'
      };
  
      this.load();
  };
  
  Select.prototype = $.extend({}, Select.prototype, {
      load: function() {
          var _ = this;
  
          $body.on('click', this.selectors.element + ' ' + this.selectors.dropdown + ' span', function() {
              var $this = $(this);
              
              if(($this.parents(_.selectors.dropdown)[0].hasAttribute('data-dropdown-unselected') || !$this.hasClass('selected')) && !$this[0].hasAttribute('disabled')) {
                  var value = $this.attr('data-value'),
                      $dropdown = $this.parents(_.selectors.dropdown),
                      $wrapper = $this.parents('.js-select'),
                      $select = $wrapper.find('select');
  
                  $select.val(value);
  
                  $dropdown.find('span').removeClass('selected');
                  $this.addClass('selected');
  
                  $dropdown.trigger('hide');
  
                  $select.change();
  
                  const form = $select.get(0).closest('form');
  
                  if(form) {
                      form.dispatchEvent(new Event('input'));
                  }
              }
          });
  
          $body.on('change update' + this.settings.namespace, this.selectors.element + ' select', function() {
              var $this = $(this),
                  $dropdown_items = $this.parents(_.selectors.element).find(_.selectors.dropdown + ' span'),
                  value = $this.val();
  
              $dropdown_items.each(function() {
                  var $this = $(this);
  
                  $this[$this.attr('data-value') == value ? 'addClass' : 'removeClass']('selected');
              });
          });
  
          $(this.selectors.element + '[data-onload-check] select').trigger('update' + this.settings.namespace);
      }
  });
  
  theme.AssetsLoader.onPageLoaded(function() {
      theme.Select = new Select;
  });
  function ButtonsBlocksVisibility() {
      this.selectors = {
          buttons: '.js-button-block-visibility'
      };
  
      this.load();
  };
  
  ButtonsBlocksVisibility.prototype = $.extend({}, ButtonsBlocksVisibility.prototype, {
      load: function() {
          $('[data-block-visibility]').each(function () {
              var $this = $(this),
                  name = $this.attr('data-block-visibility');
  
              if(window.location.href.indexOf(name) != -1) {
                  $this.removeClass('d-none-important');
  
                  $this.find('[data-block-visibility-focus]').focus();
              }
          });
  
          $body.on('click', this.selectors.buttons, function (e) {
              var $this = $(this),
                  name = $this.attr('data-block-link'),
                  $block = $('[data-block-visibility="' + name + '"]');
  
              if(!$block.length) {
                  return;
              }
  
              var close_popup = $this.attr('data-action-close-popup');
  
              if($block.attr('data-block-animate') === 'true') {
                  $block.stop().removeAttr('style');
  
                  if($block.hasClass('d-none-important')) {
                      $block.stop().removeAttr('style');
  
                      $block.slideDown({
                          duration: theme.animations.dropdown.duration * 1000,
                          start: function () {
                              $block.removeClass('d-none-important');
                              $this.addClass('open');
                          },
                          complete: function () {
                              $block.removeAttr('style');
                          }
                      });
                  } else {
                      $block.slideUp({
                          duration: theme.animations.dropdown.duration * 1000,
                          complete: function () {
                              $block.addClass('d-none-important').removeAttr('style');
                              $this.removeClass('open');
                          }
                      });
                  }
              } else {
                  $block[$this.attr('data-action') === 'close' ? 'addClass' : $this.attr('data-action') === 'open' ? 'removeClass' : 'toggleClass']('d-none-important');
              }
  
              function scrollToBlock() {
                  if(!$block.hasClass('d-none-important') || $this.attr('data-action') === 'open') {
                      if($block[0].hasAttribute('data-block-onscroll')) {
                          var block_t = $block.offset().top,
                              stickyHeader = document.querySelector('sticky-header'),
                              header_h = stickyHeader && stickyHeader.getStickyHeight ? stickyHeader.getStickyHeight() : 0;
  
                          $('html, body').animate({
                              scrollTop: block_t - header_h,
                              duration: 300
                          });
                      }
                  }
              };
  
              if(close_popup) {
                  theme.Popups.closeByName(close_popup, null, function () {
                      scrollToBlock();
                  });
              } else {
                  scrollToBlock();
              }
  
              if(!$block.hasClass('d-none-important')) {
                  $block.find('[data-block-visibility-focus]').focus();
              }
  
              e.preventDefault();
              return false;
          });
      }
  });
  
  theme.AssetsLoader.onPageLoaded(function() {
      theme.ButtonsBlocksVisibility = new ButtonsBlocksVisibility;
  });
  function Trigger() {
      this.load();
  };
  
  Trigger.prototype = $.extend({}, Trigger.prototype, {
      load: function () {
          var _ = this;
  
          $body.on('click', '[data-js-trigger]', function () {
              _.process($(this).attr('data-js-trigger'));
          });
      },
      process: function (id, event) {
          event = event || 'click';
  
          $('[data-js-trigger-id="' + id + '"]').trigger(event);
      }
  });
      
  theme.AssetsLoader.onPageLoaded(function() {
      theme.Trigger = new Trigger;
  });
  function PopupAccount() {
      this.settings = {
          popup_name: 'account'
      };
  
      this.selectors = {
          account: '.js-popup-account',
          show_sign_up: '.js-popup-account-show-sign-up'
      };
  
      this.load();
  };
  
  PopupAccount.prototype = $.extend({}, PopupAccount.prototype, {
      load: function() {
          var _ = this;
  
          $body.on('click', this.selectors.show_sign_up, function(e) {
              var $account = $(_.selectors.account);
  
              $account.find('.popup-account__login').addClass('d-none-important');
              $account.find('.popup-account__sign-up').removeClass('d-none-important');
  
              e.preventDefault();
              return false;
          });
  
          theme.Popups.addHandler(_.settings.popup_name, 'close.after', function() {
              var $account = $(_.selectors.account);
  
              $account.find('.popup-account__login').removeClass('d-none-important');
              $account.find('.popup-account__sign-up').addClass('d-none-important');
          });
      }
  });
      
  theme.AssetsLoader.onPageLoaded(function() {
      theme.PopupAccount = new PopupAccount;
  });
  
  
  
  class SearchForm extends HTMLElement {
      constructor() {
        super();
        this.input = this.querySelector('input[type="search"]');
        this.resetButton = this.querySelector('button[type="reset"]');
    
        if (this.input) {
          this.input.form.addEventListener('reset', this.onFormReset.bind(this));
          this.input.addEventListener('input', theme.debounce((event) => {
            this.onChange(event);
          }, 300).bind(this));
  
          theme.Popups.addHandler('navigation', 'call.after', () => {
            if(theme.current.is_desktop) {
              this.input.focus();
            }
          });
        }
      }
    
      toggleResetButton() {
        const resetIsHidden = this.resetButton.classList.contains('hidden');
        if (this.input.value.length > 0 && resetIsHidden) {
          this.resetButton.classList.remove('hidden')
        } else if (this.input.value.length === 0  && !resetIsHidden) {
          this.resetButton.classList.add('hidden')
        }
      }
    
      onChange() {
        this.toggleResetButton();
      }
    
      shouldResetForm() {
        return !document.querySelector('[aria-selected="true"] a')
      }
    
      onFormReset(event) {
        // Prevent default so the form reset doesn't set the value gotten from the url on page load
        event.preventDefault();
        // Don't reset if the user has selected an element on the predictive search dropdown
        if (this.shouldResetForm()) {
          this.input.value = '';
          this.input.focus();
          this.toggleResetButton();
        }
      }
  }
    
  class PredictiveSearch extends SearchForm {
      constructor() {
        super();
        this.cachedResults = {};
        this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
        this.allPredictiveSearchInstances =
          document.querySelectorAll('predictive-search');
        this.isOpen = false;
        this.abortController = new AbortController();
        this.searchTerm = '';
    
        this.setupEventListeners();
      }
    
      setupEventListeners() {
        this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));
    
        document.addEventListener('mousedown', event => this.activeElement = event.target);
        this.input.addEventListener('focus', this.onFocus.bind(this));
        this.addEventListener('focusout', this.onFocusOut.bind(this));
        this.addEventListener('keyup', this.onKeyup.bind(this));
        this.addEventListener('keydown', this.onKeydown.bind(this));
  
        theme.Popups.addHandler('navigation', 'close.before', () => {
          this.closeResults(true);
        });
      }
    
      getQuery() {
        return this.input.value.trim();
      }
    
      onChange() {
        super.onChange();
        const newSearchTerm = this.getQuery();
        if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
          // Remove the results when they are no longer relevant for the new search term
          // so they don't show up when the dropdown opens again
          this.querySelector("#predictive-search-results-groups-wrapper")?.remove();
        }
    
        // Update the term asap, don't wait for the predictive search query to finish loading
        this.updateSearchForTerm(this.searchTerm, newSearchTerm);
    
        this.searchTerm = newSearchTerm;
    
        if (!this.searchTerm.length) {
          this.close(true);
          return;
        }
    
        this.getSearchResults(this.searchTerm);
      }
    
      onFormSubmit(event) {
        if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
      }
    
      onFormReset(event) {
        super.onFormReset(event);
        if (super.shouldResetForm()) {
          this.searchTerm = '';
          this.abortController.abort();
          this.abortController = new AbortController();
          this.closeResults(true);
        }
      }
    
      onFocus() {
        const currentSearchTerm = this.getQuery();
    
        if (!currentSearchTerm.length) return;
    
        if (this.searchTerm !== currentSearchTerm) {
          // Search term was changed from other search input, treat it as a user change
          this.onChange();
        } else if (this.getAttribute('results') === 'true') {
          this.open();
        } else {
          this.getSearchResults(this.searchTerm);
        }
      }
    
      onFocusOut() {
        setTimeout(() => {
          if (!this.contains(document.activeElement) && !this.contains(this.activeElement)) this.close();
        })
      }
    
      onKeyup(event) {
        if (!this.getQuery().length) this.close(true);
        event.preventDefault();
    
        switch (event.code) {
          case 'ArrowUp':
            this.switchOption('up')
            break;
          case 'ArrowDown':
            this.switchOption('down');
            break;
          case 'Enter':
            this.selectOption();
            break;
        }
      }
    
      onKeydown(event) {
        // Prevent the cursor from moving in the input when using the up and down arrow keys
        if (
          event.code === 'ArrowUp' ||
          event.code === 'ArrowDown'
        ) {
          event.preventDefault();
        }
      }
    
      updateSearchForTerm(previousTerm, newTerm) {
        const searchForTextElement = this.querySelector(
          "[data-predictive-search-search-for-text]"
        );
        const currentButtonText = searchForTextElement?.innerText;
        if (currentButtonText) {
          if (currentButtonText.match(new RegExp(previousTerm, "g")).length > 1) {
            // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
            return;
          }
          const newButtonText = currentButtonText.replace(previousTerm, newTerm);
          searchForTextElement.innerText = newButtonText;
        }
      }
    
      switchOption(direction) {
        if (!this.getAttribute('open')) return;
    
        const moveUp = direction === 'up';
        const selectedElement = this.querySelector('[aria-selected="true"]');
    
        // Filter out hidden elements (duplicated page and article resources) thanks
        // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
        const allVisibleElements = Array.from(
          this.querySelectorAll("li, button.predictive-search__item")
        ).filter((element) => element.offsetParent !== null);
        let activeElementIndex = 0;
    
        if (moveUp && !selectedElement) return;
    
        let selectedElementIndex = -1;
        let i = 0;
    
        while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
          if (allVisibleElements[i] === selectedElement) {
            selectedElementIndex = i;
          }
          i++;
        }
    
        this.statusElement.textContent = "";
    
        if (!moveUp && selectedElement) {
          activeElementIndex =
            selectedElementIndex === allVisibleElements.length - 1
              ? 0
              : selectedElementIndex + 1;
        } else if (moveUp) {
          activeElementIndex =
            selectedElementIndex === 0
              ? allVisibleElements.length - 1
              : selectedElementIndex - 1;
        }
    
        if (activeElementIndex === selectedElementIndex) return;
    
        const activeElement = allVisibleElements[activeElementIndex];
    
        activeElement.setAttribute('aria-selected', true);
        if (selectedElement) selectedElement.setAttribute('aria-selected', false);
    
        this.input.setAttribute('aria-activedescendant', activeElement.id);
      }
    
      selectOption() {
        const selectedOption = this.querySelector(
          '[aria-selected="true"] a, button[aria-selected="true"]'
        );
    
        if (selectedOption) selectedOption.click();
      }
    
      getSearchResults(searchTerm) {
        const queryKey = searchTerm.replace(" ", "-").toLowerCase();
        this.setLiveRegionLoadingState();
    
        if (this.cachedResults[queryKey]) {
          this.renderSearchResults(this.cachedResults[queryKey]);
          return;
        }
    
        fetch(
          `${theme.routes.predictive_search_url}?q=${encodeURIComponent(
            searchTerm
          )}&section_id=predictive-search`,
          { signal: this.abortController.signal }
        )
          .then((response) => {
            if (!response.ok) {
              var error = new Error(response.status);
              this.close();
              throw error;
            }
    
            return response.text();
          })
          .then((text) => {
            const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
            // Save bandwidth keeping the cache in all instances synced
            this.allPredictiveSearchInstances.forEach(
              (predictiveSearchInstance) => {
                predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
              }
            );
            this.renderSearchResults(resultsMarkup);
          })
          .catch((error) => {
            if (error?.code === 20) {
              // Code 20 means the call was aborted
              return;
            }
            this.close();
            throw error;
          });
      }
    
      setLiveRegionLoadingState() {
        this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
        this.loadingText = this.loadingText || this.getAttribute('data-loading-text');
    
        this.setLiveRegionText(this.loadingText);
        theme.Preloader.set(this);
      }
    
      setLiveRegionText(statusText) {
        this.statusElement.setAttribute('aria-hidden', 'false');
        this.statusElement.textContent = statusText;
    
        setTimeout(() => {
          this.statusElement.setAttribute('aria-hidden', 'true');
        }, 1000);
      }
    
      renderSearchResults(resultsMarkup) {
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.setAttribute('results', true);
    
        this.setLiveRegionResults();
        this.open();
        theme.Preloader.unset(this);
      }
    
      setLiveRegionResults() {
        theme.Preloader.unset(this);
        this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
      }
    
      getResultsMaxHeight() {
      //   this.resultsMaxHeight = window.innerHeight - document.querySelector('.section-header').getBoundingClientRect().bottom;
      //   return this.resultsMaxHeight;
      }
    
      open() {
        this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
        this.setAttribute('open', true);
        this.input.setAttribute('aria-expanded', true);
        this.predictiveSearchResults.classList.remove('d-none-important');
        this.isOpen = true;
      }
    
      close(clearSearchTerm = false) {
        this.closeResults(clearSearchTerm);
        this.isOpen = false;
      }
    
      closeResults(clearSearchTerm = false) {
        if (clearSearchTerm) {
          this.input.value = '';
          this.removeAttribute('results');
        }
        const selected = this.querySelector('[aria-selected="true"]');
    
        if (selected) selected.setAttribute('aria-selected', false);
  
        this.predictiveSearchResults.classList.add('d-none-important');
        this.input.setAttribute('aria-activedescendant', '');
        theme.Preloader.unset(this);
        this.removeAttribute('open');
        this.input.setAttribute('aria-expanded', false);
        this.resultsMaxHeight = false
        this.predictiveSearchResults.removeAttribute('style');
      }
  }
    
  theme.AssetsLoader.onPageLoaded(function() {
      customElements.define('search-form', SearchForm);
      customElements.define('predictive-search', PredictiveSearch);
  });
  class ProductPrice {
      constructor() {
          
      }
  
      findPresentmentPrice(presentment_prices, property) {
          let price;
  
          if(presentment_prices) {
              presentment_prices.forEach(obj => {
                  if(obj[property] && obj[property].amount && Shopify.currency.active === obj[property].currency_code) {
                      price = obj[property].amount;
  
                      return false;
                  }
              });
          }
  
          return price;
      }
  
      insertPresentmentPrices($price, presentment_prices) {
          var price = this.findPresentmentPrice(presentment_prices, 'price'),
              compare_at_price = this.findPresentmentPrice(presentment_prices, 'compare_at_price');
  
          var html = '',
              sale = compare_at_price && compare_at_price > price;
  
          $price[sale ? 'addClass' : 'removeClass']('price--sale');
  
          if(sale) {
              let formatedCompareAtPrice = Number(compare_at_price).toLocaleString('ja-JP', {style: 'currency', currency: Shopify.currency.active});
  
              html += '<span>';
              html += formatedCompareAtPrice;
              html += '</span>';
  
              if($price[0].hasAttribute('data-js-show-sale-separator')) {
                  html += theme.strings.price_sale_separator;
              }
          }
  
          let formatedPrice = Number(price).toLocaleString('ja-JP', {style: 'currency', currency: Shopify.currency.active});
  
          html += '<span>';
          html += formatedPrice;
          html += '</span>';
  
          $price.html(html);
      }
  
      insert($price, price_origin, compare_at_price_origin) {
          var price = +price_origin,
              compare_at_price = +compare_at_price_origin;
  
          var html = '',
              sale = compare_at_price && compare_at_price > price;
  
          $price[sale ? 'addClass' : 'removeClass']('price--sale');
  
          if(sale) {
              let formatedCompareAtPrice = Shopify.formatMoney(compare_at_price_origin, theme.moneyFormat);
            
              html += '<span>';
              html += formatedCompareAtPrice;
              html += '</span>';
  
              if($price[0].hasAttribute('data-js-show-sale-separator')) {
                  html += theme.strings.price_sale_separator;
              }
          }
  
          let formatedPrice = Shopify.formatMoney(price_origin, theme.moneyFormat);
          
          html += '<span>';
          html += formatedPrice;
          html += '</span>';
  
          $price.html(html);
      }
  
      insertFull($price, data) {
          const {price, compare_at_price, unit_price, unit_price_measurement} = data,
              priceHTML = `<span>${Shopify.formatMoney(price, theme.moneyFormat)}</span>`,
              isSale = compare_at_price && parseInt(compare_at_price) > parseInt(price),
              compareAtPriceHTML = isSale ? `<span>${Shopify.formatMoney(compare_at_price, theme.moneyFormat)}</span>${theme.priceShowSaleSeparator ? theme.strings.price_sale_separator : ''}` : '';
  
          let resultHTML = `<span class="price${isSale ? ' price--sale' : ''}" data-js-product-price>${compareAtPriceHTML}${priceHTML}</span>`;
  
          if(unit_price) {
              resultHTML = resultHTML + `
                  <span class="price-unit d-block mt-5">
                      <label class="d-none">${theme.strings.unit_price}</label>
                      <span class="price-unit__price">
                          (<span>${Shopify.formatMoney(unit_price, theme.moneyFormat)}</span>
                          <span> / </span><span class="d-none"> ${theme.strings.price_sale_separator} </span>
                          <span>${(unit_price_measurement && unit_price_measurement.reference_value !== 1 ? unit_price_measurement.reference_value : '')}${(unit_price_measurement.reference_unit ? unit_price_measurement.reference_unit : '')})</span>
                      </span>
                  </span>
                  `;
          }
  
          $price.html(resultHTML);
      }
  };
      
  theme.AssetsLoader.onPageLoaded(function() {
      theme.ProductPrice = new ProductPrice;
  });
  function ProductQuantity() {
      this.selectors = {
          quantity: '.js-product-quantity'
      };
  
      this.load();
  };
  
  ProductQuantity.prototype = $.extend({}, ProductQuantity.prototype, {
      load: function() {
          var _ = this;
  
          $body.on('click', this.selectors.quantity + ' [data-control]', function(e) {
              var $this = $(this),
                  $quantity = $this.parents(_.selectors.quantity),
                  $input = $quantity.find('input'),
                  direction = $this.attr('data-control'),
                  min = $input.attr('min') || 0,
                  max = $input.attr('max') || Infinity,
                  val = +$input.val(),
                  set_val;
  
              if(!$.isNumeric(val)) {
                  $input.val(min);
                  return;
              }
  
              if(direction === '+') {
                  set_val = ++val;
              } else if(direction === '-') {
                  set_val = --val;
              }
  
              if(set_val < min) {
                  set_val = min;
              } else if(set_val > max) {
                  set_val = max;
              }
  
              if(set_val < 0) {
                  set_val = 0;
              }
              
              $input.val(set_val);
              $input.trigger('custom.change');
  
              _.dublicate($quantity);
          });
  
          $(document).on('keydown', this.selectors.quantity + ' input', function (e) {
              var keyArr = [8, 9, 27, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
  
              if($.inArray(e.keyCode, keyArr) === -1) {
                  e.preventDefault();
                  return false;
              }
          });
  
          $(document).on('focus', this.selectors.quantity + ' input', function () {
              $(this).select();
          });
  
          $(document).on('blur', this.selectors.quantity + ' input', function () {
              var $this = $(this),
                  $quantity = $this.parents(_.selectors.quantity),
                  val = +$this.val(),
                  min = $this.attr('min') || 1,
                  max = $this.attr('max') || Infinity;
  
              if(!$.isNumeric(val) || val < min) {
                  $this.val(min);
              } else if(val > max) {
                  $this.val(max);
              }
  
              _.dublicate($quantity);
          });
      },
      dublicate: function ($quantity) {
          var connect = $quantity.attr('data-js-quantity-connect');
  
          if($quantity.length && connect !== undefined) {
              var $input = $(this.selectors.quantity + '[data-js-quantity-connect="' + connect + '"]').find('input'),
                  value = $quantity.find('input').val();
  
              $input.val(value);
              $input.trigger('custom.change');
          }
      }
  });
      
  theme.AssetsLoader.onPageLoaded(function() {
      theme.ProductQuantity = new ProductQuantity;
  });
  function ProductImagesNavigation() {
      this.selectors = {
          images_nav: '.js-product-images-navigation'
      };
  
      this.load();
  };
  
  ProductImagesNavigation.prototype = $.extend({}, ProductImagesNavigation.prototype, {
      load: function() {
          var _ = this;
  
          $body.on('click', '[data-js-product-images-navigation]:not([data-disabled])', function() {
              var $this = $(this),
                  $product = $this.parents('[data-js-product]'),
                  direction = $this.attr('data-js-product-images-navigation');
  
              theme.ProductImagesHover.disable($product.find('img'));
  
              var data = theme.ProductOptions.switchByImage($product, direction, null, function (data) {
                  _._updateButtons($product, data.is_first, data.is_last);
              });
          });
      },
      switch: function($product, data) {
          if(!data.update_variant.featured_image) return;
          
          var $image_container = $product.find('[data-js-product-image]'),
              $image,
              image,
              src,
              master_src;
  
          if($image_container.length) {
              $image = $image_container.find('img');
              image = data.update_variant.featured_image;
  
              theme.ProductImagesHover.disable($image);
  
              if(!image || !image.src) {
                  if(data.json.images[0]) {
                      image = data.json.images[0];
                  }
              }
  
              let width = $image_container.width();
  
              if(window.devicePixelRatio) {
                  width *= window.devicePixelRatio;
              }
  
              if(image && image.src && +image.id !== +$image.attr('data-image-id')) {
                  if(window.devicePixelRatio) {
                      src = Shopify.resizeImage(image.src, Math.ceil(width) + 'x');
                  } else {
                      src = Shopify.resizeImage(image.src, Math.ceil(width) + 'x') + ' 1x, ' + Shopify.resizeImage(image.src, Math.ceil($image_container.width()) * 2 + 'x') + ' 2x';
                  }
                  
                  master_src = Shopify.resizeImage(image.src, '{width}x');
  
                  this.changeSrc($image, src, image.id, master_src);
  
                  if($image.parents(this.selectors.images_nav).length) {
                      this._updateButtons($product, +data.json.images[0].id === +image.id, +data.json.images[data.json.images.length - 1].id === +image.id);
                  }
              }
          }
      },
      changeSrc: function ($image, srcset, id, master_src) {
          const $parent = $image.parents('[data-js-product-image]');
  
          id = id || 'null';
  
          theme.Preloader.set($parent, {
              delay: true,
              blur: true
          });
          
          $image.one('load', function () {
              theme.Preloader.unset($parent);
          });
          
          $image.attr('srcset', srcset).attr('data-image-id', id);
  
          if(master_src) {
              $image.attr('data-master', master_src);
          }
      },
      _updateButtons: function($product, is_first, is_last) {
          $product.find('[data-js-product-images-navigation="prev"]')[is_first ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
          $product.find('[data-js-product-images-navigation="next"]')[is_last ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
      }
  });
      
  theme.AssetsLoader.onPageLoaded(function() {
      theme.ProductImagesNavigation = new ProductImagesNavigation;
  });
  
  
  
  function ProductImagesHover() {
      this.selectors = {
          images_hover: '.js-product-images-hover',
          images_hovered_end: '.js-product-images-hovered-end'
      };
  
      this.load();
  };
  
  ProductImagesHover.prototype = $.extend({}, ProductImagesHover.prototype, {
      load: function() {
          function changeImage($wrap, $image, url, id) {
              var srcset = theme.LazyImage.buildSrcset($image[0], url);
  
              $wrap.attr('data-js-product-image-hover-id', $image.attr('data-image-id'));
  
              theme.ProductImagesNavigation.changeSrc($image, srcset, id);
          };
  
          theme.Global.responsiveHandler({
              namespace: '.product-collection.images.hover',
              element: $body,
              delegate: this.selectors.images_hover,
              on_desktop: true,
              events: {
                  'mouseenter': function() {
                      var $this = $(this),
                          $image = $this.find('.rimage > img'),
                          url = $this.attr('data-js-product-image-hover'),
                          id = $this.attr('data-js-product-image-hover-id');
  
                      if(url) {
                          changeImage($this, $image, url, id);
  
                          $this.one('mouseleave', function () {
                              var url = $image.attr('data-master'),
                                  id = $this.attr('data-js-product-image-hover-id');
                              
                              changeImage($this, $image, url, id);
                          });
                      }
                  }
              }
          });
  
          theme.Global.responsiveHandler({
              namespace: '.product-collection.images.hoveredend',
              element: $body,
              delegate: this.selectors.images_hovered_end,
              on_desktop: true,
              events: {
                  'mouseenter': function() {
                      var $this = $(this),
                          timeout;
  
                      timeout = setTimeout(function () {
                          $this.addClass('hovered-end');
                      }, theme.animations.css.duration * 1000);
  
                      $this.one('mouseleave', function () {
                          clearTimeout(timeout);
                      });
                  },
                  'mouseleave': function() {
                      $(this).removeClass('hovered-end');
                      theme.Preloader.unset($(this).find('[data-js-product-image]'));
                  }
              }
          });
      },
      disable: function ($image) {
          $image.parents(this.selectors.images_hover).removeClass('js-product-images-hover').unbind('mouseleave');
      }
  });
      
  theme.AssetsLoader.onPageLoaded(function() {
      theme.ProductImagesHover = new ProductImagesHover;
  });
  
  
  
  function Accordion() {
      this.settings = {
          elements: 'data-js-accordion',
          button: 'data-js-accordion-button',
          duration: function () {
              return theme.animations.accordion.duration * 1000;
          }
      };
  
      this.selectors = {
          elements: '[' + this.settings.elements + ']',
          button: '[' + this.settings.button + ']',
          content: '[data-js-accordion-content]',
          input: '[data-js-accordion-input]'
      };
  
      this.load();
  };
  
  Accordion.prototype = $.extend({}, Accordion.prototype, {
      load: function () {
          var _ = this,
              $desktopAsDropdownAll = $('[data-accordion-desktop-as-dropdown]');
  
          function toggle(e) {
              var $this = $(this),
                  $input = $this.find(_.selectors.input),
                  update_sticky = false,
                  $element = $this.parents(_.selectors.elements).first(),
                  accortionName = $element.attr('data-accordion-name'),
                  $desktopAsDropdown = $this.parents(`[data-accordion-desktop-as-dropdown="${accortionName}"]`);
  
              if ($input.length) {
                  if (e.target.tagName === 'INPUT') {
                      return;
                  } else if ($.contains($this.find('label')[0], e.target) && !$input.prop('checked') && $this.hasClass('open')) {
                      return;
                  }
              }
  
              var $content = $element.find(_.selectors.content);
  
              if($this.attr('data-js-accordion-select') !== 'all') {
                  $content = $content.first();
              }
              if ($content.is(':animated')) {
                  if($desktopAsDropdown.length) {
                      const $closeElements = $desktopAsDropdownAll.find(`[data-accordion-name="${accortionName}"]`).not($this);
                      $closeElements.parents(`[data-accordion-name="${accortionName}"]`).find(' > [data-js-accordion-button].open').removeClass('open');
                      $closeElements.parents(`[data-accordion-name="${accortionName}"]`).find(' > [data-js-accordion-content]').stop().addClass('d-none').removeAttr('style');
                  } else {
                      return;
                  }
              }
  
              $this.toggleClass('open');
  
              if($content.parents('.sticky-sidebar').length && !$desktopAsDropdown.length) {
                  update_sticky = true;
              }
  
              if ($this.hasClass('open')) {        
                  if($desktopAsDropdown.length && accortionName) {
                      $desktopAsDropdownAll.find(`[data-accordion-name="${accortionName}"] > [data-js-accordion-button].open`).not($this).trigger('toggle');
                  }
                  
                  $content.hide().removeClass('d-none').slideDown({
                      duration: $desktopAsDropdown.length ? 300 : _.settings.duration(),
                      start: function () {
                          if(update_sticky && theme.StickySidebar) {
                              theme.StickySidebar.update('listener-enable');
                          }
                      },
                      step: function () {
                          if(update_sticky && theme.StickySidebar) {
                              theme.StickySidebar.update('listener-process');
                          }
                      },
                      complete: function () {
                          $content.removeAttr('style');
  
                          if (update_sticky && theme.StickySidebar) {
                              theme.StickySidebar.update('listener-disable');
                          }
                      }
                  });
              } else {
                  if($desktopAsDropdown.length) {
                      $content.fadeOut({
                          duration: 80,
                          complete: function () {
                              $content.addClass('d-none').removeAttr('style');
                          }
                      });
                  } else {
                      $content.slideUp({
                          duration: _.settings.duration(),
                          start: function () {
                              if(update_sticky && theme.StickySidebar) {
                                  theme.StickySidebar.update('listener-enable');
                              }
                          },
                          step: function () {
                              if(update_sticky && theme.StickySidebar) {
                                  theme.StickySidebar.update('listener-process');
                              }
                          },
                          complete: function () {
                              $content.addClass('d-none').removeAttr('style');
  
                              if (update_sticky && theme.StickySidebar) {
                                  theme.StickySidebar.update('listener-disable');
                              }
                          }
                      });
                  }
              }
  
              $element.find(_.selectors.button)
                  .not($this)
                  .not($element.find(_.selectors.content).find(_.selectors.button))
                  .add($element.find('[' + _.settings.button + '="inner"]'))
                  [$this.hasClass('open') ? 'addClass' : 'removeClass']('open');
          };
  
          if($desktopAsDropdownAll.length) {
              $body.on('mousedown.accordion', function (e) {
                  if(!$(e.target).parents('[data-js-accordion]').length) {
                      $desktopAsDropdownAll.each(function() {
                          const $this = $(this);
                          const accortionName = $this.attr('data-accordion-desktop-as-dropdown')
  
                          $this.find(`[data-accordion-name="${accortionName}"] > [data-js-accordion-button].open`).trigger('toggle');
                      });
                  }
              });
          }
  
          $body.on('click toggle', '[' + this.settings.elements + '="all"] ' + this.selectors.button, toggle);
          $body.on('close', '[' + this.settings.elements + '="all"] ' + this.selectors.button, toggle);
  
          theme.Global.responsiveHandler({
              namespace: '.accordion',
              element: '[' + this.settings.elements + '="only-mobile"] ' + this.selectors.button,
              on_mobile: true,
              events: {
                  'click toggle': toggle
              }
          });
      }
  });
  
  theme.AssetsLoader.onPageLoaded(function() {
      theme.Accordion = new Accordion;
  });
  
  
  class ProductItem extends HTMLElement {
      constructor() {
          super();
          
          this.update();
      }
  
      update() {
          if(theme.isLoaded) {
              theme.StoreLists.checkProductStatus(this);
          }
      }
  }
  
  theme.AssetsLoader.onPageLoaded(function() {
      customElements.define('product-item', ProductItem);
  });
  (function($){
  
      'use strict';
  
      function Form() {
          this.selectors = {
              body: '.input-checkbox-disable-body',
              checkbox: '.input-checkbox-disable-trigger'
          };
  
          this.load();
      };
  
      Form.prototype = $.extend({}, Form.prototype, {
          load: function() {
              const _ = this;
  
              $(this.selectors.body).on('mousedown', function(e) {
                  const $form = $(e.target).parents('form');
                  
                  if(!$form.length) return;
  
                  const $checkbox = $form.parent().find(_.selectors.checkbox);
  
                  if(!$checkbox.is(':checked')) {
                      $checkbox.addClass('error');
  
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                  }
              });
          }
      });
      
      theme.AssetsLoader.onPageLoaded(function() {
          theme.Form = new Form;
      });
  })(jQueryTheme);
})(jQueryTheme);