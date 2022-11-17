<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package espyjobs
 */



$espyjobs_options = espyjobs_theme_options();

$header_button_txt = $espyjobs_options['header_button_txt'];
$header_button_url = $espyjobs_options['header_button_url'];
$site_title_show = $espyjobs_options['site_title_show'];
$show_preloader = $espyjobs_options['show_preloader'];


?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>
<?php if($show_preloader){ ?>
<div class="page-loading"> <!-- #site-wrapper -->
  <div class="loader"></div>
  <span class="text">Loading...</span>
</div> <!-- .page-loading ends -->
<?php  } ?>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'espy-jobs' ); ?></a>


<div class="main-wrap">
	<header id="masthead" class="site-header">

		<div class="container">
             <div class="row">
				 <div class="col-md-12">
				<div class="site-branding">
					<?php
					the_custom_logo(); 

				 ?>
				<?php  if($site_title_show == 1) { ?>
					<div class="logo-wrap">

					<?php

					if ( is_front_page() && is_home() ) :
						?>
						<h2 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h2>
						<?php
					else :
						?>
						<h2 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h2>
						<?php
					endif;
					$espyjobs_description = get_bloginfo( 'description', 'display' );
					if ( $espyjobs_description || is_customize_preview() ) :
						?>
						<p class="site-description"><?php echo $espyjobs_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
					<?php endif; ?>
					</div>
			

					<?php } ?>

					
	                

			
				</div><!-- .site-branding -->


			<div id="mobile-menu-wrap">
            <!-- Collect the nav links, forms, and other content for toggling -->
			<button class="open-menu"><i class="fa fa-bars" aria-hidden="true"></i></button>
	            <div class="collapse navbar-collapse" id="navbar-collapse">

	             <?php
	                if (has_nav_menu('primary')) { ?>
	                <?php
	                    wp_nav_menu(array(
	                        'theme_location' => 'primary',
	                        'container' => '',
	                        'menu_class' => 'nav navbar-nav navbar-right',
	                        'menu_id' => 'menu-main',
	                        'walker' => new espyjobs_nav_walker(),
	                        'fallback_cb' => 'espyjobs_nav_walker::fallback',
	                    ));

	                    ?>

	                <?php } else { ?>
	                    <nav id="site-navigation" class="main-navigation clearfix">
	                        <?php   wp_page_menu(array('menu_class' => 'menu','menu_id' => 'menuid')); ?>
	                    </nav>
	                <?php } ?>



					<?php  if( $header_button_txt && $header_button_url):?>
				<a href="<?php echo esc_url($header_button_url); ?>" class="header-btn btn btn-default"><?php echo esc_html($header_button_txt); ?></a>
				<?php endif; ?>	

									<button class="close-menu"><span class="sr-text"><?php echo esc_html__(
                 'Close Menu',
                 'espy-jobs'
             ); ?></span><i class="fa fa-times" aria-hidden="true"></i></button>	

	            </div>
				</div><!-- End navbar-collapse -->

				

	            </div>
			</div>
		</div>
	</header><!-- #masthead -->

	<!-- /main-wrap -->

