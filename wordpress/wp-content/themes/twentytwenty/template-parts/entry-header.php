<?php
/**
 * Displays the post header
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

$entry_header_classes = '';

if ( is_singular() ) {
	$entry_header_classes .= ' header-footer-group';
}

?>

<header class="entry-header has-text-align-center<?php echo esc_attr( $entry_header_classes ); ?>">

	<div class="entry-header-inner section-inner medium">

		<?php
		/**
		 * Allow child themes and plugins to filter the display of the categories in the entry header.
		 *
		 * @since Twenty Twenty 1.0
		 *
		 * @param bool Whether to show the categories in header. Default true.
		 */
		$show_categories = apply_filters( 'twentytwenty_show_categories_in_entry_header', true );

		if ( true === $show_categories && has_category() ) {
			?>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

			<div class="entry-categories" style="display: none;">
				<span class="screen-reader-text"><?php _e( 'Categories', 'twentytwenty' ); ?></span>
				<div class="entry-categories-inner">
					<?php the_category( ' ' ); ?>
				</div>
				<!-- .entry-categories-inner -->
=======
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search
=======
>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post
			<div class="entry-categories">
				<span class="screen-reader-text"><?php _e( 'Categories', 'twentytwenty' ); ?></span>
				<div class="entry-categories-inner">
					<?php the_category( ' ' ); ?>
				</div><!-- .entry-categories-inner -->
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search
=======
>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post
			</div><!-- .entry-categories -->

			<?php
		}

		if ( is_singular() ) {
			the_title( '<h1 class="entry-title">', '</h1>' );
		} else {
			the_title( '<h2 class="entry-title heading-size-1"><a href="' . esc_url( get_permalink() ) . '">', '</a></h2>' );
		}

		$intro_text_width = '';

		if ( is_singular() ) {
			$intro_text_width = ' small';
		} else {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
			
>>>>>>> 31/1-header
=======
			
>>>>>>> 31/8-comment
=======
			
>>>>>>> 32/4-search
=======
			
>>>>>>> 32/4-search_result
=======
			
>>>>>>> 32/7-prev_next_post
			$intro_text_width = ' thin';
		}

		if ( has_excerpt() && is_singular() ) {
			?>

			<div class="intro-text section-inner max-percentage<?php echo $intro_text_width; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static output ?>">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
				<?php the_excerpt(); ?>
=======
			<?php the_excerpt(); ?>

>>>>>>> 31/1-header
=======
			<?php the_excerpt(); ?>

>>>>>>> 31/8-comment
=======
			<?php the_excerpt(); ?>

>>>>>>> 32/4-search
=======
			<?php the_excerpt(); ?>

>>>>>>> 32/4-search_result
=======
			<?php the_excerpt(); ?>

>>>>>>> 32/7-prev_next_post
			</div>

			<?php
		}

		// Default to displaying the post meta.
		twentytwenty_the_post_meta( get_the_ID(), 'single-top' );
		?>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search
=======
>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post
	</div><!-- .entry-header-inner -->

</header><!-- .entry-header -->
