<?php
/**
 * Singleton class for handling the theme's customizer integration.
 *
 * @since  1.0.0
 * @access public
 */
final class Robojob_Lite_Upgrage_To_Pro {

	/**
	 * Returns the instance.
	 *
	 */
	public static function get_instance() {

		static $instance = null;

		if ( is_null( $instance ) ) {
			$instance = new self;
			$instance->setup_actions();
		}

		return $instance;
	}

	/**
	 * Constructor method.
	 *
	 */
	private function __construct() {}

	/**
	 * Sets up initial actions.
	 *
	 */
	private function setup_actions() {

		// Register panels, sections, settings, controls, and partials.
		add_action( 'customize_register', array( $this, 'sections' ) );

	}

	/**
	 * Sets up the customizer sections.
	 *
	 */
	public function sections( $manager ) {

		// Load custom sections.
		require_once( get_template_directory(). '/inc/customizer/section-upgrade-to-pro.php' );

		// Register custom section types.
		$manager->register_section_type( 'Robojob_Lite_Customize_Section' );

		// Register sections.
		$manager->add_section(
			new Robojob_Lite_Customize_Section(
				$manager,
				'robojob_lite_upgrade_to_pro',
				array(

					'pro_text' => wp_kses_post( "Upgrade To Premium", 'robojob-lite' ),
					'pro_url'  => esc_url('https://codethemes.co/theme/robojob/?utm_source=wporg&utm_campaign=robojoblite', 'robojob-lite'),
					'priority' => 1,
				)
			)
		);
	}
}

// Doing this customizer thang!
Robojob_Lite_Upgrage_To_Pro::get_instance();