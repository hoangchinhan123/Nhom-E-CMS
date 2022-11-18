<?php
/**
 * robojob functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @package robojob lite
 */

if ( ! function_exists( 'robojob_lite_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function robojob_lite_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on robojob, use a find and replace
		 * to change 'robojob-lite' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'robojob-lite', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		// Add block styles.
		add_theme_support('wp-block-styles');

		//Add Responsive embeds.
		add_theme_support( 'responsive-embeds');

		//Add align width.
		add_theme_support( 'align-wide');

		
		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		add_theme_support( 'custom-logo', array(
		   'height'      => 175,
		   'width'       => 400,
		   'flex-width' => true,
		));

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		add_image_size( 'robojob-lite-post-image', 690, 520, true );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'primary' => esc_html__( 'Primary', 'robojob-lite' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		/*
		 * Enable support for Post Formats.
		 * See https://developer.wordpress.org/themes/functionality/post-formats/
		 */
		add_theme_support( 'post-formats', array(
			'aside',
			'image',
			'video',
			'quote',
			'link',
			'gallery',
		) );

		// Add customizer edit shortcodes
		add_theme_support( 'customize-selective-refresh-widgets' );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'robojob_lite_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		add_theme_support( 'job-manager-templates' );

	}
endif;
add_action( 'after_setup_theme', 'robojob_lite_setup' );

if ( ! function_exists( 'robojob_lite_add_editor_styles' ) ) {
	// Add editor styles
	function robojob_lite_add_editor_styles() {
	    add_editor_style( '/assets/css/admin/editor-styles.min.css' );
	    $font_url = '//fonts.googleapis.com/css?family=Open+Sans:400,700|Droid+Serif:400,400italic,700,700italic';
	    add_editor_style( str_replace( ',', '%2C', $font_url ) );
	}
	add_action( 'init', 'robojob_lite_add_editor_styles' );
}

if ( ! function_exists( 'robojob_lite_content_width' ) ) {
	/**
	 * Set the content width in pixels, based on the theme's design and stylesheet.
	 *
	 * Priority 0 to make it available to lower priority callbacks.
	 *
	 * @global int $content_width
	 */
	function robojob_lite_content_width() {
		$GLOBALS['content_width'] = apply_filters( 'robojob_lite_content_width', 640 );
	}
	add_action( 'after_setup_theme', 'robojob_lite_content_width', 0 );
}
/**
 * Theme styles and scripts enqueue
 */
require get_template_directory() . '/inc/enqueue.php';


/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

require get_template_directory() . '/inc/custom-header.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer/customizer.php';

/**
 * Sanitization additions.
 */
require get_template_directory() . '/inc/customizer/robojob-lite-sanitization.php';

/**
 * sidebar additions.
 */
require get_template_directory() . '/inc/robojob-lite-sidebar.php';

/**
 * Nav Walker additions.
 */
if ( ! class_exists( 'wp_bootstrap_navwalker' )) {
	require get_template_directory() . '/inc/wp_bootstrap_navwalker.php';
}

/**
 * robojob functions
 */
require get_template_directory() . '/inc/lib/robojob-lite-functions.php';

require get_template_directory() . '/inc/lib/robojob-lite-banner.php';

/**
 * robojob shortcode
 */

require get_template_directory() . '/inc/lib/extra-function.php';

require get_template_directory() . '/inc/lib/extra-posts.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

require get_template_directory() . '/inc/customizer/robojob-lite-customize-control.php';

require_once get_template_directory() . '/inc/customizer/class-upgrade-to-pro.php';

/**
 * Include the TGM_Plugin_Activation class.
 */
get_template_part('inc/plugin', 'activation');

/**
 * This file represents an example of the code that themes would use to register
 * the required plugins.
 *
 * It is expected that theme authors would copy and paste this code into their
 * functions.php file, and amend to suit.
 *
 * @see http://tgmpluginactivation.com/configuration/ for detailed documentation.
 *
 * @package    TGM-Plugin-Activation
 * @subpackage Example
 * @version    2.5.2 for parent theme Robojob
 * @author     Thomas Griffin, Gary Jones, Juliette Reinders Folmer
 * @copyright  Copyright (c) 2011, Thomas Griffin
 * @license    http://opensource.org/licenses/gpl-2.0.php GPL v2 or later
 * @link       https://github.com/TGMPA/TGM-Plugin-Activation
 */

/**
 * Include the TGM_Plugin_Activation class.
 */
add_action( 'tgmpa_register', 'robojob_lite_register_required_plugins' );
/**
 * Register the required plugins for this theme.
 *
 * In this example, we register five plugins:
 * - one included with the TGMPA library
 * - two from an external source, one from an arbitrary source, one from a GitHub repository
 * - two from the .org repo, where one demonstrates the use of the `is_callable` argument
 *
 * The variable passed to tgmpa_register_plugins() should be an array of plugin
 * arrays.
 *
 * This function is hooked into tgmpa_init, which is fired within the
 * TGM_Plugin_Activation class constructor.
 */
if ( ! function_exists('robojob_lite_register_required_plugins') ) {
	function robojob_lite_register_required_plugins() {
		/*
		 * Array of plugin arrays. Required keys are name and slug.
		 * If the source is NOT from the .org repo, then source is also required.
		 */
		$plugins = array(

			array(
				'name'      => __('WP Job Manager', 'robojob-lite'),
				'slug'      => 'wp-job-manager',
				'required'  => false,
			),

			array(
				'name'      => __('Contact Form 7', 'robojob-lite'),
				'slug'      => 'contact-form-7',
				'required'  => false,
			),

			array(
				'name'      => __('Customizer Export/Import', 'robojob-lite'),
				'slug'      => 'customizer-export-import',
				'required'  => false,
			),

			array(
				'name'      => __('WP Job Manager - Company Profiles', 'robojob-lite'),
				'slug'      => 'wp-job-manager-companies',
				'required'  => false,
			),

			array(
				'name'      => __('WP Job Manager - Contact Listing ', 'robojob-lite'),
				'slug'      => 'wp-job-manager-contact-listing',
				'required'  => false,
			),

			array(
				'name'      => __('WP Job Manager - Job Type Colors ', 'robojob-lite'),
				'slug'      => 'wp-job-manager-colors',
				'required'  => false,
			),

			array(
				'name'      => __('User Role Editor', 'robojob-lite'),
				'slug'      => 'user-role-editor',
				'required'  => false,
			),

		);

		/*
		 * Array of configuration settings. Amend each line as needed.
		 *
		 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
		 * strings available, please help us make TGMPA even better by giving us access to these translations or by
		 * sending in a pull-request with .po file(s) with the translations.
		 *
		 * Only uncomment the strings in the config array if you want to customize the strings.
		 */
		$config = array(
			'id'           => 'robojob-lite',                 // Unique ID for hashing notices for multiple instances of TGMPA.
			'default_path' => '',                      // Default absolute path to bundled plugins.
			'menu'         => 'tgmpa-install-plugins', // Menu slug.
			'parent_slug'  => 'themes.php',            // Parent menu slug.
			'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
			'has_notices'  => true,                    // Show admin notices or not.
			'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
			'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
			'is_automatic' => false,                   // Automatically activate plugins after installation or not.
			'message'      => '',                      // Message to output right before the plugins table.
		);

		tgmpa( $plugins, $config );
	}
}

if (! function_exists('robojob_lite_add_menu_users')) {
	add_filter( 'wp_nav_menu_items', 'robojob_lite_add_menu_users', 10, 2 );
	function robojob_lite_add_menu_users( $items, $args ) {
			global $current_user;
			wp_get_current_user();
			$username = $current_user->user_login;
			$useremail = $current_user->user_email;
			$robojob_lite_theme_options = robojob_lite_options();
			$manage_job_link = $robojob_lite_theme_options['manage_job_link'];
		  	if (is_user_logged_in() && $args->theme_location == 'primary' ) {
			  	if ( current_user_can('edit_theme_options') || current_user_can('edit_job_listings')  ) {
			       $items .= '<li class="menu-item menu-item-has-children menu-item-avatar dropdown"><a><span>'.get_avatar( $useremail, 32 ).'</span></a>';
			       $items .= '<ul role="menu" class="sub-menu dropdown-menu">';
			       $items .= '<li class="menu-item"><a href="'.   esc_url( home_url( $manage_job_link )) .'">'.__('Manage Jobs', 'robojob-lite').'</a></li>';
			       $items .= '<li class="menu-item"><a href="'.   esc_url(admin_url( 'profile.php' ) ) .'">'.__('Edit Profile', 'robojob-lite').'</a></li>';
			       $items .= '<li class="menu-item"><a href="'.  esc_url(wp_logout_url( get_permalink() )) .'">'.__('Log Out', 'robojob-lite').'</a></li>';
			       $items .= '</ul';
			       $items .= '</li>';
			    }

			}

		    elseif ( ! is_user_logged_in() && $args->theme_location == 'primary' ) {

		       $items .= '<li class="login-menu"><a href="'. esc_url(wp_login_url( home_url() )).'" title="'.esc_attr__('Login', 'robojob-lite').'">'.esc_html__('Log In', 'robojob-lite').'</a></li>';

		    }

		   return $items;

	}
}