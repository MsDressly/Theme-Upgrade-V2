/**
 * MsDressly Performance Optimization Script
 * Lazy loads heavy JavaScript libraries and optimizes resource loading
 */

(function() {
  'use strict';

  // Performance monitoring
  const perfData = {
    startTime: performance.now(),
    resourcesLoaded: []
  };

  // Utility function to load scripts dynamically
  function loadScript(src, callback, async = true) {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.onload = function() {
      perfData.resourcesLoaded.push(src);
      if (callback) callback();
    };
    document.body.appendChild(script);
  }

  // Utility function to load stylesheets
  function loadStylesheet(href, media = 'all') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = media === 'all' ? 'print' : media;
    link.onload = function() {
      this.media = 'all';
      perfData.resourcesLoaded.push(href);
    };
    document.head.appendChild(link);
  }

  // Lazy load images using Intersection Observer
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src], img[data-srcset]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.classList.add('lazy-image--loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without Intersection Observer
      images.forEach(function(img) {
        if (img.dataset.src) img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.classList.add('lazy-image--loaded');
      });
    }
  }

  // Defer non-critical JavaScript libraries
  function deferNonCriticalResources() {
    const deferredScripts = {
      // Only load Revolution Slider on pages that use it
      revolution: {
        check: () => document.querySelector('.rev_slider'),
        scripts: [
          '/assets/plugin.revolution.js',
          '/assets/plugin.revolution.s.min.js'
        ],
        styles: [
          '/assets/plugin.revolution.css'
        ]
      },
      // Only load Fotorama on product pages
      fotorama: {
        check: () => document.querySelector('.fotorama') || document.querySelector('.product__photos'),
        scripts: [
          '/assets/plugin.fotorama.js'
        ],
        styles: [
          '/assets/plugin.fotorama.css'
        ]
      },
      // Load slick carousel on demand
      slick: {
        check: () => document.querySelector('[data-slick]'),
        scripts: [
          '/assets/plugin.slick.js'
        ],
        styles: [
          '/assets/plugin.slick.css'
        ]
      }
    };

    // Check and load required libraries
    Object.keys(deferredScripts).forEach(key => {
      const lib = deferredScripts[key];
      if (lib.check()) {
        // Load styles first
        if (lib.styles) {
          lib.styles.forEach(style => loadStylesheet(style));
        }
        // Then load scripts
        if (lib.scripts) {
          lib.scripts.forEach(script => {
            loadScript(script);
          });
        }
      }
    });
  }

  // Optimize form interactions
  function optimizeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // Add loading states
      form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('loading--msdressly');
          submitBtn.disabled = true;
        }
      });
    });
  }

  // Preload next page on hover
  function preloadOnHover() {
    const links = document.querySelectorAll('a[href^="/"]');
    const preloadedUrls = new Set();

    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        const href = link.href;
        if (!preloadedUrls.has(href)) {
          const prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.href = href;
          document.head.appendChild(prefetch);
          preloadedUrls.add(href);
        }
      }, { passive: true });
    });
  }

  // Resource hints for critical third-party domains
  function addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//cdn.shopify.com' },
      { rel: 'preconnect', href: 'https://cdn.shopify.com' },
      { rel: 'dns-prefetch', href: '//fonts.shopifycdn.com' },
      { rel: 'preconnect', href: 'https://fonts.shopifycdn.com' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  // Performance monitoring and reporting
  function reportPerformance() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      const resourcesLoadTime = performance.now() - perfData.startTime;

      console.log('MsDressly Performance Metrics:');
      console.log(`Page Load Time: ${loadTime}ms`);
      console.log(`DOM Ready Time: ${domReadyTime}ms`);
      console.log(`Resources Optimization Time: ${resourcesLoadTime.toFixed(2)}ms`);
      console.log('Lazy Loaded Resources:', perfData.resourcesLoaded);

      // Send metrics to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          event_category: 'performance',
          event_label: 'load',
          value: loadTime
        });
      }
    }
  }

  // Remove loading class when page is ready
  function removeLoadingState() {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }

  // Initialize all optimizations
  function init() {
    // Critical optimizations - run immediately
    lazyLoadImages();
    optimizeForms();
    addResourceHints();

    // Defer non-critical optimizations
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        deferNonCriticalResources();
        preloadOnHover();
        removeLoadingState();
      });
    } else {
      deferNonCriticalResources();
      preloadOnHover();
      removeLoadingState();
    }

    // Report performance metrics after load
    window.addEventListener('load', function() {
      setTimeout(reportPerformance, 0);
    });
  }

  // Start optimizations
  init();

  // Expose performance API for debugging
  window.MsDresslyPerf = {
    getMetrics: () => perfData,
    reloadImages: lazyLoadImages,
    loadScript: loadScript,
    loadStylesheet: loadStylesheet
  };
})();