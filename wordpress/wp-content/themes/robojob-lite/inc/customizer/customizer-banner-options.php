<?php

/**
 * Robojob Banner Customizer.
 *
 * @package robojob lite
 */

function robojob_lite_banner_options( $wp_customize ) {
	$robojob_lite_theme_options = robojob_lite_options();

	$wp_customize->add_section(
	'banner_section',array(
		'title' => __('Banner Options', 'robojob-lite'),
		'panel' => 'robojob_lite_theme_option',
	    'priority' => 42,
	));

	$wp_customize->add_setting(
	  'robojob-lite[banner_page_id]',
	  array(
	    'default'           =>0,
	    'type'              =>'option',
	    'sanitize_callback' =>'absint',
	    'capability'        =>'edit_theme_options'
	    )
	  );
	$wp_customize->add_control( 'banner_page_id', array(
	  'label'        =>  __('Choose a Page For Banner:', 'robojob-lite' ),
	  'type'    => 'dropdown-pages',
	  'section'    => 'banner_section',
	  'settings'   => 'robojob-lite[banner_page_id]'
	  ) );

	if ( class_exists('WP_Job_Manager')) { //Checked for plugin existence

	$wp_customize->add_setting( 'robojob-lite[find_a_job_link]', array(
		'default' => $robojob_lite_theme_options['find_a_job_link'],
			'type'              => 'option',
			'sanitize_callback' => 'sanitize_text_field',
			'capability' => 'edit_theme_options',

	) );

	$wp_customize->add_control( 'robojob_lite_find_a_job_link', array(
		'label'        => __( 'Find a job link', 'robojob-lite' ),
		'description'        => __( 'Add page slug of find job page', 'robojob-lite' ),
		'type' => 'text',
		'section'    => 'banner_section',
		'settings'   => 'robojob-lite[find_a_job_link]',
	) );

	$wp_customize->add_setting( 'robojob-lite[post_a_job_link]', array(
	'default' => $robojob_lite_theme_options['post_a_job_link'],
		'type'              => 'option',
		'sanitize_callback' => 'sanitize_text_field',
		'capability' => 'edit_theme_options',

	) );

	$wp_customize->add_control( 'robojob_lite_post_a_job_link', array(
		'label'        => __( 'Post a job link', 'robojob-lite' ),
		'description'        => __( 'Add page slug of post a job page', 'robojob-lite' ),
		'type' => 'text',
		'section'    => 'banner_section',
		'settings'   => 'robojob-lite[post_a_job_link]',
	) );

	$wp_customize->add_setting( 'robojob-lite[manage_job_link]', array(
		'default' => $robojob_lite_theme_options['manage_job_link'],
		'type'              => 'option',
		'sanitize_callback' => 'sanitize_text_field',
		'capability' => 'edit_theme_options',

	) );

	$wp_customize->add_control( 'robojob_lite_manage_job_link', array(
		'label'        => __( 'Manage job link', 'robojob-lite' ),
		'description'        => __( 'Add page slug of manage job page', 'robojob-lite' ),
		'type' => 'text',
		'section'    => 'banner_section',
		'settings'   => 'robojob-lite[manage_job_link]',
	) );
	}
}
add_action( 'customize_register', 'robojob_lite_banner_options');