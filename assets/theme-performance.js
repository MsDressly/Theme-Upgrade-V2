/**
 * Theme Performance Optimization Script
 * Handles lazy loading, intersection observers, and performance monitoring
 */

(function() {
  'use strict';

  // Performance monitoring
  const ThemePerformance = {
    marks: {},
    
    mark: function(name) {
      if (window.performance && window.performance.mark) {
        window.performance.mark(name);
        this.marks[name] = Date.now();
      }
    },
    
    measure: function(name, startMark, endMark) {
      if (window.performance && window.performance.measure) {
        try {
          window.performance.measure(name, startMark, endMark);
        } catch(e) {
          // Measurement failed silently
        }
      }
    }
  };

  // Lazy loading utility
  const LazyLoader = {
    observer: null,
    
    init: function() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
          rootMargin: '50px 0px',
          threshold: 0.1
        });
        
        // Observe lazy load elements
        document.querySelectorAll('[data-lazy]').forEach(el => {
          this.observer.observe(el);
        });
      } else {
        // Fallback for older browsers
        this.loadAllLazy();
      }
    },
    
    handleIntersection: function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    },
    
    loadElement: function(element) {
      const src = element.dataset.lazy;
      const srcset = element.dataset.lazySrcset;
      
      if (element.tagName === 'IMG') {
        if (srcset) {
          element.srcset = srcset;
        }
        if (src) {
          element.src = src;
        }
        element.classList.add('lazy-loaded');
      } else if (element.tagName === 'SCRIPT') {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
      }
    },
    
    loadAllLazy: function() {
      document.querySelectorAll('[data-lazy]').forEach(this.loadElement);
    }
  };

  // Resource loading optimization
  const ResourceLoader = {
    loadedResources: new Set(),
    
    loadCSS: function(href, media = 'all') {
      if (this.loadedResources.has(href)) return;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = media === 'all' ? 'print' : media;
      link.onload = function() {
        if (media === 'all') {
          this.media = 'all';
        }
      };
      document.head.appendChild(link);
      this.loadedResources.add(href);
    },
    
    loadJS: function(src, async = true) {
      if (this.loadedResources.has(src)) return;
      
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
        this.loadedResources.add(src);
      });
    },
    
    preloadResource: function(href, as, type = null) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    }
  };

  // Theme initialization
  const ThemeInit = {
    isLoaded: false,
    
    init: function() {
      if (this.isLoaded) return;
      
      ThemePerformance.mark('theme:init:start');
      
      // Initialize components
      this.initLazyLoading();
      this.initPerformanceOptimizations();
      this.initAccessibility();
      
      // Mark as loaded
      this.isLoaded = true;
      document.body.classList.add('theme-loaded');
      
      ThemePerformance.mark('theme:init:end');
      ThemePerformance.measure('theme:init:duration', 'theme:init:start', 'theme:init:end');
    },
    
    initLazyLoading: function() {
      LazyLoader.init();
    },
    
    initPerformanceOptimizations: function() {
      // Optimize font loading
      if ('fontDisplay' in document.documentElement.style) {
        document.documentElement.style.fontDisplay = 'swap';
      }
      
      // Add loading attribute to images
      document.querySelectorAll('img:not([loading])').forEach(img => {
        img.loading = 'lazy';
      });
      
      // Preload critical resources on interaction
      this.preloadOnInteraction();
    },
    
    initAccessibility: function() {
      // Add skip to content link if not present
      if (!document.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#MainContent';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to content';
        document.body.insertBefore(skipLink, document.body.firstChild);
      }
      
      // Improve focus management
      document.addEventListener('keydown', this.handleKeydown);
    },
    
    preloadOnInteraction: function() {
      const preloadOnInteraction = (event) => {
        // Preload non-critical resources on first user interaction
        ResourceLoader.preloadResource('/assets/theme-m.s.min.css', 'style');
        
        // Remove event listeners after first interaction
        document.removeEventListener('scroll', preloadOnInteraction, { passive: true });
        document.removeEventListener('touchstart', preloadOnInteraction, { passive: true });
        document.removeEventListener('click', preloadOnInteraction);
      };
      
      document.addEventListener('scroll', preloadOnInteraction, { passive: true, once: true });
      document.addEventListener('touchstart', preloadOnInteraction, { passive: true, once: true });
      document.addEventListener('click', preloadOnInteraction, { once: true });
    },
    
    handleKeydown: function(e) {
      // Escape key handling
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          activeModal.classList.remove('active');
        }
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ThemeInit.init.bind(ThemeInit));
  } else {
    ThemeInit.init();
  }

  // Export to global scope
  window.ThemePerformance = ThemePerformance;
  window.ResourceLoader = ResourceLoader;
  window.LazyLoader = LazyLoader;

})();

// Image optimization helper
function optimizeImages() {
  const images = document.querySelectorAll('img[data-src], img[data-srcset]');
  
  images.forEach(img => {
    // Add intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            
            if (image.dataset.src) {
              image.src = image.dataset.src;
              image.removeAttribute('data-src');
            }
            
            if (image.dataset.srcset) {
              image.srcset = image.dataset.srcset;
              image.removeAttribute('data-srcset');
            }
            
            image.classList.add('loaded');
            observer.unobserve(image);
          }
        });
      });
      
      imageObserver.observe(img);
    }
  });
}

// Critical path CSS injection
function injectCriticalCSS() {
  const criticalCSS = `
    .above-fold { opacity: 1; }
    .below-fold { opacity: 0; transition: opacity 0.3s ease; }
    .loaded .below-fold { opacity: 1; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
  optimizeImages();
  injectCriticalCSS();
});

// Service Worker registration for caching (if supported)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Register service worker for caching (implementation would be in separate file)
    // navigator.serviceWorker.register('/sw.js');
  });
} 