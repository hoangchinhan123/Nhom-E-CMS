<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package robojob lite
 */

get_header(); ?>

<?php
    $sidebar_class = robojob_lite_sidebar_single_class();
?>

	    <div class="container">
	      <div class="row">
	          <div class="col-md-12">

					<h1><?php the_title();?></h1>
					<div class="page-header-meta">
						<h4>
							<?php if ( 'post' === get_post_type() ) : ?>
								<div class="entry-meta">
									<?php robojob_lite_posted_on(); ?>
								</div>
								<!-- Entry Meta -->
							<?php endif; ?>
							<?php robojob_lite_breadcrumb_meta(); ?>
						</h4>
					</div>

	          </div>
	      </div>
	    </div>
  	</section>
  	<!-- End Titlebar -->

	<section class="section section-content">
	    <div class="container">
				<div class="row">
					<div id="primary" class="content-area <?php echo esc_attr($sidebar_class); ?>">
						<main id="main" class="site-main" role="main">

							<?php
								while ( have_posts() ) : the_post();
									get_template_part( 'template-parts/content-single');

									// Post Navigation
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

					 <?php robojob_lite_sidebar_single(); ?>

				</div>
		    <!-- End Row -->
	    </div>
	    <!-- End Container -->
	</section>
	<!-- End Section Content -->

<?php
	get_footer();
