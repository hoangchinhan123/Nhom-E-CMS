<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */

get_header();

global $post;

$robojob_lite_theme_options = robojob_lite_options();
$post_a_job_link = $robojob_lite_theme_options['post_a_job_link'];
$sidebar_class = robojob_lite_sidebar_single_class();
	if ( is_front_page() && is_home() ) {
		if ( function_exists('robojob_lite_banner_customizer') ) {
			echo robojob_lite_banner_customizer();
		}
	} elseif ( is_home() ) {

		if ( get_header_image() ) :
		$header_image = get_header_image();
		else:
		$header_image = '';
		endif; // End header image check.

		?>

		<section class="section page-header" <?php if( ! empty($header_image) ) { echo 'style="background-image:url(' . esc_url($header_image) . ')"'; } ?>>

	        <div class="container">
	            <div class="row">
	                <div class="col-md-12">
	                    <h1><?php echo esc_html('Blog', 'robojob-lite');?></h1>
	                </div>
	            </div>
	        </div>

			<?php if ( !empty($post_a_job_link) ) { ?>
		        <div class="pagehead-button">
		            <a href="<?php echo esc_url( home_url( '/' ) ); ?><?php echo esc_html($post_a_job_link); ?>/" class="btn btn-primary btn-lg"><?php esc_html_e('Post a job', 'robojob-lite'); ?></a>
		        </div>
		    <?php } ?>

    	</section>

		<?php

	}
?>

<section class="section section-content archive-content">
	<div class="container">
		<div class="row">

			<div id="primary" class="content-area <?php echo esc_attr($sidebar_class);?>">
				<main id="main" class="site-main" role="main">

					<?php
					if ( have_posts() ) :

						if ( is_home() && ! is_front_page() ) : ?>
							<header>
								<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
							</header>

						<?php
						endif;

						/* Start the Loop */
						while ( have_posts() ) : the_post();

							/*
							 * Include the Post-Format-specific template for the content.
							 * If you want to override this in a child theme, then include a file
							 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
							 */
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

				</main>
				<!-- End Main -->
			</div>
			<!-- End Primary -->
			<?php robojob_lite_sidebar_archive(); ?>


			<!-- End Secondary -->

		</div>
		<!-- End Row -->
	</div>
	<!-- End Container -->
</section>
<!-- End Section Content -->
<?php
get_footer();