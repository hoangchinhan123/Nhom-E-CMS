<?php

/**
 * The default template for displaying content
 *
 * Used for both singular and index.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

?>
<?php
if (!is_single()) { ?>
	<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

		<?php
		// get_template_part('template-parts/entry-header');

		// if (!is_search()) {
		// 	get_template_part('template-parts/featured-image');
		// }
		?>

		<div class="post-inner <?php echo is_page_template('templates/template-full-width.php') ? '' : 'thin'; ?> ">

			<div class="entry-content">
				<?php
				if (is_search()) { ?>
					<?php $post = get_post(get_the_ID());
					$day = date('d', strtotime($post->post_date));
					$month = date('m', strtotime($post->post_date));
					$year = date('y', strtotime($post->post_date));
					$title = $post->post_title;
					$content = $post->post_content;
					?>
					<div class="list_search_detail">
						<div class="left_search_detail">
							<?php var_dump(get_the_post_thumbnail()); ?>
							<img src="<?php echo $img; ?>" alt="">
						</div>
						<div class="middle_search_detail">
							<div class="date">
							<?php
							echo $day;
							?>
							</div>
							<div class="month">
					<?php echo "Tháng" . $month; ?>
							</div>
						</div>
						<div class="right_search_detail">
							<div class="title_search_detail">
							<?php
							echo $title;
							?>
							</div>
							<div class="content_search_detail">
								<?php 	echo $content ?>
							</div>
						</div>
					</div>
				<?php
				}
				?>

				<?php
				if (is_search() || !is_singular() && 'summary' === get_theme_mod('blog_content', 'full')) {
					// the_excerpt();		
				} else {
					the_content(__('Continue reading', 'twentytwenty'));
				}
				?>



			</div><!-- .entry-content -->

		</div><!-- .post-inner -->

		<div class="section-inner">
			<?php
			wp_link_pages(
				array(
					'before'      => '<nav class="post-nav-links bg-light-background" aria-label="' . esc_attr__('Page', 'twentytwenty') . '"><span class="label">' . __('Pages:', 'twentytwenty') . '</span>',
					'after'       => '</nav>',
					'link_before' => '<span class="page-number">',
					'link_after'  => '</span>',
				)
			);

			edit_post_link();

			// Single bottom post meta.
			twentytwenty_the_post_meta(get_the_ID(), 'single-bottom');

			if (post_type_supports(get_post_type(get_the_ID()), 'author') && is_single()) {
				get_template_part('template-parts/entry-author-bio');
			}
			?>

		</div><!-- .section-inner -->

		<?php

		if (is_single()) {
			get_template_part('template-parts/navigation');
		}

		/*
	 * Output comments wrapper if it's a post, or if comments are open,
	 * or if there's a comment number – and check for password.
	 */
		if ((is_single() || is_page()) && (comments_open() || get_comments_number()) && !post_password_required()) {
		?>

			<div class="comments-wrapper section-inner">
				<?php comments_template(); ?>

			</div><!-- .comments-wrapper -->

		<?php
		}
		?>

	</article><!-- .post -->
	<!-- Trang detail post -->
<?php
} else { ?>
	<?php
	$post = get_post(get_the_ID());
	?>
	<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

		<div class="post-inner <?php echo is_page_template('templates/template-full-width.php') ? '' : 'thin'; ?> ">
			<div class="entry-content">
				<div class="detail-content" style="display: flex; max-width:100%;">
					<div class="left_entry-content" style="width:30%;">
						<h1>Categories</h1>
					</div>
					<div class="middle_entry-content" style="width:40%;">
						<?php echo $post->post_title; ?>
						<?php echo date('d', strtotime($post->post_date)); ?>
						<?php echo date('m', strtotime($post->post_date)); ?>
						<?php echo $post->post_content; ?>
					</div>
					<div class="right_entry-content" style="width:30%;">
						<h1>Last Coment</h1>
					</div>
				</div>

			</div>
		</div>

	</article><!-- .post -->
	<div class="section-inner">
		<?php
		wp_link_pages(
			array(
				'before'      => '<nav class="post-nav-links bg-light-background" aria-label="' . esc_attr__('Page', 'twentytwenty') . '"><span class="label">' . __('Pages:', 'twentytwenty') . '</span>',
				'after'       => '</nav>',
				'link_before' => '<span class="page-number">',
				'link_after'  => '</span>',
			)
		);

		edit_post_link();

		// Single bottom post meta.
		twentytwenty_the_post_meta(get_the_ID(), 'single-bottom');

		if (post_type_supports(get_post_type(get_the_ID()), 'author') && is_single()) {
			// ĐOạn trong này
			get_template_part('template-parts/entry-author-bio');
		}
		?>

	</div><!-- .section-inner -->

	<?php

	if (is_single()) {
		get_template_part('template-parts/navigation');
	}

	/*
	 * Output comments wrapper if it's a post, or if comments are open,
	 * or if there's a comment number – and check for password.
	 */
	if ((is_single() || is_page()) && (comments_open() || get_comments_number()) && !post_password_required()) {
	?>

		<div class="comments-wrapper section-inner">
			<?php comments_template(); ?>

		</div><!-- .comments-wrapper -->

<?php
	}
}
?>