<?php 

/**
 * Job listing in the loop.
 *
 * This template can be overridden by copying it to yourtheme/job_manager/content-job_listing.php.
 *
 * @see         https://wpjobmanager.com/document/template-overrides/
 * @author      Automattic
 * @package     wp-job-manager
 * @category    Template
 * @since       1.0.0
 * @version     1.34.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


global $post;
$term_list = wp_get_post_terms($post->ID, 'job_listing_category', array("fields" => "all"));

?>
<li <?php job_listing_class(); ?> data-longitude="<?php echo esc_attr( $post->geolocation_long ); ?>" data-latitude="<?php echo esc_attr( $post->geolocation_lat ); ?>">
	<a href="<?php the_job_permalink(); ?>">
		<?php the_company_logo(); ?>
		<div class="position">
			<h3><?php wpjm_the_job_title(); ?></h3>
			<div class="company">
				
			<?php the_company_name( '<strong>', '</strong> ' ); ?>
			 
			</div>
			
		</div>
		<div class="location">
		<svg class="svg-icon" viewBox="0 0 20 20">
							<path d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589"></path>
						</svg><?php the_job_location( false ); ?>
		</div>
		<ul class="meta">
			<?php do_action( 'job_listing_meta_start' ); ?>

			<?php if ( get_option( 'job_manager_enable_types' ) ) { ?>
				<?php $types = wpjm_get_the_job_types(); ?>
				<?php if ( ! empty( $types ) ) : foreach ( $types as $type ) : ?>
					<li class="job-type <?php echo esc_attr( sanitize_title( $type->slug ) ); ?>"><?php echo esc_html( $type->name ); ?></li>
				<?php endforeach; endif; ?>
			<?php } ?>
			<?php do_action( 'job_listing_meta_end' ); ?>
			<div class="job-date"><?php the_job_publish_date(); ?></div>
		</ul>
	</a>
</li>
