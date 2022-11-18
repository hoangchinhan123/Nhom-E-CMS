<?php
/**
 * The template for displaying all single company.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package robojob lite
 */

get_header();

global $post;
    $robojob_lite_theme_options = robojob_lite_options();
    $post_a_job_link = $robojob_lite_theme_options['post_a_job_link'];
    $show_sidebar = $robojob_lite_theme_options['_job_sidebar'];
    if ($show_sidebar == 1 ) {
            $company_class = 'col-md-8 single-job-full-page';
        }
    else {
            $company_class = 'col-md-12 fullpage';
    }
    $post_ID = get_the_ID();

    if ( is_plugin_active('wp-job-manager/wp-job-manager.php') && class_exists( 'Astoundify_Job_Manager_Companies' )) {
        $company_website = get_post_meta( $post_ID, '_company_website', true);
        $company_name = get_post_meta( $post_ID, '_company_name', true);
        $company_tagline = get_post_meta( $post_ID, '_company_tagline', true);
        $location = get_post_meta( $post_ID, '_job_location', true);
        $company_twitter = get_post_meta( $post_ID, '_company_twitter', true);
        $job_types = wp_get_post_terms( $post_ID, 'job_listing_type', 'all' );
        foreach ($job_types as $job_type ) {
           $job_type_name = $job_type->name;
           $job_type_slug = $job_type->slug;
        }
        $company_video = get_the_company_video();
    }
?>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                <?php if ( is_plugin_active('wp-job-manager/wp-job-manager.php') && class_exists( 'Astoundify_Job_Manager_Companies' ) ) { ?>
                    <h1><?php echo esc_html($company_name);?></h1>
                    <?php if ($company_tagline ) : ?>
                        <h4><?php echo esc_html($company_tagline); ?></h4>
                    <?php endif; ?>
                    <div class="page-header-meta">
                        <h4>

                            <ul class="job-meta">
                                <?php if ( ! empty($company_name) ) { ?>
                                    <li class="job-company">
                                        <i class="icon-link"></i>
                                        <a href="<?php echo esc_url(get_the_company_website()); ?>" target="_blank"><?php esc_html_e( 'Website', 'robojob-lite' ); ?></a>
                                    </li>
                                <?php } ?>
                                <?php if ( ! empty($location) ) { ?>
                                    <li class="location">
                                        <i class="icon ion-ios-location"></i>
                                        <a class="google_map_link" href="#" target="_blank"><?php echo esc_html($location); ?></a>
                                    </li>
                                <?php } ?>
                                <?php if ( $company_twitter ) { ?>
                                    <li class="twitter">
                                        <a href="http://twitter.com/<?php echo esc_attr($company_twitter); ?>"><i class="fa fa-twitter"></i> <?php echo esc_html($company_twitter); ?> </a>
                                    </li>
                                <?php } ?>

                            </ul>

                        </h4>
                    </div>
                <?php } else { echo '<h1>'; the_title(); echo '</h1>';} ?>
                </div>
            </div>
        </div>

       <?php if ( !empty($post_a_job_link) ) { ?>
            <div class="pagehead-button">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?><?php echo esc_html($post_a_job_link);?>/" class="btn btn-primary btn-lg"><?php esc_html_e('Post a job', 'robojob-lite'); ?></a>
            </div>
        <?php } ?>
    </section>
    <!-- End Page Header -->


    <section class="section section-content job-widget section-company-page">
        <div class="container">
            <div class="row">

                <div id="primary" class="content-area <?php echo esc_attr($company_class); ?> ">
                    <main id="main" class="site-main job-page-wrap" role="main">
                    <?php if ($company_video && is_plugin_active('wp-job-manager/wp-job-manager.php') && class_exists( 'Astoundify_Job_Manager_Companies' ) ) { ?>
                        <div class="entry-featured-video">
                             <?php the_company_video();?>
                        </div>
                    <?php } ?>

                    <?php if ( have_posts() ) : ?>
                        <?php if (is_plugin_active('wp-job-manager/wp-job-manager.php') && class_exists( 'Astoundify_Job_Manager_Companies' )) { ?>
                            <div class="entry-header">
                                <h2 class="entry-title">
                                    <?php printf( _n( '%d Job Available', '%d Jobs Available', esc_attr($wp_query->found_posts), 'robojob-lite' ), esc_attr($wp_query->found_posts) ); ?>
                                </h2>
                            </div>
                        <?php } ?>

						<div class="job_listings">
							<ul class="job_listings">
			                    <?php
			                        while ( have_posts() ) : the_post();

                                    if (is_plugin_active('wp-job-manager/wp-job-manager.php') && class_exists( 'Astoundify_Job_Manager_Companies' )) {

			                            get_job_manager_template_part( 'content', 'job_listing' );

                                    } else {

                                        get_template_part( 'template-parts/content-single');

                                    }

			                            // If comments are open or we have at least one comment, load up the comment template.
			                            if ( comments_open() || get_comments_number() ) :
			                            comments_template();
			                            endif;

			                        endwhile; // End of the loop.
			                    ?>
			                </ul>
			            </div>
			        <?php endif; ?>
                    </main>
                    <!-- End Main -->
                </div>
                <!-- End Primary -->

                <?php   if ( is_plugin_active('wp-job-manager/wp-job-manager.php') ) {
                            if ($show_sidebar == 1 ) {
                                 if ( is_active_sidebar( 'sidebar-jobs' ) ) { ?>
                                    <div id="secondary" class="col-md-4">
                                        <?php dynamic_sidebar('sidebar-jobs'); ?>
                                    </div>
                                <?php }
                            }
                        } else { robojob_lite_sidebar_single(); } ?>
                <!-- End Secondary -->

            </div>
            <!-- End Row -->
        </div>
        <!-- End Container -->
    </section>
    <!-- End Section Content -->

<?php
get_footer();
