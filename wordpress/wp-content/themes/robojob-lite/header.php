<?php
/**
 * The template for displaying the header
 *
 * Displays all of the head element and everything up until the "container" div.
 *
 * @package robojob lite
 * @since Robojob 1.0.0
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="norobo-js">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <?php wp_head(); ?>
    <?php
        $robojob_lite_theme_options = robojob_lite_options();
    ?>
  </head>

  <?php wp_body_open(); ?>
  <body <?php body_class();?>>
	
    <!-- Offcanvas. Mobile Navigation -->
    <div id="sidr" class="hidden">

      <?php wp_nav_menu( array(
        'theme_location' => 'primary',
        'menu_id' => '',
        'container' => 'ul',
        'menu_id'   => '',
        'depth' => 4,
      )); ?>

    </div>


    <!-- Wrapping everything in the Offcanvas wrap. -->
    <div class="offcanvas-wrap">

      <noscript>
        <p class="no-script"><?php esc_html__('Enable Javascript in your browser for better experience.', 'robojob-lite'); ?></p>
      </noscript>

      <header class="site-header" id="site-header">

        <div class="top-bar"></div>

        <nav class="navbar navbar-default">

          <div class="container">

              <div class="navbar-header">

                <a id="simple-menu" href="#sidr" class="navbar-toggle menu-btn thebtn">
                  <span class="sr-only"><?php echo esc_html__('Toggle navigation', 'robojob-lite'); ?></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                  <span class="icon-bar"></span>
                </a>

                <?php if ( function_exists('robojob_lite_logo') ) { robojob_lite_logo(); } ?>

              </div>
              <!-- Navbar Header -->

              <?php
              if ( has_nav_menu('primary') ) :
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'menu_id' => '',
                    'container' => 'div',
                    'container_class' => 'collapse navbar-collapse',
                    'container_id'    => 'site-navigation',
                    'menu_class' => 'nav navbar-nav navbar-right',
                    'menu_id'   => '',
                    'depth' => 4,
                    'walker'    => new wp_bootstrap_navwalker(),
                ));
              elseif (is_user_logged_in() && current_user_can('edit_theme_options')) :?>
                  <ul id="menu-main-menu-1" class="nav navbar-nav navbar-right">
                      <?php
                      echo  '<li class="menu-item"><a href="'.esc_url(admin_url('nav-menus.php')).'" target="_blank"><i class="fa fa-plus-circle"></i> '.esc_html__('Assign a menu', 'robojob-lite').'</a></li>';
                  ?>
                  </ul>
              <?php
                else :
                  echo '<div id="site-navigation" class="collapse navbar-collapse">';
                    wp_page_menu(array('depth' => 1, 'menu_class' => 'fallback_menu_default'));
                  echo '</div>';
                endif;
              ?>
              <!-- End navbar -->

              <div id="header-search-wrap">
                <?php get_search_form(); ?>
              </div>

          </div>
          <!-- End Container -->

        </nav>
      </header>
      <!-- End Header -->
<?php
if ( get_header_image() ) :
    $header_image = get_header_image();
else:
    $header_image = '';
endif; // End header image check.

$page_template_id = get_option('page_on_front');
$page_template_slug = get_page_template_slug($page_template_id);

if (! is_front_page() && ! is_home() || ($page_template_slug == '')) {
  ?>
  <section class="section page-header" <?php if( ! empty($header_image) ) { echo 'style="background-image:url(' . esc_url($header_image) . ')"'; } ?>>
  <?php
}