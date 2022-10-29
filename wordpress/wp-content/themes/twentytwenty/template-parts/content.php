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
if (!is_single()) :
?>
	<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

		<div class="post-inner <?php echo is_page_template('templates/template-full-width.php') ? '' : 'thin'; ?> ">

			<div class="entry-content">
				<?php
				if (!is_search()) : ?>
					<div class="container">
						<div class="row">
							<div class="col-md-3 col-xs-3 topnewstime">
								<span class="meta-text">
									<a href="<?php the_permalink(); ?>">
										<span style="font-weight: 700; font-size: 45px;"><?php echo get_the_date('d', get_the_ID()); ?></span>
										<p style="font-size: 20px;"><?php echo 'Tháng' . get_the_date(' m', get_the_ID()); ?></p>
									</a>
								</span>
							</div>
							<div class="col-md-9 col-xs-9 shortdesc">
								<?php
								get_template_part('template-parts/entry-header');
								?>
								<?php
								if (is_search() || !is_singular() && 'summary' === get_theme_mod('blog_content', 'full')) {
									the_excerpt();
								} else {
									if (is_single()) {
										the_content(__('Continue reading', 'twentytwenty'));
									} else {
										$post = get_post();
										echo substr($post->post_content, 0, 100);
									}
								}
								?>
							</div>
						</div>
					</div>
				<?php endif ?>
				<?php
				if (is_search()) : ?>
					<?php $post = get_post(get_the_ID());
					$day = date('d', strtotime($post->post_date));
					$month = date('m', strtotime($post->post_date));
					$year = date('y', strtotime($post->post_date));
					$title = $post->post_title;
					$content = $post->post_content;
					?>
					<div class="list_search_detail">
						<div class="left_search_detail">
							<?php echo get_the_post_thumbnail() ?>
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
								<?php echo $content ?>
							</div>
						</div>
					</div>
				<?php endif ?>
			</div><!-- .entry-content -->

		</div><!-- .post-inner -->

		<!-- <div class="section-inner"> -->
		<?php
		// wp_link_pages(
		// 	array(
		// 		'before'      => '<nav class="post-nav-links bg-light-background" aria-label="' . esc_attr__('Page', 'twentytwenty') . '"><span class="label">' . __('Pages:', 'twentytwenty') . '</span>',
		// 		'after'       => '</nav>',
		// 		'link_before' => '<span class="page-number">',
		// 		'link_after'  => '</span>',
		// 	)
		// );

		// edit_post_link();

		// // Single bottom post meta.
		// twentytwenty_the_post_meta(get_the_ID(), 'single-bottom');

		// if (post_type_supports(get_post_type(get_the_ID()), 'author') && is_single()) {

		// 	get_template_part('template-parts/entry-author-bio');
		// }
		?>

		</div>
		<!-- .section-inner -->

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
<?php endif ?>
<!-- Detail page -->
<?php if (is_single()) : ?>
	<article <?php post_class($class); ?> id="post-<?php the_ID(); ?>">

		<div class="post-inner <?php echo is_page_template('templates/template-full-width.php') ? '' : 'thin'; ?> ">

			<div class="container detail-page">
				<div class="row title">
					<!-- Categories -->
					<div class="col-md-3">
						<div class="panel-heading">
							<h2>Categories</h2>
						</div>
						<div class="crossedbg"></div>
						<div class="panel-body">
							<ul class="list-group">
								<?php
								$args = array(
									'type'      => 'post',
									'number'    => 5,
									'parent'    => 0
								);
								$categories = get_categories($args);
								foreach ($categories as $category) { ?>
									<li class="list-group-item">
										<span class="meta-text">
											<a href="<?php echo get_term_link($category->slug, 'category'); ?>">
												<?php echo $category->name; ?>
											</a>
										</span>
									</li>
								<?php } ?>
							</ul>
						</div>
					</div>
					<!-- Detail -->
					<div class="col-md-6">
						<div class="row title">
							<div class="col-md-10 col-xs-9">
								<h1><?php
									get_template_part('template-parts/entry-header');
									?></h1>
							</div>
							<div class="col-md-2 col-xs-3">
								<div class="headlinesdate">
									<div class="headlinesdm">
										<div class="headlinesday"><?php echo get_the_date('d', get_the_ID()); ?></div>
										<div class="headlinesmonth"><?php echo get_the_date('m', get_the_ID()); ?></div>
									</div>
									<div class="headlinesyear">'<?php echo get_the_date('y', get_the_ID()); ?></div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<div class="overviewline"></div>
							</div>
						</div>
						<div class="row maincontent">
							<div class="col-md-12">
								<p>
									<?php
									if (is_search() || !is_singular() && 'summary' === get_theme_mod('blog_content', 'full')) {
										the_excerpt();
									} else {
										if (is_single()) {
											the_content(__('Continue reading', 'twentytwenty'));
										}
									}
									?>
								</p>
							</div>
						</div>
					</div>
					<!-- Recent-posts -->
					<div class="col-md-3">
						<div class="panel-heading">
							<h2>Recent posts</h2>
						</div>
						<div class="crossedbg"></div>
						<div class="panel-body">
							<ul class="list-group">
								<?php
								// Define our WP Query Parameters
								$the_query = new WP_Query('posts_per_page=5'); ?>
								<?php
								// Start our WP Query
								while ($the_query->have_posts()) : $the_query->the_post();
									// Display the Post Title with Hyperlink
								?>
									<li class="list-group-item"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></li>
								<?php
								// Repeat the process and reset once it hits the limit
								endwhile;
								wp_reset_postdata();
								?>
							</ul>
						</div>
					</div>
				</div>
			</div>

		</div><!-- .post-inner -->

		<!-- Icon edit under post -->
		<!-- <div class="section-inner"> -->
		<?php
		// wp_link_pages(
		// 	array(
		// 		'before'      => '<nav class="post-nav-links bg-light-background" aria-label="' . esc_attr__('Page', 'twentytwenty') . '"><span class="label">' . __('Pages:', 'twentytwenty') . '</span>',
		// 		'after'       => '</nav>',
		// 		'link_before' => '<span class="page-number">',
		// 		'link_after'  => '</span>',
		// 	)
		// );

		// edit_post_link();

		// // Single bottom post meta.
		// twentytwenty_the_post_meta(get_the_ID(), 'single-bottom');

		// if (post_type_supports(get_post_type(get_the_ID()), 'author') && is_single()) {

		// 	get_template_part('template-parts/entry-author-bio');
		// }
		?>
		<!-- </div> -->
		<!-- .section-inner -->

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
<?php endif ?>
