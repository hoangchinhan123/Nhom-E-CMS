<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 * @since Robojob 1.0.0
 */

get_header();
global $post;
$robojob_lite_theme_options = robojob_lite_options();
$post_a_job_link = $robojob_lite_theme_options['post_a_job_link'];
?>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h1><?php the_title();?></h1>
                </div>
            </div>
        </div>

    <?php if ( !empty($post_a_job_link) ) { ?>
        <div class="pagehead-button">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?><?php echo esc_html($post_a_job_link);?>/" class="btn btn-primary btn-lg"><?php esc_html_e('Post a job', 'robojob-lite'); ?></a>
        </div>
    <?php } ?>

    </section>
    <!-- End Titlebar -->

    <section id="section-content" class="section section-content">
        <div class="container">
            <div class="row">

                <section id="primary" class="content-area col-md-8 fullpage">
                    <main id="main" class="site-main" role="main">

						<?php
							while ( have_posts() ) : the_post();

								get_template_part( 'template-parts/content', 'page' );

								// If comments are open or we have at least one comment, load up the comment template.
								if ( comments_open() || get_comments_number() ) :
									comments_template();
								endif;

							endwhile; // End of the loop.
						?>

                    </main>
                    <!-- End Main -->
                </section>
                <!-- End Primary -->
                <section id="secondary" class="col-md-4">
                    <?php dynamic_sidebar('sidebar'); ?>
                </section>


            </div>
            <!-- End Row -->
        </div>
        <!-- End Container -->
    </section>
    <!-- End Section Content -->

<?php
get_footer();
