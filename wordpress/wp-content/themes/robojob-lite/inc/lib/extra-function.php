<?php
/**
 * Robojob-lite extra-functions.
 *
 * @package robojob lite
 */

if ( ! function_exists('robojob_lite_extra_customize_register') ) {

    function robojob_lite_extra_customize_register( $wp_customize ) {

                $wp_customize->add_section(
                    'latest_blog_options',
                         array(
                            'title'    => __( 'Blog Options','robojob-lite' ),
                            'description' => __('These settings are for frontpage template', 'robojob-lite'),
                            'priority' => 46,
                            'panel' => 'robojob_lite_theme_option',
                            )
                );
                $wp_customize->add_section(
                    'cta_options',
                        array(
                            'title'    => __( 'Call To Action','robojob-lite' ),
                            'panel' => 'robojob_lite_theme_option',
                            'priority' => 48,

                            )
                );

             // Latest Blog Section
            $wp_customize->add_setting('robojob-lite[blog_checkbox]',
                    array(
                        'type'    => 'option',
                        'sanitize_callback' => 'robojob_lite_sanitize_checkbox',
                        'default' => '1',
                        )
            );
            $wp_customize->add_control('robojob-lite[blog_checkbox]',
                    array(
                        'type'    => 'checkbox',
                        'label'   => esc_html__( 'Show blog posts in Home Page', 'robojob-lite' ),
                        'section' => 'latest_blog_options',
                        'priority'    => 1,
                        )
            );

            $wp_customize->add_setting('robojob-lite[blog_title]',
                array(
                    'type'    => 'option',
                    'sanitize_callback' => 'esc_html',
                    'default' => esc_html__( 'Recent Posts', 'robojob-lite' ),
                )
            );
            $wp_customize->add_control('robojob-lite[blog_title]',
                array(
                    'type'    => 'text',
                    'label'   => esc_html__( 'Blog Title', 'robojob-lite' ),
                    'section' => 'latest_blog_options',
                    'priority'    => 1,
                )
            );

             $wp_customize->add_setting( 'robojob-lite[blog_category]', array(
                        'type'    => 'option',
                        'default'           => 'None',
                        'capability'        => 'edit_theme_options',
                        'sanitize_callback' => 'robojob_lite_sanitize_text',
                    ) );

            $wp_customize->add_control( new Robojob_Lite_Category_dropdown_control( $wp_customize, 'robojob-lite[blog_category]', array(
                    'label'       => __( 'Choose category','robojob-lite' ),
                    'section'     => 'latest_blog_options',
                    'priority'    => 3,

                ) ) );

            $wp_customize->add_setting( 'robojob-lite[blog_excerpt_length]', array(
                'default'           => '100',
                'type'              => 'option',
                'sanitize_callback' => 'absint',
                'capability'        => 'edit_theme_options',

            ) );

            $wp_customize->add_control( 'robojob_lite_logo_height', array(
                'label'        => __( 'Excerpt length for blog section in homepage', 'robojob-lite' ),
                'type' => 'text',
                'section'    => 'latest_blog_options',
                'settings'   => 'robojob-lite[blog_excerpt_length]',
            ) );

            $wp_customize->add_setting(
                    'robojob-lite[blog_meta]',
                    array(
                        'type'    => 'option',
                        'sanitize_callback' => 'robojob_lite_sanitize_checkbox',
                        'default' => '1',
                        )
            );
            $wp_customize->add_control(
                    'robojob-lite[blog_meta]',
                    array(
                        'label'   => esc_html__( 'Show Metas', 'robojob-lite' ),
                        'description'   => esc_html__( 'show/hide metas in frontpage and archive page?', 'robojob-lite' ),
                        'type'    => 'checkbox',
                        'section' => 'latest_blog_options',
                        )
            );



            $wp_customize->add_setting(
                    'robojob-lite[blog_author_image]',
                    array(
                        'type'    => 'option',
                        'sanitize_callback' => 'robojob_lite_sanitize_checkbox',
                        'default' => '1',
                        )
            );
            $wp_customize->add_control(
                    'robojob-lite[blog_author_image]',
                    array(
                        'label'   => esc_html__( 'Show Author Image', 'robojob-lite' ),
                        'description'   => esc_html__( 'show/hide author image in frontpage and archive page?', 'robojob-lite' ),
                        'type'    => 'checkbox',
                        'section' => 'latest_blog_options',
                        )
            );
              // CTA Section
            $wp_customize->add_setting(
              'robojob-lite[cta_page_id]',
              array(
                'default'           =>0,
                'type'              =>'option',
                'sanitize_callback' =>'absint',
                'capability'        =>'edit_theme_options'
                )
              );

            $wp_customize->add_control( 'cta_page_id', array(
              'label'        =>  __('Choose a page to be displayed as CTA :', 'robojob-lite' ),
              'type'    => 'dropdown-pages',
              'section'    => 'cta_options',
              'settings'   => 'robojob-lite[cta_page_id]'
              ) );

            $wp_customize->add_setting('robojob-lite[cta_button_link]',
                array(
                    'type' => 'option',
                    'sanitize_callback' => 'esc_url_raw',
                    )
            );
            $wp_customize->add_control('robojob-lite[cta_button_link]',
                array(
                    'label'    => esc_html__( 'Button Link', 'robojob-lite' ),
                    'section'  => 'cta_options',
                    'settings' => 'robojob-lite[cta_button_link]',
                    'type'     => 'text',
                    )
            );

    }
    add_action( 'customize_register', 'robojob_lite_extra_customize_register' );
}

if (! function_exists('robojob_lite_get_excerpt')) {
    function robojob_lite_get_excerpt( $post_id, $count ) {
        $content_post = get_post($post_id);
        $excerpt = $content_post->post_content;
        $excerpt = strip_tags($excerpt);
        $excerpt = strip_shortcodes($excerpt);
        $excerpt = preg_replace('/\s\s+/', ' ', $excerpt);
        $strip = explode( ' ' ,$excerpt );
        foreach ($strip as $key => $single ) {
            if ( ! filter_var($single, FILTER_VALIDATE_URL) === false ) {
                unset($strip[ $key ]);
            }
        }
        $excerpt = implode( ' ', $strip );
        $excerpt = substr($excerpt, 0, $count);
        if (strlen($excerpt) >= $count ) {
            $excerpt = substr($excerpt, 0, strripos($excerpt, ' '));
            $excerpt = $excerpt . '...';
        }
        return $excerpt;
    }
}