/*
 * Navigation Specific JavaScript
*/
jQuery(document).ready(function($) {
	
	
	/**
	 * Open search panel and focus cursor
	 */
	$('#search-toggle').click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$this.toggleClass('active');
		$('.search-form').slideToggle(300);
		$('.search-field')[0].focus();	
	});
	
	
	/**
	 * Mobile menu toggle
	 */
	$('#menu-toggle').click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$this.toggleClass('active');
		$('.main-nav').slideToggle(300);
	});
	
	
	/**
	 * Sub menu functionality for touch screen
	 */
	$('.main-nav').find('a').on('focus blur', function() {
		$( this ).parents('.menu-item, .page_item').toggleClass('focus');
	});
	if ( 'ontouchstart' in window ) {
		$('body').on( 'touchstart', '.menu-item-has-children > a', function(e) {
			var el = $( this ).parent('li');
			if ( ! el.hasClass('focus') ) {
				e.preventDefault();
				el.toggleClass('focus');
				el.siblings('.focus').removeClass('focus');
			}
		});
	}
	
	
	/**
	 * Scroll to Top
	 */ 
	$(topScroll = function() {
		$('.scrollTop').click(function(e){
			$('html, body').animate({ // html for ie, ff. body for chrome safari
				scrollTop: 0
			}, 500); 
		});
	});
	
	
});
!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof exports ? module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
	
    /* svg4everybody v2.1.0 | github.com/jonathantneal/svg4everybody */
    function embed(svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.getAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            svg.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    // embed the target into the svg
                    embed(item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], svg = use.parentNode;
                if (svg && /svg/i.test(svg.nodeName)) {
                    var src = use.getAttribute("xlink:href");
                    // if running with legacy support
                    if (nosvg) {
                        // create a new fallback image
                        var img = document.createElement("img");
                        // force display in older IE
                        img.style.cssText = "display:inline-block;height:100%;width:100%", // set the fallback size using the svg size
                        img.setAttribute("width", svg.getAttribute("width") || svg.clientWidth), img.setAttribute("height", svg.getAttribute("height") || svg.clientHeight),
                        // set the fallback src
                        img.src = fallback(src, svg, use), // replace the <use> with the fallback image
                        svg.replaceChild(img, use);
                    } else {
                        if (polyfill && (!opts.validate || opts.validate(src, svg, use))) {
                            // remove the <use> element
                            svg.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(svg, document.getElementById(id));
                            }
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            requestAnimationFrame(oninterval, 67);
        }
        var nosvg, fallback, opts = Object(rawopts);
        fallback = opts.fallback || function(src) {
            return src.replace(/\?[^#]+/, "").replace("#", ".").replace(/^\./, "") + ".png" + (/\?[^#]+/.exec(src) || [ "" ])[0];
        }, nosvg = "nosvg" in opts ? opts.nosvg : /\bMSIE [1-8]\b/.test(navigator.userAgent),
        nosvg && (document.createElement("svg"), document.createElement("use"));
        // set whether the polyfill will be activated or not
        var polyfill, olderIEUA = /\bMSIE [1-8]\.0\b/, newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
        polyfill = "polyfill" in opts ? opts.polyfill : olderIEUA.test(navigator.userAgent) || newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use");
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    return svg4everybody;
});
/*
 * Put all your regular jQuery in here.
*/
jQuery(document).ready(function($) {
	
	/**
    * fallback for SVG icons in IE
    */
    svg4everybody();
    
    
    /**
	* Responsive image loading
	*
	* <img class="lazy" data-small-src="SRC" data-large-src="SRC" alt=""/>
	*/
	var mobileBreakpoint = 500,
	//size = window.innerWidth < mobileBreakpoint ? 'mobile' : 'desktop',
	$images = $('.lazy');

	$images.each(function() {
	    //var url = $(this).attr('data-' + size + '-src');
	    var url = $(this).attr('data-lazy-src');
	    $(this).attr('src', url);
	});
	
	
	/**
     * Expandable Blocks FAQ
     */
    $('.faq-block .question').click(function(e) {
        e.preventDefault();
		var hasOpen = $(this).hasClass('open');
		var answer = $(this).next('.answer');
        // close all the others
        $('.faq-block .question.open').removeClass('open');
        $('.answer.shown').slideUp();
        if (!hasOpen) {
            $(this).addClass('open');
            answer.slideDown().addClass('shown');
        }
    });
    
    
	/**
	 * Share links
	 */
	$('.share-links').each(function() {
	    // Select the text area on click
	    $(this).on('click', '.share-url', function() {
	        $(this).select();
	    });
	
	    // Open share links in new window
	    $('a', this).click(function(e) {
	        e.preventDefault();
	        window.open($(this).attr('href'), 'Share', 'height=480, width=560, top=' + ($(window).height() / 2 - 230) + ', left=' + $(window).width() / 2 + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
	    });
	});
	
	
	/**
     * Open External Links In New Window
     */
    $('a').each(function() {
        // don't open mailto links in new window.
        if ((this.href.indexOf("mailto:") == -1) && (this.href.indexOf("netdna") == -1)) {
            //console.log("not a mailto or netdns link... proceed.");
            var a = new RegExp('/' + window.location.host + '/');
            if (!a.test(this.href)) {
                $(this).click(function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(this.href, '_blank');
                });
            }
            // open PDF in new window
    		var b = /.*.pdf/;
            if (b.test(this.href) == true) {
                $(this).click(function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(this.href, '_blank');
                });
            }
        }
    });
    
	
}); /* end of as page load scripts */