<?php
/**
 * Template part for displaying posts with image post-format.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */
global $post;
$content = $post->post_content;
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<div class="entry-featured">
		<?php
            $content = trim(get_post_field('post_content', $post->ID));
            $new_content = preg_match_all('/\[[^\]]*\]/', $content, $matches);

	        if ($new_content ) {
	            echo do_shortcode($matches[0][0]);
	        } else {
	                echo esc_html(robojob_lite_the_featured_video($content));
	        }

        ?>
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
			<?php echo esc_html(robojob_lite_strip_url_content($post, 30));?>
		</div>
		<!-- End Entry Content -->

	</div>

	<footer class="entry-footer">
		<?php robojob_lite_entry_footer(); ?>
	</footer>
	<!-- End Entry Footer -->

</article>
<!-- End Posts -->
