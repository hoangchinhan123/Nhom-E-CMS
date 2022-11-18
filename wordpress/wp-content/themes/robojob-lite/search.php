<?php
/**
 * The template for displaying search results pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package robojob lite
 */

get_header(); ?>

		<div class="container">
			<div class="row">
				<div class="col-md-12">

					<h1><?php printf( esc_html__( 'Search Results for: %s', 'robojob-lite' ), '<span>' . get_search_query() . '</span>' ); ?></h1>

				</div>
			</div>
		</div>

		<div class="pagehead-button">
			<a href="#primary" class="btn btn-primary btn-lg"><?php echo esc_html_e('Search Results', 'robojob-lite'); ?></a>
		</div>

	</section>
	<!-- End Titlebar -->

	<section class="section section-content">
    <div class="container">
      <div class="row">

				<section id="primary" class="content-area col-md-8">
					<main id="main" class="site-main" role="main">

					<?php
					if ( have_posts() ) : ?>

							<?php
							/* Start the Loop */
							while ( have_posts() ) : the_post();

								/**
								 * Run the loop for the search to output the results.
								 * If you want to overload this in a child theme then include a file
								 * called content-search.php and that will be used instead.
								 */
								get_template_part( 'template-parts/content', 'search' );

							endwhile;

							the_posts_navigation();

						else :

							get_template_part( 'template-parts/content', 'none' );

						endif; ?>

					</main>
					<!-- End #main -->
				</section>

				<!-- End Primary -->

					<?php robojob_lite_sidebar_single(); ?>
				<!-- End Secondary -->

			</div>
			<!-- End Row -->
		</div>
		<!-- End Container -->
	</section>
	<!-- End Section Content -->

<?php
get_sidebar();
get_footer();
