<?php

/**
 * Robojob Customizer controls.
 *
 * @package robojob lite
 */

if ( ! class_exists( 'WP_Customize_Control' ) ) {
     return null; }
        /**
         * Adds radio support to the theme customizer
         */
        class robojob_lite_Contact_Customize_Radio_Control extends WP_Customize_Control {
            public $type = 'radio';
            public function render_content() {
                ?>

                    <label id="show_map" class="input-group">
                    <span class="customize-control-title"><?php esc_html_e('Choose Contact Page Banner', 'robojob-lite'); ?></span>
                        <label>
                            <input type="radio" name="contact-banner"  value="google-map" data-customize-setting-link="<?php echo esc_attr($this->id); ?>"><?php esc_html_e('Map', 'robojob-lite');?>
                        </label>
                        <label>
                            <input type="radio" name="contact-banner"  value="contact-image" data-customize-setting-link="<?php echo esc_attr($this->id); ?>"><?php esc_html_e('Image', 'robojob-lite');?>
                        </label>
                    </label>


                <?php

                        }
}

if ( ! class_exists( 'WP_Customize_Control' ) ) {
        return null; }
            /**
             * Adds textarea support to the theme customizer
             */
        class robojob_lite_Banner_Title_Customize_Text_Control extends WP_Customize_Control {
            public $type = 'text';
            public function render_content() {
                ?>
              <span class="customize-control-title" id="header_banner_title"><?php esc_html_e('Banner Title', 'robojob-lite');?></span>
                <input type="text" name="banner_title" value="<?php echo esc_attr( $this->value() ); ?>" <?php $this->link(); ?>  id = "banner_title">
                <?php
        }
}

if ( ! class_exists( 'WP_Customize_Control' ) ) {
        return null; }
            /**
             * Adds textarea support to the theme customizer
             */
        class robojob_lite_Banner_Sub_Title_Customize_Text_Control extends WP_Customize_Control {
            public $type = 'text';
            public function render_content() {
                ?>
              <span class="customize-control-title" id="header_banner_sub_title"><?php esc_html_e('Banner Sub Title', 'robojob-lite');?></span>
                <input type="text" name="banner_sub_title" value="<?php echo esc_attr( $this->value() ); ?>" <?php $this->link(); ?>  id = "banner_sub_title">
                <?php
        }
}

/**
*
* Class to create custom category dropdown section
*
**/
    class Robojob_Lite_Category_dropdown_control extends WP_Customize_Control {

        public function render_content() {
            $cat_args = array(
                    'taxonomy' => 'category',
                    'orderby' => 'name',
                );
            $categories = get_categories( $cat_args ); ?>
             <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
             <span><?php echo esc_html( $this->description ); ?></span><br>
                <select data-customize-setting-link="<?php echo esc_attr($this->id); ?>">
                    <option value="none" <?php selected( get_theme_mod($this->id), 'none' ); ?>><?php esc_html_e( 'None','robojob-lite' ); ?></option>
                    <?php foreach ( $categories as $post ) { ?>
                            <option value="<?php echo esc_attr($post->slug); ?>" <?php selected( $post->slug); ?>><?php echo esc_html($post->name); ?></option>
                    <?php } ?>
                </select> <br /><br />
            <?php
        }
    }


class robojob_lite_Support_Custom_Text_Control extends WP_Customize_Control {
        public $type = 'customtext';
        public $extra = ''; // we add this for the extra description
        public function render_content() {
        ?>

        <div class="robojob-buttons">

            <?php  printf( '<a href="https://codethemes.co/product/robojob/" class="button btn-customize" target="_blank">' ); ?>
                <span class="dashicons dashicons-star-filled"></span>
                <?php  esc_html_e('Buy Premium', 'robojob-lite');?>
            </a>

            <?php  printf( '<a href="https://docs.codethemes.co/docs/robojob-lite/" class="button btn-customize" target="_blank">' ); ?>
                <span class="dashicons dashicons-clipboard"></span>
                <?php  esc_html_e('Documentation', 'robojob-lite');?>
            </a>
            <?php  printf( '<a href="https://codethemes.co/my-tickets/" class="button btn-customize" target="_blank">' ); ?>
                <span class="dashicons dashicons-edit"></span>
                <?php  esc_html_e('Create a ticket', 'robojob-lite');?>
            </a>
            <?php  printf( '<a href="https://codethemes.co/support/#customization_support" class="button btn-customize btn-request" target="_blank">' ); ?>
                <span class="dashicons dashicons-admin-tools"></span>
                <?php  esc_html_e('Request Customization', 'robojob-lite');?>
            </a>
        </div>

        <?php

        }
    }
