<?php
/**
 * Template part for displaying posts with image post-format.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */
global $post;
$post_thumbnail_id = get_post_thumbnail_id($post->ID);
$attachment = get_post_meta($post_thumbnail_id);
$featured_image = wp_get_attachment_image_src($post_thumbnail_id , 'full');
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php if ( $featured_image ) { ?>
		<div class="entry-featured">
			<img src="<?php echo esc_url($featured_image[0]); ?>">
		</div>
	<?php } ?>

	<div class="post-content">

		<header class="entry-header">
			<?php
				if ( is_single() ) {
					the_title( '<h1 class="entry-title">', '</h1>' );
				} else {
					the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
				}

			if ( 'post' === get_post_type() ) : ?>
				<div class="entry-meta">
					<?php robojob_lite_posted_on(); ?>
				</div>
				<!-- End Entry-meta -->

			<?php endif; ?>
		</header>
		<!-- End Entry Header -->

		<div class="entry-content">
			<?php robojob_lite_post_content(); ?>
		</div>
		<!-- End Entry Content -->

	</div>

	<footer class="entry-footer">
		<?php robojob_lite_entry_footer(); ?>
	</footer>
	<!-- End Entry Footer -->

</article>
<!-- End Posts -->
