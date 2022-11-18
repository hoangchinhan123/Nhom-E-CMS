<?php
/**
 * Template part for displaying archive posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package robojob lite
 */
global $post;
$post_thumbnail_id = get_post_thumbnail_id($post->ID);
$attachment = get_post_meta($post_thumbnail_id);
$featured_image = wp_get_attachment_image_src($post_thumbnail_id , 'full');
$alt = get_post_meta($post_thumbnail_id, '_wp_attachment_image_alt', true);
$customizer_options = robojob_lite_options();
$blog_meta = $customizer_options['blog_meta'];
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

<?php if ( has_post_format('video')) { ?>
        <a href="<?php the_permalink(); ?>">
            <div class="entry-featured featured-video">
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
        </a>
<?php } else if (has_post_format('gallery')) { ?>
    <?php
        $image_url = get_post_gallery_images($post);
        $post_thumbnail_id = get_post_thumbnail_id($post->ID);
        $attachment =  get_post($post_thumbnail_id);
    ?>

        <div class="card-head card-featured-image card-featured-gallery">
            <div class="featured-gallery robo-carousel">
            <?php foreach( $image_url as $image ) { ?>
                <a href="<?php the_permalink(); ?>">
                    <img src="<?php echo esc_url($image); ?>" alt="<?php if (! empty($alt)){ echo esc_attr($alt); } else { echo esc_attr($post->post_title); } ?>">
                </a>
            <?php } ?>
            </div>
        </div>
    <?php } else { ?>
                <?php if ( ! empty($featured_image) ) :?>
                <a href="<?php the_permalink(); ?>">
                    <div class="card-head card-featured-image">
                        <img src="<?php echo esc_url($featured_image[0]); ?>" alt="<?php if (! empty($alt)){ echo esc_attr($alt); } else { echo esc_attr($post->post_title); } ?>">
                        <div class="hover-icon"></div>
                    </div>
                </a>
            <?php endif; ?>
        <?php } ?>

	<div class="post-content">

		<header class="entry-header">
			<?php
				if ( is_single() ) {
					the_title( '<h1 class="entry-title">', '</h1>' );
				}
				else {
					the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
				}

			if ( 'post' === get_post_type() &&   ('1' == $blog_meta ) ) : ?>

				<div class="entry-meta">
                     <?php
                        $blog_post_author = $customizer_options['blog_author_image'] ;
                            if ('1' == $blog_post_author ) {  ?>
                                <div class="entry-author">
                                    <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" title="<?php echo esc_attr(get_the_author()); ?>">
                                        <span class="author-img"><?php echo get_avatar( get_the_author_meta( 'ID' ), 60, '', 'author-image', '' ); ?></span>
                                    </a>
                                </div>
                            <?php }
					 robojob_lite_posted_on(); ?>
				</div>
				<!-- End Entry-meta -->

			<?php endif; ?>

		</header>
		<!-- End Entry Header -->

		<div class="entry-content">
			<?php the_excerpt(); ?>
			<?php

				wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'robojob-lite' ),
					'after'  => '</div>',
				) );
			?>
		</div>
		<!-- End Entry Content -->

	</div>

	<footer class="entry-footer">
		<?php robojob_lite_entry_footer(); ?>
	</footer>
	<!-- End Entry Footer -->

</article>
<!-- End Posts -->
