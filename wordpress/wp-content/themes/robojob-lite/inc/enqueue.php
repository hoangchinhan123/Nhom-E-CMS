<?php
/**
 * Theme enqueue functions.
 *
 * Add all the theme styles and scripts here.
 *
 * @package robojob lite
 */

// @import url(https://fonts.googleapis.com/css?family=Raleway:400,300,500,600,700);
if (!  function_exists('robojob_lite_fonts_url') ) {
	function robojob_lite_fonts_url() {
		$fonts_url = '';

		/* Translators: If there are characters in your language that are not
		* supported by Roboto, translate this to 'off'. Do not translate
		* into your own language.
		*/
		$raleway = _x( 'on', 'Raleway font: on or off', 'robojob-lite' );

		if ( 'off' !== $raleway ) {
			$font_families = array();

			if ( 'off' !== $raleway ) {
				$font_families[] = 'Raleway:400,300,500,600,700';
			}

			$query_args = array(
				'family' => urlencode( implode( '|', $font_families ) ),
				'subset' => urlencode( 'latin,latin-ext' ),
			);

			$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
		}

		return esc_url_raw( $fonts_url );
	}
}

if (! function_exists('robojob_lite_scripts')) {
  function robojob_lite_scripts() {

          global $post;
          $robojob_lite_theme_options = robojob_lite_options();
          // Load the font function
          wp_enqueue_style( 'robojob-lite-fonts', robojob_lite_fonts_url(), array(), null );
          // Enqueuing Styles
          wp_enqueue_style( 'robojob-lite-style', get_stylesheet_uri() );
           wp_enqueue_style( 'robojob-lite-chosen-css', get_template_directory_uri() . '/assets/css/chosen.css' );
          wp_enqueue_style( 'robojob-lite-css', get_template_directory_uri() . '/assets/css/robojob.css' );

           // Enqueuing Scripts
          wp_enqueue_script( 'robojob-lite-js', get_template_directory_uri() . '/assets/js/robojob.min.js', array( 'jquery', 'masonry' ), '20151215',true );
          wp_enqueue_script( 'robojob-app-js', get_template_directory_uri() . '/assets/js/app.js', array(), '', true);
          wp_dequeue_style( 'wp-job-manager-frontend' );
          wp_dequeue_style( 'wp-job-manager-resume-frontend' );

          // IE conditional statements
          wp_enqueue_script( 'robojob-lite-html5shiv', get_template_directory_uri().'/assets/js/custom/html5shiv.min.js', array(), '', false);
          wp_script_add_data( 'robojob-lite-html5shiv', 'conditional', 'lt IE 9' );

          wp_localize_script( 'robojob-lite-app-js', 'robojob_lite_global_url', array(
                    'ajaxURL' => admin_url( 'admin-ajax.php'),
                    )
          );

          // Load Comment Reply in singular pages
          // When comments are open.
          if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
                    wp_enqueue_script( 'comment-reply' );
          }

          // Loading dynamic styles
          $robojob_lite_theme_options    = robojob_lite_options();
          $robojob_banner_page_slider_id = $robojob_lite_theme_options['banner_page_id'];
          $post_thumbnail_id             = get_post_thumbnail_id($robojob_banner_page_slider_id);
          $attachment                    = get_post_meta($post_thumbnail_id);
          $banner_image_src              = wp_get_attachment_image_src($post_thumbnail_id , 'full');
          $banner_image                  = esc_url($banner_image_src[0]);
          $logo_height                   = esc_attr($robojob_lite_theme_options['logo_height']);

        $custom_css = "

            /*=============================================================
            Service, callout, blog, testimonial and calltoaction bg image
            ==============================================================*/


            .navbar-brand > img{
                max-height: ".$logo_height.";
            }

              /*====== Overrides ======*/
              .page-header .page-header-meta .tags-links a:hover,
              .page-header .page-header-meta .tags-links a:focus{
                        color: #fff;
              }
        ";
        if ( ! empty($banner_image_src) ) {
          $custom_css .=
            "
              footer.site-footer {
                  background-image: url($banner_image);
              }
            ";
        }

        // check for plugin using plugin name
        if ( class_exists('WP_Job_Manager_Colors') ) {
            /*
            ==============================
                  WPJob Manager
            ===============================*/
            // If Plugin is inactive
            $full_time = '#17bd80';
            $part_time = '#e74c3c';
            $internship = '#5bc0de';
            $freelance = '#3ebef1';
            $temporary = '#f0ad4e';
            $custom_css .= "
                .job-type,
                .single_job_listing .meta .job-type.freelance,
                .widget ul.job_listings li.job_listing .meta .job-type.freelance,
                div.job_listings .job-type.freelance,
                .job-type.freelance, .page-header .job-meta li.job-type.freelance{
                    border: 2px solid $freelance;
                    background: transparent;
                    padding: 5px 16px;
                    border-radius: 50px;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 13px;
                    letter-spacing: 1px;
                    line-height: 1.4;
                    transition: all 0.5s ease;
                    color: inherit;
                }
                .job-type:hover, .job-type:focus,
                .single_job_listing .meta .job-type:hover,
                .single_job_listing .meta .job-type:focus,
                .widget ul.job_listings li.job_listing .meta .job-type:hover,
                .widget ul.job_listings li.job_listing .meta .job-type:focus,
                div.job_listings .job-type:hover,
                div.job_listings .job-type:focus,
                .page-header .job-meta li.job-type.freelance{
                    background: $freelance;
                    color: #fff;
                }
                .single_job_listing .meta .job-type.full-time,
                .widget ul.job_listings li.job_listing .meta .job-type.full-time,
                div.job_listings .job-type.full-time,
                .job-type.full-time, .page-header .job-meta li.job-type.full-time{
                    border-color: $full_time;
                }
                .single_job_listing .meta .job-type.full-time:hover,
                .widget ul.job_listings li.job_listing .meta .job-type.full-time:hover,
                div.job_listings .job-type.full-time:hover,
                .single_job_listing .meta .job-type.full-time:focus,
                .widget ul.job_listings li.job_listing .meta .job-type.full-time:focus,
                div.job_listings .job-type.full-time:focus,
                .job-type.full-time:hover, .job-type.full-time:focus{
                    background: $full_time;
                }
                .single_job_listing .meta .job-type.part-time,
                .widget ul.job_listings li.job_listing .meta .job-type.part-time,
                div.job_listings .job-type.part-time,
                .job-type.part-time{
                    border-color: $part_time;
                }
                .single_job_listing .meta .job-type.part-time:hover,
                .widget ul.job_listings li.job_listing .meta .job-type.part-time:hover,
                div.job_listings .job-type.part-time:hover,
                .single_job_listing .meta .job-type.part-time:focus,
                .widget ul.job_listings li.job_listing .meta .job-type.part-time:focus,
                div.job_listings .job-type.part-time:focus,
                .job-type.part-time:hover, .job-type.part-time:focus,
                .page-header .job-meta li.job-type.part-time{
                    background: $part_time;
                }
                .single_job_listing .meta .job-type.temporary,
                .widget ul.job_listings li.job_listing .meta .job-type.temporary,
                div.job_listings .job-type.temporary,
                .job-type.temporary{
                border-color: $temporary;
                }
                .single_job_listing .meta .job-type.temporary:hover,
                .widget ul.job_listings li.job_listing .meta .job-type.temporary:hover,
                div.job_listings .job-type.temporary:hover,
                .single_job_listing .meta .job-type.temporary:focus,
                .widget ul.job_listings li.job_listing .meta .job-type.temporary:focus,
                div.job_listings .job-type.temporary:focus,
                .job-type.temporary:hover, .job-type.temporary:focus,
                .page-header .job-meta li.job-type.temporary{
                    background: $temporary;
                }
                .single_job_listing .meta .job-type.internship,
                .widget ul.job_listings li.job_listing .meta .job-type.internship,
                div.job_listings .job-type.internship,
                .job-type.internship{
                    border-color: $internship;
                }
                .single_job_listing .meta .job-type.internship:hover,
                .widget ul.job_listings li.job_listing .meta .job-type.internship:hover,
                div.job_listings .job-type.internship:hover,
                .single_job_listing .meta .job-type.internship:focus,
                .widget ul.job_listings li.job_listing .meta .job-type.internship:focus,
                div.job_listings .job-type.internship:focus,
                .job-type.internship:hover, .job-type.internship:focus,
                .page-header .job-meta li.job-type.internship{
                    background: $internship;
                }

            ";
        }


        wp_add_inline_style( 'robojob-lite-css', $custom_css );

  }
  add_action( 'wp_enqueue_scripts', 'robojob_lite_scripts', 100 );
}
