<?php
/**
 * Sanitize URL function for customizer
 *
 *  @package robojob lite
 */
function robojob_lite_sanitize_url( $url ) {
	return esc_url_raw( $url );
}

/**
 * Sanitize image URL
 *
 * @copyright Copyright (c) 2015, WordPress Theme Review Team
 */
function robojob_lite_sanitize_image( $image, $setting ) {
	/*
	 * Array of valid image file types.
	 *
	 * The array includes image mime types that are included in wp_get_mime_types()
	 */
	$mimes = array(
		'jpg|jpeg|jpe' => 'image/jpeg',
		'gif'          => 'image/gif',
		'png'          => 'image/png',
		'bmp'          => 'image/bmp',
		'tif|tiff'     => 'image/tiff',
		'ico'          => 'image/x-icon',
	);
	// Return an array with file extension and mime_type.
	$file = wp_check_filetype( $image, $mimes );
	// If $image has a valid mime_type, return it; otherwise, return the default.
	return ( $file['ext'] ? $image : $setting->default );
}

/**
 * Sanitize checkbox for customizer
 *
 * @copyright Copyright (c) 2015, WordPress Theme Review Team
 */


/**
 * Sanitize callback select input
 *
 * @copyright Copyright (c) 2015, WordPress Theme Review Team
 */
function robojob_lite_sanitize_select( $input, $setting ) {

	// Ensure input is a slug.
	$input = sanitize_key( $input );

	$control = robojob_lite_control_id_from_settings( $setting->id );

	// Get list of choices from the control associated with the setting.
	$choices = $setting->manager->get_control( $control )->choices;

	// If the input is a valid key, return it; otherwise, return the default.
	return ( array_key_exists( $input, $choices ) ? $input : $setting->default );
}

/**
 * Sanitize numeric value
 *
 * @copyright Copyright (c) 2015, WordPress Theme Review Team
 */

/**
 * Get typical ID for control from related setting name
 *
 * @param  string $settings settings name.
 * @return string
 */
function robojob_lite_control_id_from_settings( $settings ) {
	$name = trim( $settings, ']' );
	return preg_replace( '/[\[\]]/', '_', $name );
}

function robojob_lite_sanitize_text( $input ) {
    return wp_kses_post( force_balance_tags( $input ) );
}

function robojob_lite_sanitize_checkbox( $input ) {
	return ( ( isset( $input ) && true == $input ) ? true : false );
}

function robojob_lite_sanitize_integer( $input ) {
    return (int) ($input);
}