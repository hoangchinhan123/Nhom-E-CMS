<?php
/**
 * The template for displaying archive pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */

get_header(); ?>

<?php $sidebar_class = robojob_lite_sidebar_archive_class(); ?>

		<div class="container">
			<div class="row">
				<div class="col-md-12">
					<?php the_archive_title( '<h1>', '</h1>' ); ?>
				</div>
			</div>
		</div>

	</section>
	<!-- End Titlebar -->

	<section class="section section-content">
        <div class="container">
            <div class="row">
    			<div id="primary" class="content-area <?php echo esc_attr($sidebar_class); ?>">
                    <?php robojob_lite_author_desc(); ?>
    				<main id="main" class="site-main" role="main">

    				<?php
    				if ( have_posts() ) : ?>

    					<?php
    					/* Start the Loop */
    					while ( have_posts() ) : the_post();

    						/*
    						 * Include the Post-Format-specific template for the content.
    						 * If you want to override this in a child theme, then include a file
    						 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
    						 */
    						// get_template_part( 'template-parts/content', get_post_format() );
    						get_template_part( 'template-parts/content-archive');

    					endwhile;

    					 the_posts_pagination( array(
                            'mid_size' => 2,
                            'prev_text' => __( 'Back', 'robojob-lite' ),
                            'next_text' => __( 'Next', 'robojob-lite' ),
                        ) );

    				else :

    					get_template_part( 'template-parts/content', 'none' );

    				endif; ?>

    				</main><!-- #main -->
    			</div><!-- #primary -->

                <?php robojob_lite_sidebar_archive(); ?>

    		</div>
            <!-- End Row -->
        </div>
        <!-- End Container -->
    </section>
    <!-- End Section Content -->

<?php
get_footer();
