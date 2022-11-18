<?php
/**
Single job page
 *
 * @package robojob lite
 */

    global $post;
    $post_ID = get_the_ID();
     $robojob_lite_theme_options = robojob_lite_options();
    $show_sidebar = $robojob_lite_theme_options['_job_sidebar'];
    if ($show_sidebar == 1 ) {
        $sidebar_class = 'col-md-8';
    } else {
         $sidebar_class = 'col-md-12';
    }
    $company_website = get_post_meta( $post_ID, '_company_website', true);
    $company_name = get_post_meta( $post_ID, '_company_name', true);
    $location = get_post_meta( $post_ID, '_job_location', true);
    $company_video = get_post_meta( $post_ID, '_company_video', true);
    $job_types = wp_get_post_terms( $post_ID, 'job_listing_type', 'all' );
        foreach ($job_types as $job_type ) {
        $job_type_name = $job_type->name;
        $job_type_slug = $job_type->slug;
    }
    $post_a_job_link = $robojob_lite_theme_options['post_a_job_link'];
?>
    <section class="section page-header">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h1><?php the_title(); ?></h1>
                    <h4>
                        <ul class="job-meta">
                        <?php if ( ! empty($company_name) ) { ?>
                            <li class="job-company">
                            <i class="fa fa-building"></i><a href="#" target="_blank"><?php echo esc_html($company_name);?></a>
                            </li>
                        <?php } ?>
                        <?php if ( ! empty($location) ) { ?>
                            <li class="location">
                            <i class="fa fa-map-marker"></i><a class="google_map_link" href="#" target="_blank"><?php echo esc_html($location); ?></a>
                            </li>
                        <?php } ?>
                            <li class="date-posted">
                            <i class="fa fa-calendar"></i><date><?php echo esc_html(get_the_date());?></date>
                            </li>
                        <?php if ( ! empty($job_type_name) ) { ?>
                            <li class="job-type full-time"><?php echo esc_html($job_type_name); ?></li>
                        <?php } ?>
                        </ul>
                    </h4>
                </div>
            </div>
        </div>
        <?php if ( !empty($post_a_job_link) ) { ?>
            <div class="pagehead-button">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?><?php echo esc_html($post_a_job_link); ?>/" class="btn btn-primary btn-lg"><?php esc_html_e('Post a job.', 'robojob-lite'); ?></a>
            </div>
        <?php } ?>

    </section>
    <!-- End Titlebar -->

    <section class="section section-content borb">
        <div class="container">
            <div class="row">

                <section id="primary" class="content-area <?php echo esc_attr($sidebar_class); ?>">
                    <main id="main" class="site-main" role="main">

                        <article class="page">
                            <header class="entry-header">
                                <h1 class="entry-title"><?php esc_html_e('Job Description', 'robojob-lite'); ?></h1>
                            </header>
                            <div class="entry-content">
                               <?php echo wp_kses_post(strip_shortcodes($post->post_content)); ?>

                                <?php if ( ! empty($company_video) ) { ?>
                                    <div class="company_video">
                                        <?php // echo esc_attr($company_video); ?>
                                    </div>
                                <?php } ?>

                                <?php if ( candidates_can_apply() ) : ?>
                                    <?php get_job_manager_template( 'job-application.php' ); ?>
                                <?php endif; ?>
                            </div>
                            <!-- <footer class="entry-footer">

                            </footer> -->
                        </article>
                    </main>
                    <!-- End Main -->
                </section>
                <!-- End Primary -->

               <?php if ($show_sidebar == 1 ) { ?>
                   <?php if ( is_active_sidebar( 'sidebar-jobs' ) ) { ?>
                        <div id="secondary" class="col-md-4">
                            <?php dynamic_sidebar('sidebar-jobs'); ?>
                        </div>
                        <!-- End Secondary -->
                    <?php } ?>
                <?php } ?>

            </div>
            <!-- End Row -->
        </div>
        <!-- End Container -->
    </section>
    <!-- End Section Content -->
