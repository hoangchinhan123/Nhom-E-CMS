<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package espyjobs
 */


$espyjobs_options = espyjobs_theme_options();

$show_image = $espyjobs_options['show_image'];
$show_blog_author = $espyjobs_options['show_blog_author'];
$show_blog_date = $espyjobs_options['show_blog_date'];
$show_excerpts = $espyjobs_options['show_excerpts'];

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

<?php if($show_image){ ?>
	<?php espyjobs_post_thumbnail(); ?>
	<?php } ?>
	<header class="entry-header">
		<?php
		if ( is_singular() ) :
			the_title( '<h1 class="entry-title">', '</h1>' );
		else :
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
		endif;

		if ( 'post' === get_post_type() ) :
			?>
			<div class="entry-meta">
				<?php
				if($show_blog_date){ 
				espyjobs_posted_on();
				}
				if($show_blog_author){ 
				espyjobs_posted_by();
				}
				?>
			</div><!-- .entry-meta -->
		<?php endif; ?>
	</header><!-- .entry-header -->
	


	<div class="entry-content">
            <?php

            global $numpages;
            if (is_archive() || is_home()){
				if ( $show_excerpts ) :
                    echo wp_kses_post(espyjobs_get_excerpt($post->ID, 450));
				endif;
			}	
            else{
                the_content(sprintf(wp_kses(__('Continue reading<span class="screen-reader-text"> "%s"</span>', 'espy-jobs'),array('span' => array('class' => array(),),)),get_the_title()));
			}
            if(is_single()) {
                wp_link_pages(array(
                    'before' => '<div class="page-links">' . esc_html__('Pages:', 'espy-jobs'),
                    'after' => '</div>',
                    'link_before' => '<span>',
                    'link_after'  => '</span>',
                ));
            }
            ?>
	</div><!-- .entry-content -->

</article><!-- #post-<?php the_ID(); ?> -->
