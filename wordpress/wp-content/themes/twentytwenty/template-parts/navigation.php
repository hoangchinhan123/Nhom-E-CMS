<?php

/**
 * Displays the next and previous post navigation in single posts.
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

$next_post = get_next_post();
$prev_post = get_previous_post();

if ($next_post || $prev_post) {

	$pagination_classes = '';

	if (!$next_post) {
		$pagination_classes = ' only-one only-prev';
	} elseif (!$prev_post) {
		$pagination_classes = ' only-one only-next';
	}

?>

	<nav class="pagination-single section-inner<?php echo esc_attr($pagination_classes); ?>" aria-label="<?php esc_attr_e('Post', 'twentytwenty'); ?>">
		<div class="pagination-single-inner">
			<?php

			//Edit prev post
			if ($prev_post) {
			?>
				<?php
				$post_p = get_post($prev_post->ID);
				$day = date('d', strtotime($post_p->post_date));
				$month = date('m', strtotime($post_p->post_date));
				$year = date('y', strtotime($post_p->post_date));
				?>
				<div class="date_prev">
					<div class="date_prev_dm">
						<div class="date">
							<?php echo $day; ?>
						</div>
						<div class="month">
							<?php echo $month; ?>
						</div>
					</div>
					<div class="year">
						<?php echo $year; ?>
					</div>
					<a class="previous-post" href="<?php echo esc_url(get_permalink($prev_post->ID)); ?>">
						<span class="title">
							<span class="title-inner">
								<?php echo wp_kses_post(get_the_title($prev_post->ID)); ?>
							</span>
						</span>
					</a>
				</div>
			<?php
			}

			//Edit next post
			if ($next_post) { ?>
				<?php
				$post_n = get_post($next_post->ID);
				$day = date('d', strtotime($post_n->post_date));
				$month = date('m', strtotime($post_n->post_date));
				$year = date('y', strtotime($post_n->post_date));
				?>
				<div class="date_prev">
					<div class="date_prev_dm">
						<div class="date">
							<?php echo $day; ?>
						</div>
						<div class="month">
							<?php echo $month; ?>
						</div>
					</div>
					<div class="year">
						<?php echo $year; ?>
					</div>
					<a class="next-post" href="<?php echo esc_url(get_permalink($next_post->ID)); ?>">
						<span class="title"><span class="title-inner">
							<?php echo wp_kses_post(get_the_title($next_post->ID)); ?>
						</span>
					</span>
					</a>
				</div>
			<?php
			}
			?>

		</div><!-- .pagination-single-inner -->
	</nav><!-- .pagination-single -->

<?php
}
