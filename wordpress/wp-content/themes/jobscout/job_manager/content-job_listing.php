<?php

/**
 * Job listing in the loop.
 *
 * This template can be overridden by copying it to yourtheme/job_manager/content-job_listing.php.
 *
 * @see         https://wpjobmanager.com/document/template-overrides/
 * @author      Automattic
 * @package     WP Job Manager
 * @category    Template
 * @since       1.0.0
 * @version     1.27.0
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

global $post;
$job_salary   = get_post_meta(get_the_ID(), '_job_salary', true);
$job_featured = get_post_meta(get_the_ID(), '_featured', true);
$company_name = get_post_meta(get_the_ID(), '_company_name', true);

?>
<article class="top-job" <?php job_listing_class(); ?> data-longitude="<?php echo esc_attr($post->geolocation_lat); ?>"
    data-latitude="<?php echo esc_attr($post->geolocation_long); ?>">

    <figure class="company-logo">
        <?php the_company_logo('thumbnail'); ?>
    </figure>

    <div class="job-title-wrap">

        <h2 class="entry-title">
            <a href="<?php the_job_permalink(); ?>"><?php wpjm_the_job_title(); ?></a>
        </h2>

        <?php if ($company_name) { ?>
        <div class="company-name" style="padding-bottom: 5px;">
            <?php echo get_the_date('F j, Y', get_the_ID()); ?>
        </div>
        <div class="meta-company">
            <?php
				if (get_option('job_manager_enable_types')) {
					$types = wpjm_get_the_job_types();
					if (!empty($types)) : foreach ($types as $jobtype) : ?>
            <span class="category"><?php echo esc_html($jobtype->name); ?></span>
            <?php endforeach;
					endif;
				}
				do_action('job_listing_meta_end');
				?>
            <span class="name-company"><?php the_company_name(); ?></span>
            <span class="location"><?php the_job_location(true); ?></span>
        </div>
        <?php } ?>
    </div>
    <div class="description">
        <?php wpjm_the_job_description(); ?>
    </div>

    <?php if ($job_featured) { ?>
    <div class="featured-label"><?php esc_html_e('Featured', 'jobscout'); ?></div>
    <?php } ?>

</article>