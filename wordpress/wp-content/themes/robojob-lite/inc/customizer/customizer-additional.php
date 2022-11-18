<?php
/**
 * Robojob Documentation and Support Customizer.
 *
 * @package robojob lite
 */

function robojob_lite_additional_info( $wp_customize ) {
	$robojob_lite_theme_options = robojob_lite_options();

	$wp_customize->add_section(
	    'robojob_lite_support',
	    array(
	        'title' => __( 'Robojob Support','robojob-lite' ),
	        'capability' => 'edit_theme_options',
	    )
    );

    $wp_customize->add_setting(
        'robojob-lite[doc_supp]',
        array(
            'default' => '',
	        'type'              => 'option',
            'sanitize_callback' => 'sanitize_text_field',
            'capability'        => 'edit_theme_options',
        )
    );

      $wp_customize->add_control( new robojob_lite_Support_Custom_Text_Control( $wp_customize, 'robojob-lite[doc_supp]', array(
			'section'  => 'robojob_lite_support',
			'type' => 'customtext',
			'settings'   => 'robojob-lite[doc_supp]',
		))
	);
}
add_action( 'customize_register', 'robojob_lite_additional_info' );