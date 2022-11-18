<?php
/**
 * The template for displaying 404 pages (not found).
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package robojob lite
 */

get_header(); ?>

        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <h1><?php esc_html_e( '404', 'robojob-lite' ); ?></h1>
                    <h2><?php esc_html_e( 'Page not found', 'robojob-lite' ); ?></h2>
                </div>
            </div>
        </div>

        <div class="pagehead-button">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary btn-lg">
                <i class="icon ion-ios-home"></i><?php esc_html_e('Return Home.', 'robojob-lite'); ?>
            </a>
        </div>

    </section>
    <!-- End Titlebar -->

	<section class="section section-content section-404">
        <div class="container">
            <div class="row">

                <div class="col-md-8 col-md-offset-2">

                    <div id="primary" class="content-area">
    					<main id="main" class="site-main" role="main">

    						<section class="error-404 not-found">

    							<header class="entry-header">
    								<h1 class="entry-title"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'robojob-lite' ); ?></h1>
    							</header>

    							<div class="page-content">
    								<p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'robojob-lite' ); ?></p>
    								<?php get_search_form(); ?>
    							</div>
    							<!-- End .page-content -->
    						</section>
    						<!-- End .error-404 -->

    					</main>
    					<!-- End #main -->
    				</div>
    				<!-- End primary -->

                    <div id="secondary">

    					<?php
    						the_widget( 'WP_Widget_Recent_Posts' );
    						// Only show the widget if site has multiple categories.
    						if ( robojob_lite_categorized_blog() ) :
    					?>

    					<div class="widget widget_categories">
    						<h2 class="widget-title"><?php esc_html_e( 'Most Used Categories', 'robojob-lite' ); ?></h2>
    						<ul>
    						<?php
    							wp_list_categories( array(
    								'orderby'    => 'count',
    								'order'      => 'DESC',
    								'show_count' => 1,
    								'title_li'   => '',
    								'number'     => 10,
    							) );
    						?>
    						</ul>
    					</div><!-- .widget -->

    					<?php
    						endif;
    						/* translators: %1$s: smiley */
    						$archive_content = '<p>' . sprintf( esc_html__( 'Try looking in the monthly archives. %1$s', 'robojob-lite' ), convert_smilies( ':)' ) ) . '</p>';
    						the_widget( 'WP_Widget_Archives', 'dropdown=1', "after_title=</h2>$archive_content" );

    						the_widget( 'WP_Widget_Tag_Cloud' );
    					?>

    				</div>
    				<!-- End Secondary -->

                </div>
                <!-- End Col -->
			</div>
            <!-- End Row -->
        </div>
        <!-- End Container -->

    </section>
    <!-- End Section Content -->

<?php
get_footer();
