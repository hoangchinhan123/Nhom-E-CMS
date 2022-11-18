<?php
/**
 * Single view Company information box
 *
 * Hooked into single_job_listing_start priority 30
 *
 * @since  1.14.0
 */

if ( ! get_the_company_name() ) {
	return;
}
$robojob_lite_theme_options = robojob_lite_options();
$show_sidebar = $robojob_lite_theme_options['_job_sidebar'];
?>
<div class="single-company-wrap">

    <div class="single-company-details"><h3><?php echo __('Company Details', 'robojob-lite'); ?></h3></div>

    <div class="company" itemscope itemtype=<?php echo esc_url("http://data-vocabulary.org/Organization");?>>
        <?php
            if ($show_sidebar != 1 ) { ?>
                <div class="company-logo-wrap clear">
                    <?php the_post_thumbnail('medium'); ?>
                </div>
            <?php } else {
                the_post_thumbnail('medium', array( 'class' => 'company_logo' ));
            }
        ?>

        <div class="company_name">
            <?php if ( class_exists( 'Astoundify_Job_Manager_Companies' ) && '' != get_the_company_name() ) :
                        $companies   = Astoundify_Job_Manager_Companies::instance();
                        $company_url = esc_url( $companies->company_url( get_the_company_name() ) );?>

                        <a href="<?php echo $company_url; ?>" target="_blank"><?php the_company_name( '<strong itemprop="name">', '</strong>'); ?></a>
            <?php endif; ?>
        </div>
        <div class="single-job-tagline-wraps clear">

            <?php the_company_tagline( '<p class="tagline">', '</p>' ); ?>
            <p class="name tagline clear">
        		<?php if ( $website = get_the_company_website() ) : ?>
        			<a class="website" href="<?php echo esc_url( $website ); ?>" itemprop="url" target="_blank" rel="nofollow"><?php _e( 'Website', 'robojob-lite' ); ?></a>
        		<?php endif; ?>
        		<?php the_company_twitter(); ?>
        		<?php
        		if ( class_exists( 'Astoundify_Job_Manager_Companies' ) && '' != get_the_company_name() ) :
        			$companies   = Astoundify_Job_Manager_Companies::instance();
        			$company_url = esc_url( $companies->company_url( get_the_company_name() ) );
        		?>

        		<?php else : ?>
        			<?php the_company_name(); ?>
        		<?php endif; ?>
        	</p>
        </div>

    	<?php the_company_video(); ?>
    </div>

</div>
