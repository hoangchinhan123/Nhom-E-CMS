<?php
/**
 * The template for displaying all single job posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package robojob lite
 */

get_header();
    $robojob_lite_theme_options = robojob_lite_options();
    $show_sidebar = $robojob_lite_theme_options['_job_sidebar'];
    if ($show_sidebar == 1 ) {
        $sidebar_class = 'col-md-8';
    } else {
         $sidebar_class = 'col-md-12 fullpage single-job-full-page';
    }
    global $post;
    $post_ID = get_the_ID();
        if ( is_plugin_active('wp-job-manager/wp-job-manager.php') ) {
            $company_website = get_post_meta( $post_ID, '_company_website', true);
            $tagline = get_post_meta( $post_ID, '_company_tagline', true);
            $company_name = get_post_meta( $post_ID, '_company_name', true);
            $location = get_post_meta( $post_ID, '_job_location', true);
            $company_video = get_post_meta( $post_ID, '_company_video', true);
            $job_types = wp_get_post_terms( $post_ID, 'job_listing_type', 'all' );
                foreach ($job_types as $job_type ) {
                   $job_type_name = $job_type->name;
                   $job_type_slug = $job_type->slug;
                }
            if ( class_exists( 'Astoundify_Job_Manager_Companies' ) && '' != get_the_company_name() ) :
            $companies   = Astoundify_Job_Manager_Companies::instance();
            $company_url = esc_url( $companies->company_url( get_the_company_name() ) );
            endif;
        }
?>

            <div class="container">
                <div class="row">
                    <div class="col-md-12">

                        <h1><?php the_title(); ?></h1>
                        <?php if ( is_plugin_active('wp-job-manager/wp-job-manager.php') ) { ?>
                            <div class="page-header-meta">
                                <h4>

                                    <ul class="job-meta">
                                        <?php if ( ! empty($company_name) ) { ?>
                                            <li class="job-company">
                                                <i class="fa fa-building"></i>
                                                <a href="<?php echo esc_attr($company_url); ?>" target="_blank"><?php echo esc_html($company_name);?></a>
                                            </li>
                                        <?php } ?>
                                        <?php if ( ! empty($location) ) { ?>
                                            <li class="location">
                                                <i class="icon ion-ios-location"></i>
                                                <a class="google_map_link" href="#" target="_blank"><?php echo esc_html($location); ?></a>
                                            </li>
                                        <?php } ?>
                                            <li class="date-posted">
                                                <i class="icon ion-ios-calendar"></i>
                                                <date><?php echo esc_html(get_the_date());?></date>
                                            </li>
                                        <?php if ( ! empty($job_type_name) ) { ?>
                                            <li class="job-type <?php echo esc_attr($job_type_slug); ?>"><?php echo esc_html($job_type_name); ?></li>
                                        <?php } ?>
                                    </ul>

                                </h4>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>

            <?php   if ( is_plugin_active('wp-job-manager/wp-job-manager.php') ) {
                        if ( candidates_can_apply() ) :
                             get_job_manager_template( 'job-application-top.php' );
                        endif;
                    }
            ?>

        </section>
        <!-- End Page Header -->

        <section class="section section-content">
            <div class="container">
                <div class="row">

                    <div id="primary" class="content-area col-md-8 single-job-full-page">
                        <main id="main" class="site-main" role="main">
                        <?php
                            while ( have_posts() ) : the_post();

                                get_template_part( 'template-parts/content', get_post_format() );

                                the_post_navigation();

                                // If comments are open or we have at least one comment, load up the comment template.
                                if ( comments_open() || get_comments_number() ) :
                                comments_template();
                                endif;

                            endwhile; // End of the loop.
                        ?>

                        </main>
                        <!-- End Main -->
                    </div>
                    <!-- End Primary -->
                    <?php  if ( is_plugin_active('wp-job-manager/wp-job-manager.php') ) {
                                if ($show_sidebar == 1 ) {
                                    ?>
                                       <?php if ( is_active_sidebar( 'sidebar-jobs' ) ) { ?>
                                            <div id="secondary" class="col-md-4">
                                                <?php dynamic_sidebar('sidebar-jobs'); ?>
                                            </div>
                                        <?php } ?>
                                    <?php } else { ?>
                                        <div id="secondary" class="col-md-4">
                                            <div class="single_job_listing single_job_listing_fullwidth">
                                                <?php get_template_part('job_manager/content', 'single-job_listing-company'); ?>
                                            </div>
                                        </div>
                    <?php       }
                            } else {robojob_lite_sidebar_single();}   ?>

                    <!-- End Secondary -->

                </div>
                <!-- End Row -->
            </div>
            <!-- End Container -->
        </section>
        <!-- End Section Content -->

<?php
get_footer();