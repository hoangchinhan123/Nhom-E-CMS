<?php
<<<<<<< HEAD
=======

>>>>>>> yeu-cau-4-jobs-new
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package JobScout
 */

get_header(); ?>

<<<<<<< HEAD
	<div id="primary" class="content-area">
		
        <?php 
        /**
         * Before Posts hook
        */
        do_action( 'jobscout_before_posts_content' );
        ?>
        
        <main id="main" class="site-main">

		<?php
		if ( have_posts() ) :

			/* Start the Loop */
			while ( have_posts() ) : the_post();
=======
<div id="primary" class="content-area">

	<?php
	/**
	 * Before Posts hook
	 */
	do_action('jobscout_before_posts_content');
	?>

	<main id="main" class="site-main">

		<?php
		if (have_posts()) :

			/* Start the Loop */
			while (have_posts()) : the_post();
>>>>>>> yeu-cau-4-jobs-new

				/*
				 * Include the Post-Format-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
				 */
<<<<<<< HEAD
				get_template_part( 'template-parts/content', get_post_format() );
=======
				get_template_part('template-parts/content', get_post_format());
>>>>>>> yeu-cau-4-jobs-new

			endwhile;

		else :

<<<<<<< HEAD
			get_template_part( 'template-parts/content', 'none' );

		endif; ?>

		</main><!-- #main -->
        
        <?php
        /**
         * After Posts hook
         * @hooked jobscout_navigation - 15
        */
        do_action( 'jobscout_after_posts_content' );
        ?>
        
	</div><!-- #primary -->
=======
			get_template_part('template-parts/content', 'none');

		endif; ?>

	</main><!-- #main -->

	<?php
	/**
	 * After Posts hook
	 * @hooked jobscout_navigation - 15
	 */
	do_action('jobscout_after_posts_content');
	?>

</div><!-- #primary -->
>>>>>>> yeu-cau-4-jobs-new

<?php
get_sidebar();
get_footer();
