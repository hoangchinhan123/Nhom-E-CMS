<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php if ( has_post_thumbnail() ) { ?>
		<div class="entry-featured">
			<?php the_post_thumbnail('full');?>
		</div>
	<?php } ?>

	<div class="post-content">

		<div class="entry-content job-page-wrap job-widget <?php if (is_page( 'Jobs' || 'jobs' ) ) { echo 'job-page-wrap job-widget'; };?>">
			<?php the_content();?>
		</div>
		<!-- End Entry-content -->

	</div>
	<!-- End Post Content -->

	<?php wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'robojob-lite' ),
					'after'  => '</div>',
				) ); ?>

	<footer class="entry-footer">
		<?php
			edit_post_link(
				sprintf(
					/* translators: %s: Name of current post */
					esc_html__( 'Edit %s', 'robojob-lite' ),
					the_title( '<span class="screen-reader-text">"', '"</span>', false )
				),
				'<span class="edit-link">',
				'</span>'
			);
		?>
	</footer>
	<!-- End entry-footer -->


</article><!-- #post-## -->
