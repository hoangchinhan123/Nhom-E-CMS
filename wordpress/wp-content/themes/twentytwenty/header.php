<?php
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 32/4-search
=======

>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post
/**
 * Header file for the Twenty Twenty WordPress default theme.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Twenty
 * @since Twenty Twenty 1.0
 */

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
?>
<!DOCTYPE html>
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
>>>>>>> 31/8-comment
=======
?>
<!DOCTYPE html>
>>>>>>> 32/4-search_result
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result
<html class="no-js" <?php language_attributes(); ?>>

<head>

	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="profile" href="https://gmpg.org/xfn/11">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
=======

>>>>>>> 31/1-header
=======

>>>>>>> 31/8-comment
=======

>>>>>>> 32/4-search_result
	<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	<style>
		@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
	</style>
	<?php
	wp_body_open();
	?>
	<header id="site-header" class="header-footer-group">
		</div>
		<div class="header-inner section-inner" style="height: 85px;">
=======
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result

	<?php
	wp_body_open();
	?>

	<header id="site-header" class="header-footer-group">

		<div class="header-inner section-inner">
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result

			<div class="header-titles-wrapper">

				<?php

				// Check whether the header search is activated in the customizer.
				$enable_header_search = get_theme_mod('enable_header_search', true);

				if (true === $enable_header_search) {

				?>

					<button class="toggle search-toggle mobile-search-toggle" data-toggle-target=".search-modal" data-toggle-body-class="showing-search-modal" data-set-focus=".search-modal .search-field" aria-expanded="false">
						<span class="toggle-inner">
							<span class="toggle-icon">
								<?php twentytwenty_the_theme_svg('search'); ?>
							</span>
							<span class="toggle-text"><?php _ex('Search', 'toggle text', 'twentytwenty'); ?></span>
						</span>
					</button><!-- .search-toggle -->

				<?php } ?>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 31/1-header
=======

>>>>>>> 31/8-comment
=======

>>>>>>> 32/4-search_result
				<div class="header-titles">

					<?php
					// Site title or logo.
					twentytwenty_site_logo();

					// Site description.
					twentytwenty_site_description();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
					?>

				</div><!-- .header-titles -->
				<div class="wp-container-3 wp-block-group">
					<form role="search" method="get" action="http://localhost/wordpress/" class="wp-block-search__button-outside wp-block-search__text-button wp-block-search" style="margin-left: 15px;">
						<div class="wp-block-search__inside-wrapper "><input type="search" id="wp-block-search__input-1" class="wp-block-search__input " name="s" value="" placeholder="" required="" style="border-radius: 10px;height: 46px;"><button type="submit" class="wp-block-search__button  " style="border-radius: 10px;">Submit</button></div>
					</form>
				</div>
=======
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result

					//Add search in menu
					get_search_form();
					?>

				</div><!-- .header-titles -->

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result
				<button class="toggle nav-toggle mobile-nav-toggle" data-toggle-target=".menu-modal" data-toggle-body-class="showing-menu-modal" aria-expanded="false" data-set-focus=".close-nav-toggle">
					<span class="toggle-inner">
						<span class="toggle-icon">
							<?php twentytwenty_the_theme_svg('ellipsis'); ?>
						</span>
						<span class="toggle-text"><?php _e('Menu', 'twentytwenty'); ?></span>
					</span>
				</button><!-- .nav-toggle -->

			</div><!-- .header-titles-wrapper -->

			<div class="header-navigation-wrapper">

				<?php
				if (has_nav_menu('primary') || !has_nav_menu('expanded')) {
				?>

					<nav class="primary-menu-wrapper" aria-label="<?php echo esc_attr_x('Horizontal', 'menu', 'twentytwenty'); ?>">

						<ul class="primary-menu reset-list-style">

							<?php
							if (has_nav_menu('primary')) {

								wp_nav_menu(
									array(
										'container'  => '',
										'items_wrap' => '%3$s',
										'theme_location' => 'primary',
									)
								);
							} elseif (!has_nav_menu('expanded')) {

								wp_list_pages(
									array(
										'match_menu_classes' => true,
										'show_sub_menu_icons' => true,
										'title_li' => false,
										'walker'   => new TwentyTwenty_Walker_Page(),
									)
								);
							}
							?>

						</ul>

					</nav><!-- .primary-menu-wrapper -->
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result
				<?php
				}

				if (true === $enable_header_search || has_nav_menu('expanded')) {
				?>

					<div class="header-toggles hide-no-js">

						<?php
						if (has_nav_menu('expanded')) {
						?>

<<<<<<< HEAD
=======
=======
>>>>>>> 32/7-prev_next_post
?><!DOCTYPE html>

<html class="no-js" <?php language_attributes(); ?>>

	<head>

		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1.0" >

		<link rel="profile" href="https://gmpg.org/xfn/11">

		<?php wp_head(); ?>

	</head>

	<body <?php body_class(); ?>>

		<?php
		wp_body_open();
		?>

		<header id="site-header" class="header-footer-group">

			<div class="header-inner section-inner">

				<div class="header-titles-wrapper">

					<?php

					// Check whether the header search is activated in the customizer.
					$enable_header_search = get_theme_mod( 'enable_header_search', true );

					if ( true === $enable_header_search ) {

						?>

						<button class="toggle search-toggle mobile-search-toggle" data-toggle-target=".search-modal" data-toggle-body-class="showing-search-modal" data-set-focus=".search-modal .search-field" aria-expanded="false">
							<span class="toggle-inner">
								<span class="toggle-icon">
									<?php twentytwenty_the_theme_svg( 'search' ); ?>
								</span>
								<span class="toggle-text"><?php _ex( 'Search', 'toggle text', 'twentytwenty' ); ?></span>
							</span>
						</button><!-- .search-toggle -->

					<?php } ?>

					<div class="header-titles">

						<?php
							// Site title or logo.
							twentytwenty_site_logo();

							// Site description.
							twentytwenty_site_description();

							//Add search in menu
							get_search_form();
						?>

					</div><!-- .header-titles -->

					<button class="toggle nav-toggle mobile-nav-toggle" data-toggle-target=".menu-modal"  data-toggle-body-class="showing-menu-modal" aria-expanded="false" data-set-focus=".close-nav-toggle">
						<span class="toggle-inner">
							<span class="toggle-icon">
								<?php twentytwenty_the_theme_svg( 'ellipsis' ); ?>
							</span>
							<span class="toggle-text"><?php _e( 'Menu', 'twentytwenty' ); ?></span>
						</span>
					</button><!-- .nav-toggle -->

				</div><!-- .header-titles-wrapper -->

				<div class="header-navigation-wrapper">

					<?php
					if ( has_nav_menu( 'primary' ) || ! has_nav_menu( 'expanded' ) ) {
						?>

							<nav class="primary-menu-wrapper" aria-label="<?php echo esc_attr_x( 'Horizontal', 'menu', 'twentytwenty' ); ?>">

								<ul class="primary-menu reset-list-style">

								<?php
								if ( has_nav_menu( 'primary' ) ) {

									wp_nav_menu(
										array(
											'container'  => '',
											'items_wrap' => '%3$s',
											'theme_location' => 'primary',
										)
									);

								} elseif ( ! has_nav_menu( 'expanded' ) ) {

									wp_list_pages(
										array(
											'match_menu_classes' => true,
											'show_sub_menu_icons' => true,
											'title_li' => false,
											'walker'   => new TwentyTwenty_Walker_Page(),
										)
									);

								}
								?>

								</ul>

							</nav><!-- .primary-menu-wrapper -->
						<?php
					}

					if ( true === $enable_header_search || has_nav_menu( 'expanded' ) ) {
						?>

						<div class="header-toggles hide-no-js">

						<?php
						if ( has_nav_menu( 'expanded' ) ) {
							?>

<<<<<<< HEAD
>>>>>>> 32/4-search
=======
>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post
							<div class="toggle-wrapper nav-toggle-wrapper has-expanded-menu">

								<button class="toggle nav-toggle desktop-nav-toggle" data-toggle-target=".menu-modal" data-toggle-body-class="showing-menu-modal" aria-expanded="false" data-set-focus=".close-nav-toggle">
									<span class="toggle-inner">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
										<span class="toggle-text"><?php _e('Menu', 'twentytwenty'); ?></span>
										<span class="toggle-icon">
											<?php twentytwenty_the_theme_svg('ellipsis'); ?>
=======
										<span class="toggle-text"><?php _e( 'Menu', 'twentytwenty' ); ?></span>
										<span class="toggle-icon">
											<?php twentytwenty_the_theme_svg( 'ellipsis' ); ?>
>>>>>>> 32/4-search
=======
										<span class="toggle-text"><?php _e('Menu', 'twentytwenty'); ?></span>
										<span class="toggle-icon">
											<?php twentytwenty_the_theme_svg('ellipsis'); ?>
>>>>>>> 32/4-search_result
=======
										<span class="toggle-text"><?php _e( 'Menu', 'twentytwenty' ); ?></span>
										<span class="toggle-icon">
											<?php twentytwenty_the_theme_svg( 'ellipsis' ); ?>
>>>>>>> 32/7-prev_next_post
										</span>
									</span>
								</button><!-- .nav-toggle -->

							</div><!-- .nav-toggle-wrapper -->
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
>>>>>>> 32/4-search_result
						<?php
						}

						if (true === $enable_header_search) {
						?>
<<<<<<< HEAD
=======
=======
>>>>>>> 32/7-prev_next_post
							<?php
						}

						if ( true === $enable_header_search ) {
							?>
<<<<<<< HEAD
>>>>>>> 32/4-search
=======
>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post

							<div class="toggle-wrapper search-toggle-wrapper">

								<button class="toggle search-toggle desktop-search-toggle" data-toggle-target=".search-modal" data-toggle-body-class="showing-search-modal" data-set-focus=".search-modal .search-field" aria-expanded="false">
									<span class="toggle-inner">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 32/4-search_result
										<?php twentytwenty_the_theme_svg('search'); ?>
										<span class="toggle-text"><?php _ex('Search', 'toggle text', 'twentytwenty'); ?></span>
									</span>
								</button><!-- .search-toggle -->

							</div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 31/8-comment
							<!-- Add icon user -->
							<div class="icon">
								<i class="bi bi-person-circle"></i>
								<div class="dropdown show">
									<a class="btn dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
										Account
									</a>

									<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
										<a class="dropdown-item" href="http://localhost/wordpress/wp-login.php">Login</a>
										<a class="dropdown-item" href="#">Logout</a>
									</div>
								</div>
							</div>
<<<<<<< HEAD
>>>>>>> 31/1-header
=======
>>>>>>> 31/8-comment
=======
							<!-- Add icon user -->
						<p>Add icon</p>
>>>>>>> 32/4-search_result

						<?php
						}
						?>

					</div><!-- .header-toggles -->
				<?php
				}
				?>

			</div><!-- .header-navigation-wrapper -->

		</div><!-- .header-inner -->

		<?php
		// Output the search modal (if it is activated in the customizer).
		if (true === $enable_header_search) {
			get_template_part('template-parts/modal-search');
		}
		?>

	</header><!-- #site-header -->

	<?php
	// Output the menu modal.
	get_template_part('template-parts/modal-menu');
<<<<<<< HEAD
=======
=======
>>>>>>> 32/7-prev_next_post
										<?php twentytwenty_the_theme_svg( 'search' ); ?>
										<span class="toggle-text"><?php _ex( 'Search', 'toggle text', 'twentytwenty' ); ?></span>
									</span>
								</button><!-- .search-toggle -->
								
							</div>
							<!-- Add icon user -->
							<p>Thêm icon user vào đây</p>

							<?php
						}
						?>

						</div><!-- .header-toggles -->
						<?php
					}
					?>

				</div><!-- .header-navigation-wrapper -->

			</div><!-- .header-inner -->

			<?php
			// Output the search modal (if it is activated in the customizer).
			if ( true === $enable_header_search ) {
				get_template_part( 'template-parts/modal-search' );
			}
			?>

		</header><!-- #site-header -->

		<?php
		// Output the menu modal.
		get_template_part( 'template-parts/modal-menu' );
<<<<<<< HEAD
>>>>>>> 32/4-search
=======
>>>>>>> 32/4-search_result
=======
>>>>>>> 32/7-prev_next_post
