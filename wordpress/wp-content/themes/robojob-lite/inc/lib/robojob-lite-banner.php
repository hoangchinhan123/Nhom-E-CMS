<?php
if ( ! function_exists('robojob_lite_banner_customizer') ) {
    function robojob_lite_banner_customizer() {
	        $robojob_lite_theme_options = robojob_lite_options();
	        $robojob_banner_page_slider_id = $robojob_lite_theme_options['banner_page_id'];
	        $find_a_job_link = $robojob_lite_theme_options['find_a_job_link'];
	        $post_a_job_link = $robojob_lite_theme_options['post_a_job_link'];
	        $post_thumbnail_id = get_post_thumbnail_id($robojob_banner_page_slider_id);
			$attachment = get_post_meta($post_thumbnail_id);
			$featured_image = wp_get_attachment_image_src($post_thumbnail_id , 'full');
	        $show_on_front = get_option('show_on_front');
	        if (!empty($robojob_banner_page_slider_id)) :
	            ?>
	            <section id="pixel-slider" class="pixel-slider section-parallax" <?php if( ! empty($featured_image) ) { echo 'style="background-image:url(' . esc_url($featured_image[0]) . ')"'; } ?>>

	                <div class="container">
	                    <div class="row">
	                        <div class="col-md-8 col-md-offset-2">

	                            <div class="slider-content">

	                                <div class="site-tagline calltoaction-block text-center">

	                                  <h1><?php echo esc_html(get_the_title($robojob_banner_page_slider_id)); ?></h1>

	                                <?php  if ( !empty($find_a_job_link) || !empty($post_a_job_link) ) {
		                                		if ( class_exists('WP_Job_Manager') ) {  ?>

				                                    <div class="c2a-btn">
				                                        <div class="btn-group btn-group-lg" role="group" aria-label="Call to action">
														<?php if ( !empty($find_a_job_link) ) { ?>
				                                          <a type="button" class="btn btn-default btn-lg" href="<?php echo esc_url( home_url( '/' ) ); ?><?php echo esc_html($find_a_job_link);?>"><?php echo esc_html_e('Find a job', 'robojob-lite'); ?></a>
														<?php } if ( !empty($find_a_job_link) && !empty($post_a_job_link) ) {?>
				                                          <span class="btn-circle btn-or"><?php echo esc_html_e('or', 'robojob-lite'); ?></span>
														<?php } if ( !empty($post_a_job_link) ) {?>
				                                          <a type="button" class="btn btn-primary btn-lg" href="<?php echo esc_url( home_url( '/' ) ); ?><?php echo esc_html($post_a_job_link);?>/"><?php echo esc_html_e('Post a job', 'robojob-lite'); ?></a>
														<?php } ?>
				                                        </div>
				                                    </div>

	                                <?php 		}

	                                		} ?>

	                                </div>
	                                <!-- End Calltoaction Block -->

	                                <!-- Add 'job-shortcode' class if you are using the shortcode instead of
	                                custom form. -->
	                                <?php if ( class_exists('WP_Job_Manager') ) { ?>
	                                            <div class="search-filter-wrap">
	                                                <?php get_template_part('template-parts/header','form'); ?>
	                                            </div>
	                                <?php } ?>

	                            </div>
	                            <!-- End Slide Content -->
	                        </div>
	                        <!-- End Col -->
	                    </div>
	                    <!-- End Row -->
	                </div>
	                <!-- End Container-->

	            </section>
	            <!-- End Pixel Slider -->
	            <?php
	        endif;
    }
}
