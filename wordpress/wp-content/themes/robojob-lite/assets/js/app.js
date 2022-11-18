/*jslint node: true */
"use strict";

$ = jQuery.noConflict();

// Cache the DOM and common elements
var body = jQuery('body');
var site_head = jQuery('#site-header');
var site_navigation = jQuery('#site-navigation');
var niceSelector = jQuery("#job-widget ul.job_listings");
var masongrid = $('#grid-view ul.job_listings');
var clickElement = jQuery('.load_more_jobs, .btn-apply');
var radioCheck = jQuery('input[type="checkbox"], input[type="radio"]');
var responsiveTable = jQuery('#job-manager-job-dashboard .job-manager-jobs thead tr th');
var chosenElement = jQuery('.custom_search_categories #search_category');
var chosenElementNoSearch = jQuery('.widget select, #user_title, #resume_id');
var mobileMenu = jQuery('#sidr');
var mobileMenuAvatar = jQuery("#sidr .menu-item-avatar ul");

/********************************
Window Ready Functions
*********************************/
(function($) {

  // Mobile Navigation.
  mobileMenu.find('li.menu-header-search').addClass('hello hide');
  mobileMenuAvatar.removeClass('dropdown-menu');

  // Entry Content Filter
  $('.entry-content p:empty').remove();

  /*** Common Prerequiste - Global ***/
  jQuery('html').removeClass('norobo-js').addClass('robo-js');
  preventDefClick();

  //Scroll to top
  toTop();
  //Smooth Scroll to section
  smoothScroll();

  // Bootstrap Tooltip - Init
  $('[data-toggle="tooltip"]').tooltip();

  /*** Header Functions ***/
  // Header Affix
  site_head.affix({
    offset: {
      top: function() {
        // Return the dynamic height of the header.

        return (this.top = site_head.outerHeight(true) + 5);
      }
    }
  });

  $('<span class="dropdown-caret"></span>').appendTo($("#sidr li.menu-item-has-children > a"));

  $("#sidr ul.menu .dropdown-caret").on('click', function(event) {
    event.preventDefault();
    $(this).toggleClass('open');
    $(this).parent().next('.sub-menu').toggleClass('open');
  });

  // Extending Bootstrap dropdown menu
  extendTheNav();

  // Offcanvas mobile navigation
  jQuery('.thebtn').sidr({
    side: 'right',
    body: '.offcanvas-wrap'
  });

  // Slick Carousels

  $('.client-carousel').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: true,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 3
      }
    }, {
      breakpoint: 768,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        arrows: false,
        dots: true
      }
    }]
  });

  $('.robo-carousel').slick({
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 4000,
  });

  $('.single-item-testimonial').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: false,
    dots: true,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 1
      }
    }, {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }]
  });

  $('#featured-jobs-carousel').slick({
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: false,
    dots: true,
    responsive: [{
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    }, {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }]
  });

  $('.step-slider-content').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: '.step-slider-nav',
    speed: 800
  });

  $('.step-slider-nav').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '.step-slider-content',
    focusOnSelect: true,
    adaptiveHeight: true
  });

  // Featured Companies Masonry
  featuredCompaniesMason();

  // Testimonial Archive Mason
  featuredTesimonialMason();


  // Reinit Masonry jobListGrid(); when loadmore button is clicked.
  $('#grid-view .load_more_jobs').on('click', function () {
    console.log('hello');
    jobListGrid();
  });

  // Scrollbox
  jQuery("#list-view ul.job_listings").perfectScrollbar({
    includePadding: true,
    wheelSpeed: 20
  });

  //Update the scrollbox when loadmore button is clicked.
  $('.load_more_jobs').on('click', function() {
    console.log('hello');
    jQuery("#list-view ul.job_listings").perfectScrollbar('update');
  });

  // Fitvids
  responsiveIframe();
  $(".fluid-media").fitVids();


  //Chosen - Custom Form
  chosenElement.chosen();
  chosenElementNoSearch.chosen({
    disable_search: true
  });

  $('.menu-header-search a').on('click', function(e) {
    e.preventDefault();
    $('#header-search-wrap').toggleClass('show');
    $('#header-search-wrap').find('input[type="search"]').focus();
  });


  /*** Resize Function ***/
  $(window).resize(function() {
    // console.log('yeah resized');
  });

  // Parallax effect as seen in http://untame.net/2013/04/how-to-integrate-simple-parallax-with-twitter-bootstrap/
  $('section[data-type="background"]').each(function(){
   // declare the variable to affect the defined data-type
   var $scroll = $(this);
    $(window).scroll(function() {
      // HTML5 proves useful for helping with creating JS functions!
      // also, negative value because we're scrolling upwards
      var yPos = -($(window).scrollTop() / $scroll.data('speed'));
      // background position
      var coords = '50% '+ yPos + 'px';
      // move the background
      $scroll.css({ backgroundPosition: coords });
    }); // end window scroll
  });  // end section function

  radioCheck.ionCheckRadio();

})(jQuery);

/********************************
Window Load Functions
*********************************/
$(window).load(function() {
  $('#sidr').removeClass('hidden');
  $('#wpadminbar').addClass('push');
  radioCheck.addClass('option-input');
  $('.loader').hide();
  $('#list-view ul.job_listings li.job_listing').css({"width": "100%", "left": "0"});
  jQuery("#list-view ul.job_listings").perfectScrollbar('update');
});

/********************************
Window Scroll Functions
*********************************/
$(window).scroll(function() {
  // Refresh Parallax Effect
  $(window).trigger('resize');
  headScroll();
});

/********************************
 Functions Declaration
*********************************/

// Global Functions
function preventDefClick() {
  clickElement.on('click', function(e) {
    e.preventDefault();
  });
}
// Back to top button Function
function toTop() {
  var scroll_top_duration = 900,
    //grab the "back to top" link
    $back_to_top = $('#to-top');
  //smooth scroll to top
  $back_to_top.on('click', function(event) {
    // console.log('take me to the top');
    event.preventDefault();
    $('body,html').animate({
      scrollTop: 0,
    }, scroll_top_duration);
  });
}

// 1. Extend the Main Navigation.
function extendTheNav() {
  jQuery('#site-navigation .dropdown').hover(function() {
    jQuery(this).children('.dropdown-menu').stop(true, true).show().addClass('animated-fast robofadeInDown');
    jQuery(this).toggleClass('open');
  }, function() {
    jQuery(this).children('.dropdown-menu').stop(true, true).hide().removeClass('animated-fast robofadeInDown');
    jQuery(this).toggleClass('open');
  });
}

// 3. Masonry Grid View
function jobListGrid() {
  // Masonry Grid
  masongrid.imagesLoaded(function() {
    masongrid.masonry({
      resizable: true,
      itemSelector: '.job_listing',
    });
    // Fade blocks in after images are ready (prevents jumping and re-rendering)
    $('.job_listing').fadeIn();
  });
}

// 4. Featured Companies - Masonary
function featuredCompaniesMason() {
  $('#robo_mason').imagesLoaded(function() {
    $('#robo_mason').masonry({
      resizable: true,
      itemSelector: '.mason-card',
    });
    // Fade blocks in after images are ready (prevents jumping and re-rendering)
    $('.mason-card').fadeIn();
  });
}
// Testimonial Mason
function featuredTesimonialMason() {
  $('#main.testimonial-mason').imagesLoaded(function() {
    $('#main.testimonial-mason').masonry({
      resizable: true,
      itemSelector: '.testimonial-archive',
    });
    // Fade blocks in after images are ready (prevents jumping and re-rendering)
    $('.testimonial-archive').fadeIn();
  });
}


// 5. Header Scroll
function headScroll() {
  // If Header height is greater or equals to Offset top
  // Then add the class scroll. We will use this scroll class
  // to animate the header while scrolling to top
  // Call this function in window.scroll()
  if (site_head.offset().top >= site_head.outerHeight(true)) {
    site_head.addClass('scroll');
  }
}

// 6. Fitvids
function responsiveIframe() {
  var videoSelectors = [
    'iframe[src*="player.vimeo.com"]',
    'iframe[src*="youtube.com"]',
    'iframe[src*="youtube-nocookie.com"]',
    'iframe[src*="kickstarter.com"][src*="video.html"]',
    'iframe[src*="screenr.com"]',
    'iframe[src*="blip.tv"]',
    'iframe[src*="dailymotion.com"]',
    'iframe[src*="viddler.com"]',
    'iframe[src*="qik.com"]',
    'iframe[src*="revision3.com"]',
    'iframe[src*="hulu.com"]',
    'iframe[src*="funnyordie.com"]',
    'iframe[src*="flickr.com"]',
    'embed[src*="v.wordpress.com"]'
    // add more selectors here
  ];

  var allVideos = videoSelectors.join(',');

  $(allVideos).wrap('<div class="fluid-media" />'); // wrap them all!
}


function smoothScroll(){
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
}
