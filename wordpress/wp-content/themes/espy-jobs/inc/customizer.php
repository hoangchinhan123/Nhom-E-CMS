<?php
/**
 * espyjobs Theme Customizer
 *
 * @package espyjobs
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function espyjobs_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	$espyjobs_options = espyjobs_theme_options();

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial(
			'blogname',
			array(
				'selector'        => '.site-title a',
				'render_callback' => 'espyjobs_customize_partial_blogname',
			)
		);
		$wp_customize->selective_refresh->add_partial(
			'blogdescription',
			array(
				'selector'        => '.site-description',
				'render_callback' => 'espyjobs_customize_partial_blogdescription',
			)
		);
	}

    $wp_customize->add_setting('espyjobs_theme_options[site_title_show]',
        array(
            'type' => 'option',
            'default'        => true,
            'default' => $espyjobs_options['site_title_show'],
            'sanitize_callback' => 'espyjobs_sanitize_checkbox',
        )
    );

    $wp_customize->add_control('espyjobs_theme_options[site_title_show]',
        array(
            'label' => esc_html__('Show Title & Tagline', 'espy-jobs'),
            'type' => 'Checkbox',
            'section' => 'title_tagline',

        )
    );
    $wp_customize->add_panel(
        'theme_options',
        array(
            'title' => esc_html__('Theme Options', 'espy-jobs'),
            'priority' => 2,
        )
    );



  
    $wp_customize->add_section(
        'header_section',
        array(
            'title' => esc_html__( 'Header Section','espy-jobs' ),
            'panel'=>'theme_options',
            'capability'=>'edit_theme_options',
        )
    );

	$wp_customize->add_setting('espyjobs_theme_options[header_button_txt]',
	    array(
	        'type' => 'option',
	        'default' => $espyjobs_options['header_button_txt'],
	        'sanitize_callback' => 'sanitize_text_field',
	    )
	);
	$wp_customize->add_control('espyjobs_theme_options[header_button_txt]',
	    array(
	        'label' => esc_html__('Button Text', 'espy-jobs'),
	        'type' => 'text',
	        'section' => 'header_section',
	        'settings' => 'espyjobs_theme_options[header_button_txt]',
	    )
	);
	$wp_customize->add_setting('espyjobs_theme_options[header_button_url]',
	    array(
	        'type' => 'option',
	        'default' => $espyjobs_options['header_button_url'],
	        'sanitize_callback' => 'espyjobs_sanitize_url',
	    )
	);
	$wp_customize->add_control('espyjobs_theme_options[header_button_url]',
	    array(
	        'label' => esc_html__('Button Link', 'espy-jobs'),
	        'type' => 'text',
	        'section' => 'header_section',
	        'settings' => 'espyjobs_theme_options[header_button_url]',
	    )
	);
	
	

    
	/* Banner Section */

$wp_customize->add_section(
    'banner_section',
    array(
        'title' => esc_html__( 'Banner Section','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[banner_title]',
    array(
        'capability' => 'edit_theme_options',
        'default' => $espyjobs_options['banner_title'],
        'sanitize_callback' => 'sanitize_text_field',
        'type' => 'option',
    )
);
$wp_customize->add_control('espyjobs_theme_options[banner_title]',
    array(
        'label' => esc_html__('Banner Title', 'espy-jobs'),
        'priority' => 1,
        'section' => 'banner_section',
        'type' => 'text',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[banner_desc]',
    array(
        'default' => $espyjobs_options['banner_desc'],
        'type' => 'option',
        'sanitize_callback' => 'sanitize_text_field'
    )
);

$wp_customize->add_control('espyjobs_theme_options[banner_desc]',
    array(
        'label' => esc_html__('Section Description', 'espy-jobs'),
        'type' => 'text',
        'section' => 'banner_section',
        'settings' => 'espyjobs_theme_options[banner_desc]',
    )
);
$wp_customize->add_setting('espyjobs_theme_options[banner_bg_image]',
array(
    'type' => 'option',
    'sanitize_callback' => 'esc_url_raw',
)
);
$wp_customize->add_control(
new WP_Customize_Image_Control(
    $wp_customize,
    'espyjobs_theme_options[banner_bg_image]',
    array(
        'label' => esc_html__('Add Background Image', 'espy-jobs'),
        'section' => 'banner_section',
        'settings' => 'espyjobs_theme_options[banner_bg_image]',
    ))
);



/* CTA Section */

$wp_customize->add_section(
    'cta_section',
    array(
        'title' => esc_html__( 'Call to Action Section','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);


$wp_customize->add_setting('espyjobs_theme_options[cta_show]',
    array(
        'type' => 'option',
        'default'        => true,
        'default' => $espyjobs_options['cta_show'],
        'sanitize_callback' => 'espyjobs_sanitize_checkbox',
    )
);

$wp_customize->add_control('espyjobs_theme_options[cta_show]',
    array(
        'label' => esc_html__('Show CTA Section', 'espy-jobs'),
        'type' => 'Checkbox',
        'priority' => 1,
        'section' => 'cta_section',

    )
);
$wp_customize->add_setting('espyjobs_theme_options[cta_title]',
    array(
        'type' => 'option',
        'sanitize_callback' => 'sanitize_text_field',
    )
);
$wp_customize->add_control('cta_title',
    array(
        'label' => esc_html__('Title', 'espy-jobs'),
        'type' => 'text',
        'section' => 'cta_section',
        'settings' => 'espyjobs_theme_options[cta_title]',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[cta_subtitle]',
array(
    'type' => 'option',
    'sanitize_callback' => 'sanitize_text_field',
)
);
$wp_customize->add_control('cta_subtitle',
array(
    'label' => esc_html__('Description', 'espy-jobs'),
    'type' => 'text',
    'section' => 'cta_section',
    'settings' => 'espyjobs_theme_options[cta_subtitle]',
)
);
$wp_customize->add_setting('espyjobs_theme_options[cta_button_txt]',
    array(
        'type' => 'option',
        'default' => $espyjobs_options['cta_button_txt'],
        'sanitize_callback' => 'sanitize_text_field',
    )
);
$wp_customize->add_control('espyjobs_theme_options[cta_button_txt]',
    array(
        'label' => esc_html__('CTA Button Text', 'espy-jobs'),
        'type' => 'text',
        'section' => 'cta_section',
        'settings' => 'espyjobs_theme_options[cta_button_txt]',
    )
);
$wp_customize->add_setting('espyjobs_theme_options[cta_button_url]',
    array(
        'type' => 'option',
        'default' => $espyjobs_options['cta_button_url'],
        'sanitize_callback' => 'espyjobs_sanitize_url',
    )
);
$wp_customize->add_control('espyjobs_theme_options[cta_button_url]',
    array(
        'label' => esc_html__('CTA Button Link', 'espy-jobs'),
        'type' => 'text',
        'section' => 'cta_section',
        'settings' => 'espyjobs_theme_options[cta_button_url]',
    )
);


$wp_customize->add_setting('espyjobs_theme_options[cta_bg_image]',
    array(
        'type' => 'option',
        'sanitize_callback' => 'esc_url_raw',
    )
);
$wp_customize->add_control(
    new WP_Customize_Image_Control(
        $wp_customize,
        'espyjobs_theme_options[cta_bg_image]',
        array(
            'label' => esc_html__('Add Background Image', 'espy-jobs'),
            'section' => 'cta_section',
            'settings' => 'espyjobs_theme_options[cta_bg_image]',
        ))
);



/* Blog Section */

$wp_customize->add_section(
    'article_section',
    array(
        'title' => esc_html__( 'Blog Section','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[blog_show]',
    array(
        'type' => 'option',
        'default'        => true,
        'default' => $espyjobs_options['blog_show'],
        'sanitize_callback' => 'espyjobs_sanitize_checkbox',
    )
);

$wp_customize->add_control('espyjobs_theme_options[blog_show]',
    array(
        'label' => esc_html__('Show Blog Section', 'espy-jobs'),
        'type' => 'Checkbox',
        'priority' => 1,
        'section' => 'article_section',

    )
);
$wp_customize->add_setting('espyjobs_theme_options[blog_title]',
    array(
        'capability' => 'edit_theme_options',
        'default' => $espyjobs_options['blog_title'],
        'sanitize_callback' => 'sanitize_text_field',
        'type' => 'option',
    )
);
$wp_customize->add_control('espyjobs_theme_options[blog_title]',
    array(
        'label' => esc_html__('Section Title', 'espy-jobs'),
        'priority' => 1,
        'section' => 'article_section',
        'type' => 'text',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[blog_desc]',
    array(
        'default' => $espyjobs_options['blog_desc'],
        'type' => 'option',
        'sanitize_callback' => 'sanitize_text_field'
    )
);

$wp_customize->add_control('espyjobs_theme_options[blog_desc]',
    array(
        'label' => esc_html__('Blog Section Description', 'espy-jobs'),
        'type' => 'text',
        'section' => 'article_section',
        'settings' => 'espyjobs_theme_options[blog_desc]',
    )
);


/* Job Section */

$wp_customize->add_section(
    'job_section',
    array(
        'title' => esc_html__( 'Job Section','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[job_show]',
    array(
        'type' => 'option',
        'default'        => true,
        'default' => $espyjobs_options['job_show'],
        'sanitize_callback' => 'espyjobs_sanitize_checkbox',
    )
);

$wp_customize->add_control('espyjobs_theme_options[job_show]',
    array(
        'label' => esc_html__('Show Job Section', 'espy-jobs'),
        'type' => 'Checkbox',
        'priority' => 1,
        'section' => 'job_section',

    )
);
$wp_customize->add_setting('espyjobs_theme_options[job_title]',
    array(
        'capability' => 'edit_theme_options',
        'default' => $espyjobs_options['job_title'],
        'sanitize_callback' => 'sanitize_text_field',
        'type' => 'option',
    )
);
$wp_customize->add_control('espyjobs_theme_options[job_title]',
    array(
        'label' => esc_html__('Section Title', 'espy-jobs'),
        'priority' => 1,
        'section' => 'job_section',
        'type' => 'text',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[job_desc]',
    array(
        'default' => $espyjobs_options['job_desc'],
        'type' => 'option',
        'sanitize_callback' => 'sanitize_text_field'
    )
);

$wp_customize->add_control('espyjobs_theme_options[job_desc]',
    array(
        'label' => esc_html__('Section Description', 'espy-jobs'),
        'type' => 'text',
        'section' => 'job_section',
        'settings' => 'espyjobs_theme_options[job_desc]',
    )
);


/* Blog Section */

$wp_customize->add_section(
    'article_section',
    array(
        'title' => esc_html__( 'Blog Section','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[blog_show]',
    array(
        'type' => 'option',
        'default'        => true,
        'default' => $espyjobs_options['blog_show'],
        'sanitize_callback' => 'espyjobs_sanitize_checkbox',
    )
);

$wp_customize->add_control('espyjobs_theme_options[blog_show]',
    array(
        'label' => esc_html__('Show Blog Section', 'espy-jobs'),
        'type' => 'Checkbox',
        'priority' => 1,
        'section' => 'article_section',

    )
);
$wp_customize->add_setting('espyjobs_theme_options[blog_title]',
    array(
        'capability' => 'edit_theme_options',
        'default' => $espyjobs_options['blog_title'],
        'sanitize_callback' => 'sanitize_text_field',
        'type' => 'option',
    )
);
$wp_customize->add_control('espyjobs_theme_options[blog_title]',
    array(
        'label' => esc_html__('Section Title', 'espy-jobs'),
        'priority' => 1,
        'section' => 'article_section',
        'type' => 'text',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[blog_desc]',
    array(
        'default' => $espyjobs_options['blog_desc'],
        'type' => 'option',
        'sanitize_callback' => 'sanitize_text_field'
    )
);

$wp_customize->add_control('espyjobs_theme_options[blog_desc]',
    array(
        'label' => esc_html__('Blog Section Description', 'espy-jobs'),
        'type' => 'text',
        'section' => 'article_section',
        'settings' => 'espyjobs_theme_options[blog_desc]',
    )
);

$wp_customize->add_setting('espyjobs_theme_options[blog_category]', array(
    'default' => $espyjobs_options['blog_category'],
    'type' => 'option',
    'sanitize_callback' => 'espyjobs_sanitize_select',
    'capability' => 'edit_theme_options',

));

$wp_customize->add_control(new espyjobs_Dropdown_Customize_Control(
    $wp_customize, 'espyjobs_theme_options[blog_category]',
    array(
        'label' => esc_html__('Select Blog Category', 'espy-jobs'),
        'section' => 'article_section',
        'choices' => espyjobs_get_categories_select(),
        'settings' => 'espyjobs_theme_options[blog_category]',
    )
));





    $wp_customize->add_section(
        'blog_section',
        array(
            'title' => esc_html__( 'Archive Blog Cards','espy-jobs' ),
            'panel'=>'theme_options',
            'capability'=>'edit_theme_options',
        )
    );
    $wp_customize->add_setting('espyjobs_theme_options[show_image]',
        array(
            'type' => 'option',
            'default'        => true,
            'default' => $espyjobs_options['show_image'],
            'sanitize_callback' => 'espyjobs_sanitize_checkbox',
        )
    );

    $wp_customize->add_control('espyjobs_theme_options[show_image]',
        array(
            'label' => esc_html__('Show Featured Image in Blog Cards and Single Posts Page', 'espy-jobs'),
            'type' => 'Checkbox',
            'priority' => 1,
            'section' => 'blog_section',

        )
    );
    $wp_customize->add_setting('espyjobs_theme_options[show_blog_date]',
    array(
        'type' => 'option',
        'default'        => true,
        'default' => $espyjobs_options['show_blog_date'],
        'sanitize_callback' => 'espyjobs_sanitize_checkbox',
    )
);

$wp_customize->add_control('espyjobs_theme_options[show_blog_date]',
    array(
        'label' => esc_html__('Show Date Meta in Blog Cards and Single Posts Page', 'espy-jobs'),
        'type' => 'Checkbox',
        'priority' => 1,
        'section' => 'blog_section',

    )
);

$wp_customize->add_setting('espyjobs_theme_options[show_blog_author]',
array(
    'type' => 'option',
    'default'        => true,
    'default' => $espyjobs_options['show_blog_author'],
    'sanitize_callback' => 'espyjobs_sanitize_checkbox',
)
);

$wp_customize->add_control('espyjobs_theme_options[show_blog_author]',
array(
    'label' => esc_html__('Show Author Meta in Blog Cards and Single Posts Page', 'espy-jobs'),
    'type' => 'Checkbox',
    'priority' => 1,
    'section' => 'blog_section',

)
);

$wp_customize->add_setting('espyjobs_theme_options[show_excerpts]',
array(
    'type' => 'option',
    'default'        => true,
    'default' => $espyjobs_options['show_excerpts'],
    'sanitize_callback' => 'espyjobs_sanitize_checkbox',
)
);

$wp_customize->add_control('espyjobs_theme_options[show_excerpts]',
array(
    'label' => esc_html__('Show Excerpts in Blog Cards', 'espy-jobs'),
    'type' => 'Checkbox',
    'priority' => 1,
    'section' => 'blog_section',

)
);

$wp_customize->add_section(
    'single_post',
    array(
        'title' => esc_html__( 'Single Posts','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);
$wp_customize->add_setting('espyjobs_theme_options[show_single_sidebar]',
array(
    'type' => 'option',
    'default'        => true,
    'default' => $espyjobs_options['show_single_sidebar'],
    'sanitize_callback' => 'espyjobs_sanitize_checkbox',
)
);

$wp_customize->add_control('espyjobs_theme_options[show_single_sidebar]',
array(
    'label' => esc_html__('Show Sidebar in Single Posts Page', 'espy-jobs'),
    'type' => 'Checkbox',
    'priority' => 1,
    'section' => 'single_post',

)
);


$wp_customize->add_section(
    'preloader_section',
    array(
        'title' => esc_html__( 'Preloader','espy-jobs' ),
        'panel'=>'theme_options',
        'capability'=>'edit_theme_options',
    )
);
$wp_customize->add_setting('espyjobs_theme_options[show_preloader]',
array(
    'type' => 'option',
    'default'        => true,
    'default' => $espyjobs_options['show_preloader'],
    'sanitize_callback' => 'espyjobs_sanitize_checkbox',
)
);

$wp_customize->add_control('espyjobs_theme_options[show_preloader]',
array(
    'label' => esc_html__('Show Pre-Loader', 'espy-jobs'),
    'type' => 'Checkbox',
    'priority' => 1,
    'section' => 'preloader_section',

)
);




    $wp_customize->add_section(
        'prefooter_section',
        array(
            'title' => esc_html__( 'Prefooter Section','espy-jobs' ),
            'panel'=>'theme_options',
            'capability'=>'edit_theme_options',
        )
    );

    $wp_customize->add_setting('espyjobs_theme_options[show_prefooter]',
        array(
            'type' => 'option',
            'default'        => true,
            'default' => $espyjobs_options['show_prefooter'],
            'sanitize_callback' => 'espyjobs_sanitize_checkbox',
        )
    );

    $wp_customize->add_control('espyjobs_theme_options[show_prefooter]',
        array(
            'label' => esc_html__('Show Prefooter Section', 'espy-jobs'),
			'description' => esc_html__('Copyright text can be changed in Premium Version only', 'espy-jobs'),
            'type' => 'Checkbox',
            'priority' => 1,
            'section' => 'prefooter_section',

        )
    );
}
add_action( 'customize_register', 'espyjobs_customize_register' );

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function espyjobs_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function espyjobs_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function espyjobs_customize_preview_js() {
	wp_enqueue_script( 'espyjobs-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), '20151215', true );
}
add_action( 'customize_preview_init', 'espyjobs_customize_preview_js' );
