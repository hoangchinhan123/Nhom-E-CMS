<?php
/**
 *
 * Template Name: Frontpage
 * Description: A page template that displays the Homepage or a Front page as in theme main page with slider and some other contents of the
 * post.
 *
 * @package robojob lite
 */

	get_header();
	$robojob_lite_theme_options = robojob_lite_options();


    if ( function_exists('robojob_lite_banner_customizer') ) {
    	echo robojob_lite_banner_customizer();
   	}

   	if ( class_exists('WP_Job_Manager')) {
   		$count_posts = wp_count_posts('job_listing');
   		if($count_posts->publish != 0 ) :
		echo '<section class="job-widget section">
		    <div class="container">
				<div class="row">
				    <div class="col-md-12">';
		    			echo do_shortcode('[jobs show_filters="false"]');
		    		echo '</div>
		    	</div>
		    </div>
		</section>';
		endif;
    }

    	echo robojob_lite_cta_section();

		if ($robojob_lite_theme_options['blog_checkbox'] == 1 ) :
			echo robojob_lite_latest_blog();
		endif;

get_footer();