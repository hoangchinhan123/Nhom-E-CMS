<?php
/**
 * Template part for displaying posts with image post-format.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */
$image_url = get_post_gallery_images($post);
$post_thumbnail_id = get_post_thumbnail_id($post->ID);
$attachment =  get_post($post_thumbnail_id);
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<div class="entry-featured featured-gallery robo-carousel">
		<?php foreach( $image_url as $image ) { ?>
			<img src="<?php echo esc_url($image); ?>">
		<?php } ?>
	</div>

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
			<?php echo esc_html(strip_shortcodes($post->post_content)); ?>
		</div>
		<!-- End Entry Content -->

	</div>

	<footer class="entry-footer">
		<?php robojob_lite_entry_footer(); ?>
	</footer>
	<!-- End Entry Footer -->

</article>
<!-- End Posts -->
