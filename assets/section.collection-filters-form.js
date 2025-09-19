(function($){

  'use strict';

  function onKeyUpEscape(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');

    if (!openDetailsElement) return;

    const summaryElement = openDetailsElement.querySelector('summary');
    openDetailsElement.removeAttribute('open');
    summaryElement.focus();
  }

  class CollectionFiltersForm extends HTMLElement {
    constructor() {
      super();
      this.filterData = [];
      this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

      this.debouncedOnSubmit = theme.debounce((event) => {
        this.onSubmitHandler(event);
      }, 500);
      this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
      window.addEventListener('popstate', this.onHistoryChange.bind(this));
      const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
      if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
    }

    onSubmitHandler(event) {
      event.preventDefault();
      const formData = new FormData(event.target.closest('form'));
      const searchParams = new URLSearchParams(formData).toString();
      this.renderPage(searchParams, event);
    }

    onActiveFilterClick(event) {
      event.preventDefault();
      const appendContent = event.currentTarget.classList.contains('js-append-content');

      if(Shopify.designMode && appendContent) return;

      const useFullHref = event.currentTarget.classList.contains('js-use-full-href');
      const updateURLHash = !appendContent;
      const collectionPagination = event.currentTarget.closest('collection-pagination');
      const scrollToTop = collectionPagination && !appendContent;
      this.toggleActiveFacets();
      this.renderPage(new URL(event.currentTarget.href).searchParams.toString(), 
        useFullHref ? event : null, 
        updateURLHash, 
        {
          appendContent,
          scrollToTop
        }
      );
    }

    onHistoryChange(event, searchParams) {
      if(!searchParams) {
        searchParams = event.state ? event.state.searchParams : '';
      }

      event.isHistoryChange = true;
      this.renderPage(searchParams, event, false);
    }

    toggleActiveFacets(disable = true) {
      document.querySelectorAll('.js-facet-remove').forEach((element) => {
        element.classList.toggle('disabled', disable);
      });
    }

    startRender() {
      this.isLoading = true;
      theme.Preloader.set(document.getElementById('CollectionProductGrid').parentNode, {
          fixed: true,
          spinner: theme.current.is_mobile ? false : null
      });

      if(theme.current.is_mobile) {
        theme.Preloader.set(document.getElementById('CollectionSidebar'), {
            fixed: true
        });
      }
    }

    endRender() {
      theme.Preloader.unset(document.getElementById('CollectionProductGrid').parentNode);

      if(theme.current.is_mobile) {
        theme.Preloader.unset(document.getElementById('CollectionSidebar'));
      }

      this.isLoading = false;
    }

    renderPage(searchParams, event, updateURLHash = true, params = {}) {
      this.startRender();
      const sections = this.getSections();
      const collectionProductCount = document.getElementById('CollectionProductCount');
      const countContainerDesktop = document.getElementById('CollectionProductCountDesktop');
      let pathname;
      let url;

      document.getElementById('CollectionProductGrid').classList.add('loading');
      if(collectionProductCount) {
        collectionProductCount.classList.add('loading');
      }
      if (countContainerDesktop){
        countContainerDesktop.classList.add('loading');
      }
      if(event) {
        if(!event.isHistoryChange && event.currentTarget && event.currentTarget.classList.contains('js-use-full-href')) {
          pathname = event.currentTarget.href;
        }
        if(event.isCollectionChanged || event.state && event.state.isCollectionChanged) {
          url = `${pathname ? pathname : window.location.pathname}${searchParams ? '?' : ''}${searchParams}`;
        }
      }
      if(!theme.collection.enable_ajax || event && event.reloadCollection || (Shopify.designMode && !params.appendContent)) {
        if(!url) {
          url = `${pathname ? pathname : window.location.pathname}${searchParams ? '?' : ''}${searchParams}`;
        }

        window.location.href = url;
        return;
      }
      
      sections.forEach((section) => {
        if(!url) {
          url = `${pathname ? pathname : window.location.pathname}?section_id=${section.section}&${searchParams}`;
        }

        const filterDataUrl = element => element.url === url;

        this.filterData.some(filterDataUrl) ?
          this.renderSectionFromCache(filterDataUrl, event, params) :
          this.renderSectionFromFetch(url, event, params);
      });
      
      if (updateURLHash) this.updateURLHash(searchParams, pathname);
    }

    renderSectionFromFetch(url, event, params) {
      fetch(url)
        .then(response => response.text())
        .then((responseText) => {
          const html = responseText.replace(/<script[^>]*>(?:(?!<\/script>)[^])*<\/script>/g, "");
          this.filterData = [...this.filterData, { html, url }];

          this.renderNavigation(html);
          this.renderShFilters(html);
          this.renderFilterSections(html);
          this.renderFilters(html, event);
          this.renderHeadings(html, event);
          this.renderProductGrid(html, event, params);
          this.renderProductCount(html);
          this.renderPagination(html);
          this.renderBreadcrumbs(html);
          this.endRender();
        });
    }

    renderSectionFromCache(filterDataUrl, event, params) {
      const html = this.filterData.find(filterDataUrl).html;

      this.renderNavigation(html);
      this.renderShFilters(html);
      this.renderFilterSections(html);
      this.renderFilters(html, event);
      this.renderHeadings(html, event);
      this.renderProductGrid(html, event, params);
      this.renderProductCount(html);
      this.renderPagination(html);
      this.renderBreadcrumbs(html);
      this.endRender();
    }

    renderHeadings(html, event) {
      if(!event || !window.renderCollectionPageHeadings) return;
      if(event.isCollectionChanged || event.state && event.state.isCollectionChanged) {
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

        renderCollectionPageHeadings(parsedHTML, true);
        theme.AssetsLoader.loadInlineStyles();
        document.querySelectorAll('[data-section-type="collection-page-heading"]').forEach(element => element.addEventListener('section:loaded', function () {
          if(theme.StickySidebar) theme.StickySidebar.update(null, 1);
        }));
      }
    }

    renderBuilders(html, event, params) {
      if (!window.renderCollectionPageBuilders) return;
      if (event && event.isCollectionChanged || event && event.state && event.state.isCollectionChanged) {
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

        renderCollectionPageBuilders(parsedHTML, false, true);
        document.querySelectorAll('.collection-page-builder-template--type-insert')
          .forEach(element => element.remove());
        parsedHTML.querySelectorAll('.collection-page-builder-template--type-insert')
          .forEach(element => document.body.appendChild(element.cloneNode(true)));
      } else if (!params.appendContent) {
        renderCollectionPageBuilders(undefined, true, true);
      }
    }

    renderProductGrid(html, event, params) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const collectionProductGrid = document.getElementById('CollectionProductGrid');
      const parsedHTMLCollectionProductGrid = parsedHTML.getElementById('CollectionProductGrid');

      if(theme.StickySidebar) theme.StickySidebar.update('listener-enable');
      if(theme.ProductsView) theme.ProductsView.update(parsedHTML);
      if(params.appendContent) {
        collectionProductGrid.innerHTML += parsedHTMLCollectionProductGrid.innerHTML;
      } else {
        collectionProductGrid.innerHTML = parsedHTMLCollectionProductGrid.innerHTML;
        collectionProductGrid.setAttribute('class', parsedHTMLCollectionProductGrid.getAttribute('class'));
      }
      if(params.scrollToTop) {
        const stickyHeader = document.querySelector('sticky-header'),
          header_h = stickyHeader && stickyHeader.getStickyHeight ? stickyHeader.getStickyHeight() : 0;

        $html.add($body).stop().animate({
          scrollTop: $(collectionProductGrid).offset().top - header_h,
          duration: theme.animations.pagination.scroll_duration * 1000
        });
      }

      this.renderBuilders(html, event, params);
      theme.LazyImage.update();
      if(theme.MultiCurrency) {
        theme.MultiCurrency.update();
    }

      if(theme.StickySidebar) {
        theme.StickySidebar.update('listener-process');
        theme.StickySidebar.update('listener-disable');
      }
      if(theme.Tooltip) theme.Tooltip.init();

      document.getElementById('CollectionProductGrid').classList.remove('loading');
    }

    renderProductCount(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const count = parsedHTML.getElementById('CollectionProductCount');
      const container = document.getElementById('CollectionProductCount');
      const containerDesktop = document.getElementById('CollectionProductCountDesktop');
      const containerMobileFilterButton = document.getElementById('CollectionProductCountMobileFilterButton');
      
      if(container) {
        container.innerHTML = count.innerHTML;
        container.classList.remove('loading');
      }
      if (containerDesktop) {
        containerDesktop.innerHTML = count.innerHTML;
        containerDesktop.classList.remove('loading');
      }
      if(containerMobileFilterButton) {
        containerMobileFilterButton.innerHTML = parsedHTML.getElementById('CollectionProductCountMobileFilterButton').innerHTML;
      }
    }

    renderFilters(html, event) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const facetDetailsElementsFromFetch = parsedHTML.querySelectorAll(
        '#CollectionFiltersForm .js-filter'
      );
      const facetDetailsElementsFromDom = document.querySelectorAll(
        '#CollectionFiltersForm .js-filter'
      );
      let processFacets = true;

      if(window.checkFilterAccordion && theme.current.is_desktop) window.checkFilterAccordion(parsedHTML, true);
      if(event) {
        if(event.isCollectionChanged || event.state && event.state.isCollectionChanged) {
          processFacets = false;
          const collectionFiltersForm = parsedHTML.querySelector('#CollectionFiltersForm');
    
          if(collectionFiltersForm) {
            if(theme.RangeOfPrice) theme.RangeOfPrice.destroy();
            document.querySelector('#CollectionFiltersForm').innerHTML = collectionFiltersForm.innerHTML;
            if(theme.RangeOfPrice) theme.RangeOfPrice.init();
          }
        }
      }
      if(processFacets) {
        const facetDetailsElements =
          parsedHTML.querySelectorAll('#CollectionFiltersForm .js-filter, #CollectionFiltersFormMobile .js-filter');

        // Remove facets that are no longer returned from the server
        Array.from(facetDetailsElementsFromDom).forEach((currentElement) => {
          const sidebarSection = currentElement.closest('.js-collection-sidebar-section');
          
          if(!sidebarSection) return;
          
          if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentElement.id === id)) {
            sidebarSection.classList.add('d-none');
          } else {
            sidebarSection.classList.remove('d-none');
          }
        });

        const matchesIndex = (element) => { 
          const jsFilter = event && !event.isHistoryChange ? event.target.closest('.js-filter') : undefined;
          return jsFilter ? element.dataset.index === jsFilter.dataset.index : false; 
        }
        const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
        const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

        // facetsToRender.forEach((element) => {
        //   document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
        // });

        facetsToRender.forEach((elementToRender, index) => {
          const currentElement = document.getElementById(elementToRender.id);
          // Element already rendered in the DOM so just update the innerHTML
          if (currentElement) {
            document.getElementById(elementToRender.id).innerHTML = elementToRender.innerHTML;
          } else {
            if (index > 0) {
              const { className: previousElementClassName, id: previousElementId } = facetsToRender[index - 1];
              // Same facet type (eg horizontal/vertical or drawer/mobile)
              if (elementToRender.className === previousElementClassName) {
                document.getElementById(previousElementId).after(elementToRender);
                return;
              }
            }
    
            if (elementToRender.parentElement) {
              document.querySelector(`#${elementToRender.parentElement.id} .js-filter`).before(elementToRender);
            }
          }
        });

        if(countsToRender) this.renderCounts(countsToRender, event.target.closest('.js-filter'));
        if(theme.RangeOfPrice) theme.RangeOfPrice.update();
      }

      this.renderActiveFacets(parsedHTML);
      this.renderAdditionalElements(parsedHTML);
    }

    renderFilterSections(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const collectionSidebarSection = document.querySelectorAll('.js-collection-sidebar-section');
      
      if(collectionSidebarSection.length) {
        collectionSidebarSection.forEach(element => {
          const parsedHTMLCollectionSidebarSection = parsedHTML.querySelector(`.js-collection-sidebar-section[data-index="${element.dataset.index}"]`);
          
          if(!parsedHTMLCollectionSidebarSection) {
            return;
          }
          
          if(parsedHTMLCollectionSidebarSection.classList.contains('d-none')) {
            element.classList.add('d-none');
          } else {
            element.classList.remove('d-none');
          }
        });
      }
    }

    renderShFilters(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const shFilter = document.querySelectorAll('.js-sh-filter');
      
      if(shFilter.length) {
        shFilter.forEach(element => {
          const parsedHTMLShFilter = parsedHTML.querySelector(`.js-sh-filter[data-index="${element.dataset.index}"]`);

          if(parsedHTMLShFilter) {
            element.innerHTML = parsedHTMLShFilter.innerHTML;
          }
        });
      }
    }

    renderNavigation(html) {
      const form = document.getElementById('CollectionLinksForm');

      if(!form) return;

      const elements = form.querySelectorAll('input');
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const parsedHTMLLinksElements = parsedHTML.querySelectorAll('#CollectionLinksForm input');

      elements.forEach((element, index) => {
        element.checked = parsedHTMLLinksElements[index].checked;

        if(element.checked) {
          const accordion = element.closest('[data-js-accordion]');

          if(accordion) {
            const button = accordion.querySelector('[data-js-accordion-button]');

            if(!button.classList.contains('open')) {
              $(button).trigger('toggle');
            }
          }
        }
      });
    }

    renderActiveFacets(html) {
      const activeFacetElementSelectors = ['#CollectionCurrentFilters', '#CollectionCurrentFiltersClone'];

      activeFacetElementSelectors.forEach((selector) => {
        const activeFacetsElement = html.querySelector(selector);
        
        if (!activeFacetsElement) return;
        
        document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
      });

      this.toggleActiveFacets(false);
    }

    renderPagination(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

      document.getElementById('CollectionPagination').innerHTML = parsedHTML.getElementById('CollectionPagination').innerHTML;
    }

    renderBreadcrumbs(html) {
      const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
      const collectionBreadcrumbs = document.getElementById('CollectionBreadcrumbs');

      if(collectionBreadcrumbs) {
        collectionBreadcrumbs.innerHTML = parsedHTML.getElementById('DynamicCollectionBreadcrumbs').innerHTML;
      }
    }

    renderAdditionalElements(html) {
      const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

      mobileElementSelectors.forEach((selector) => {
        if (!html.querySelector(selector)) return;
        document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
      });
    }

    renderCounts(source, target) {
      const countElementSelectors = ['.count-bubble', '.facets__selected'];
      countElementSelectors.forEach((selector) => {
        const targetElement = target.querySelector(selector);
        const sourceElement = source.querySelector(selector);

        if (sourceElement && targetElement) {
          target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
        }
      });
    }

    updateURLHash(searchParams, pathname) {
      if(pathname) {
        history.pushState({ searchParams }, '', `${pathname}`);
      } else {
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
      }
    }

    getSections() {
      return [
        {
          id: 'main-collection-product-grid',
          section: document.getElementById('main-collection-product-grid').dataset.id,
        }
      ]
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('collection-filters-form', CollectionFiltersForm);
  });
    
  class PriceRange extends HTMLElement {
    constructor() {
      super();
      this.querySelectorAll('input')
        .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));
      this.setMinAndMaxValues();
    }

    onRangeChange(event) {
      this.adjustToValidValues(event.currentTarget);
      this.setMinAndMaxValues();
    }

    setMinAndMaxValues() {
      const inputs = this.querySelectorAll('input');
      const minInput = inputs[0];
      const maxInput = inputs[1];
      if (maxInput.value) minInput.setAttribute('max', maxInput.value);
      if (minInput.value) maxInput.setAttribute('min', minInput.value);
      if (minInput.value === '') maxInput.setAttribute('min', 0);
      if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    }

    adjustToValidValues(input) {
      const value = Number(input.value);
      const min = Number(input.getAttribute('min'));
      const max = Number(input.getAttribute('max'));

      if (value < min) input.value = min;
      if (value > max) input.value = max;
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('price-range', PriceRange);
  });

  class FacetRemove extends HTMLElement {
    constructor() {
      super();
      this.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        const form = this.closest('collection-filters-form') || document.querySelector('collection-filters-form');
        form.onActiveFilterClick(event);
      });
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('facet-remove', FacetRemove);
  });

  class CollectionNavigationForm extends HTMLElement {
    constructor() {
      super();
      this.debouncedOnSubmit = theme.debounce((event) => {
        this.onSubmitHandler(event);
      }, 500);
      this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
    }

    onSubmitHandler(event) {
      event.preventDefault();

      const url = event.target.value;
      const collectionLinksForm = event.target.closest('#CollectionLinksForm');
      const form = document.querySelector('collection-filters-form');
      const formData = new FormData(form.querySelector('form'));
      const searchParams = new URLSearchParams(formData).toString();

      if(collectionLinksForm) {
        history.replaceState({ searchParams: searchParams, isCollectionChanged: true }, '', window.location.href);
        history.pushState({ searchParams: searchParams, isCollectionChanged: true }, '', url);
        form.onHistoryChange({ isCollectionChanged: true, reloadCollection: event.target.classList.contains('js-reload-collection') });
      } else {
        history.pushState({ searchParams: searchParams }, '', url);
        form.onHistoryChange({}, searchParams);
      }
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('collection-navigation-form', CollectionNavigationForm);
  });

  class CollectionSortingCloneForm extends HTMLElement {
    constructor() {
      super();

      this.debouncedOnSubmit = theme.debounce((event) => {
        this.onSubmitHandler(event);
      }, 500);
      this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
    }

    onSubmitHandler(event) {
      event.preventDefault();
      
      const formData = new FormData(event.target.closest('form'));
      const form = document.querySelector('collection-filters-form');

      form.querySelector('[name="sort_by"]').value = formData.get('sort_by_clone');
      form.querySelector('form').dispatchEvent(new Event('input'));
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('collection-sorting-clone-form', CollectionSortingCloneForm);
  });

  class CollectionPaginationItem extends HTMLElement {
    constructor() {
      super();
      this.querySelector('a').addEventListener('click', this.goToPage.bind(this));
      this.querySelector('a').addEventListener('loadmore', this.goToPage.bind(this));
    }

    goToPage(event) {
      event.preventDefault();
        
      const form = document.querySelector('collection-filters-form');
      form.onActiveFilterClick(event);
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('collection-pagination-item', CollectionPaginationItem);
  });

  class CollectionPagination extends HTMLElement {
    constructor() {
      super();
      if(this.dataset.paginationType === 'infinite_scroll') {
        setTimeout(() => window.addEventListener('scroll', this.onInfiniteScroll.bind(this)), 500);
      }
    }

    onInfiniteScroll() {
      if(this.getBoundingClientRect().top < theme.current.height) {
        const form = document.querySelector('collection-filters-form');

        if(!form || form.isLoading) return;

        const nextPageLink = this.querySelector('a');
        
        if(nextPageLink) {
          nextPageLink.dispatchEvent(new Event('loadmore'));
        }
      }
    }
  }

  theme.AssetsLoader.onPageLoaded(function() {
    customElements.define('collection-pagination', CollectionPagination);
  });
  
})(jQueryTheme);