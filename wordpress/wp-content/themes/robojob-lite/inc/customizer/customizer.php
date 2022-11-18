<?php
/**
 * Robojob-lite Theme Customizer.
 *
 * @package robojob-lite lite
 */

 /**
  * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
  *
  * @since  1.0.0
  */
function robojob_lite_customize_preview_js() {
	wp_enqueue_script( 'robojob-lite-customizer-live', get_template_directory_uri() . '/inc/customizer/assets/live.js', array( 'customize-preview' ), '20151215', true );
}
add_action( 'customize_preview_init', 'robojob_lite_customize_preview_js' );

/**
 * Binds JS scripts for Theme Customizer.
 *
 * @since  1.0.0
 */
function robojob_lite_enqueue_customizer_scripts() {
	wp_enqueue_style( 'robojob-lite-customizer-css', get_template_directory_uri() . '/inc/customizer/assets/customizer.css' );
}
add_action( 'customize_controls_enqueue_scripts', 'robojob_lite_enqueue_customizer_scripts' );

if ( ! function_exists( 'robojob_lite_add_customizer' ) ) {
	function robojob_lite_add_customizer( $wp_customize ) {

		$wp_customize->selective_refresh->add_partial( 'blogname', array(
            'selector' => '.navbar-brand span',
            'render_callback' => 'robojob_lite_customize_partial_blogname',
        ) );

        $wp_customize->selective_refresh->add_partial( 'blogdescription', array(
            'selector' => '.site-description',
            'render_callback' => 'robojob_lite_customize_partial_blogdescription',
        ) );

		$robojob_lite_theme_options = robojob_lite_options();

		/*
  ----------------------------
		Header Logo section
		-----------------------------*/

		$version = get_bloginfo('version');

		if ($version < '4.4.2' ) {

			$wp_customize->add_section( 'robojob_lite_header_logo' , array(
				'title'      => __('Header Logo','robojob-lite'),
				'priority'   => 39,
			) );

			$wp_customize->add_setting( 'robojob-lite[banner_text_color]', array(
					'default'           => '',
					'type'              => 'option',
					'capability' => 'edit_theme_options',
					'sanitize_callback' => 'robojob_lite_sanitize_text',
			) );

			$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'robojob_lite_banner_text_color', array(
				'label'    => __( 'Banner Text Color', 'robojob-lite' ),
				'section'  => 'colors',
				'settings' => 'robojob-lite[banner_text_color]',
				'priority' => 2,
			) ) );
		}

		/* Logo image */
		$wp_customize->add_setting( 'robojob-lite[logo_img]', array(
				'default'           => '',
				'type'              => 'option',
				'capability' => 'edit_theme_options',
				'sanitize_callback' => 'robojob_lite_sanitize_image',
		) );

		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'robojob_lite_logo_img', array(
			'label'    => __( 'Logo Image', 'robojob-lite' ),
			'section'  => 'robojob_lite_header_logo',
			'settings' => 'robojob-lite[logo_img]',
			'priority' => 1,
		) ) );

		$wp_customize->add_setting( 'robojob-lite[logo_height]', array(
			'default' => $robojob_lite_theme_options['logo_height'],
				'type'              => 'option',
				'sanitize_callback' => 'absint',
				'capability' => 'edit_theme_options',

		) );

		$wp_customize->add_control( 'robojob_lite_logo_height', array(
			'label'        => __( 'Logo Height in px', 'robojob-lite' ),
			'type' => 'text',
			'section'    => 'robojob_lite_header_logo',
			'settings'   => 'robojob-lite[logo_height]',
		) );

		/* General section */
		$wp_customize->add_panel( 'robojob_lite_theme_option', array(
		    'title' => __( 'Theme Options','robojob-lite' ),
		    'priority' => 46, // Mixed with top-level-section hierarchy.
		) );

		if ( class_exists('WP_Job_Manager')) {
				/*--------------------------------Sidebar section-------------------------*/

			$wp_customize->add_section( 'robojob_lite_job_sidebar' , array(
				'title'      => __('Sidebar Options','robojob-lite'),
				'panel' => 'robojob_lite_theme_option',
				'priority'   => 51,
			) );

			$wp_customize->add_setting(
				'robojob-lite[_job_sidebar]',
				array(
					'type'    => 'option',
					'default' => $robojob_lite_theme_options['_job_sidebar'],
					'sanitize_callback' => 'robojob_lite_sanitize_checkbox',
					'capability'        => 'edit_theme_options',
				)
			);

			$wp_customize->add_control( 'robojob-lite[_job_sidebar]', array(
				'label'        => __( 'Show job sidebar in single job and single company page ? ', 'robojob-lite' ),
				'type' => 'checkbox',
				'section'    => 'robojob_lite_job_sidebar',
				'settings'   => 'robojob-lite[_job_sidebar]',
			) );

		}

	}
}
add_action( 'customize_register', 'robojob_lite_add_customizer' );

require get_template_directory() . '/inc/customizer/customizer-banner-options.php';
require get_template_directory() . '/inc/customizer/customizer-additional.php';
