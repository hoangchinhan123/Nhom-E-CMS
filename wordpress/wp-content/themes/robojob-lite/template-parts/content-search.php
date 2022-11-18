<?php
/**
 * Template part for displaying results in search pages.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */

global $post;
$post_thumbnail_id = get_post_thumbnail_id( $post->ID );
$attachment = get_post_meta( $post_thumbnail_id );
$featured_image = wp_get_attachment_image_src( $post_thumbnail_id , 'full' );
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php if ( $featured_image ) : ?>
		<a href="<?php echo esc_url( get_permalink() ); ?>">
			<div class="entry-featured archive-entry-featured">
			    <img src="<?php echo esc_url( $featured_image[0] ); ?>">
				<div class="hover-icon"></div>
			</div>
		</a>
	<?php endif; ?>

	<div class="post-content">
		<header class="entry-header">
			<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>

			<?php if ( 'post' === get_post_type() ) : ?>
			<div class="entry-meta">
				<?php robojob_lite_posted_on(); ?>
			</div><!-- .entry-meta -->
			<?php endif; ?>
		</header>
		<!-- End Entry-header -->

		<div class="entry-summary entry-content">
			<?php the_excerpt(); ?>
		</div>
		<!-- End Entry-summary -->

	</div>
	<!-- Post Content -->

	<footer class="entry-footer">
		<?php robojob_lite_entry_footer(); ?>
	</footer>
	<!-- End Entry Footer -->

</article>
<!-- End #post-## -->
