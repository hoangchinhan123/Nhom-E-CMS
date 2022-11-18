<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package robojob lite
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
if (! function_exists('robojob_lite_body_classes')) {
	function robojob_lite_body_classes( $classes ) {
		// Adds a class of group-blog to blogs with more than 1 published author.
		if ( is_multi_author() ) {
			$classes[] = 'group-blog';
		}

		// Adds a class of hfeed to non-singular pages.
		if ( ! is_singular() ) {
			$classes[] = 'hfeed';
		}

		return $classes;
	}
	add_filter( 'body_class', 'robojob_lite_body_classes' );
}

if (! function_exists('robojob_lite_blog_post_format')) {
	function robojob_lite_blog_post_format($post_format, $post_id) {
		global $post;
		$blog_image_id  = get_post_thumbnail_id();
        $blog_image_url = wp_get_attachment_image_src( $blog_image_id, 'robojob-lite-post-image' );
        $alt = get_post_meta($blog_image_id, '_wp_attachment_image_alt', true);
		if ( $post_format == 'video') { ?>
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
		<?php } else if ( $post_format == 'gallery') {
		    $image_url = get_post_gallery_images($post->ID);
		    $post_thumbnail_id = get_post_thumbnail_id($post->ID);
		    $attachment =  get_post($post_thumbnail_id);
		?>

		    <div class="card-head card-featured-gallery">
		        <div class="featured-wrap-gallery">
		            <div class="featured-gallery robo-carousel">
		            <?php foreach( $image_url as $image ) { ?>
		                <a href="<?php the_permalink(); ?>" title="<?php echo esc_attr($post->post_title); ?>" style="background-image: url(<?php echo esc_url($image); ?>);">
		                </a>
		            <?php } ?>
		            </div>
		        </div>
		    </div>

		<?php } else { ?>
		    <?php if ( ! empty($blog_image_url) ) :?>
		        <a href="<?php the_permalink(); ?>">
		            <div class="card-head card-featured-image">
		                <div class="featured-wrap" style="background-image: url(<?php echo esc_attr($blog_image_url[0]); ?>)">
		                    <div class="hover-icon"></div>
		                </div>
		            </div>
		        </a>
		    <?php endif; ?>
		<?php }
	}
}

if (! function_exists('robojob_lite_sticky_posts')) {
	function robojob_lite_sticky_posts($post) {
		global $post;
		$customizer_options = robojob_lite_options();
        $blog_excerpt_length = $customizer_options['blog_excerpt_length'];
		$sticky = get_option( 'sticky_posts' );
		$sticky_args = array(
		    'post__in' => $sticky
		    );

		$sticky_query = new WP_Query($sticky_args);
		$count = 1;
		if($sticky_query->have_posts()):
		    while($sticky_query->have_posts()):
		        $sticky_query->the_post();
		    		$blog_image_id  = get_post_thumbnail_id();
	                $blog_image_url = wp_get_attachment_image_src( $blog_image_id, 'robojob-lite-post-image' );
	                $alt = get_post_meta($blog_image_id, '_wp_attachment_image_alt', true);
		            $post_format = get_post_format();
		            ?>
		                <div class="col-md-4 col-sm-12 mob-margin-bot-30">
		                    <div class="card">
		                        <article class="recent-post card-content">
		                            <?php robojob_lite_blog_post_format($post_format, $post->ID);?>
		                            <div class="card-body">
		                                <h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
		                                <div class="entry-meta">
		                                    <?php
		                                    $blog_post_author = $customizer_options['blog_author_image'];
		                                        if ('1' == $blog_post_author ) {  ?>
		                                            <div class="entry-author">
		                                                <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" title="<?php echo esc_attr(get_the_author()); ?>">
		                                                    <span class="author-img"><?php echo get_avatar( get_the_author_meta( 'ID' ), 60, '', 'author-image', '' ); ?></span>
		                                                </a>
		                                            </div>
		                                        <?php }
		                                    $blog_meta = ( empty($meta)?$customizer_options['blog_meta']:$meta );
		                                    if ('1' == $blog_meta ) {
		                                        robojob_lite_posted_on();
		                                    } ?>
		                                </div>
		                                <p><?php echo wp_kses_post(robojob_lite_get_excerpt($post->ID,$blog_excerpt_length)); ?></p>
		                            </div>
		                            <a href="<?php the_permalink(); ?>" class="btn btn-primary btn-card"><?php echo esc_html__('Read More', 'robojob-lite'); ?></a>
		                        </article>
		                    </div>
		                </div>
		            <?php
		    endwhile;
		endif;
		wp_reset_postdata();
	}
}