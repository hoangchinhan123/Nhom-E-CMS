<?php
if (!function_exists('espyjobs_theme_options')) :
    function espyjobs_theme_options()
    {
        $defaults = array(

            //banner section
            'header_button_txt' => '',
            'header_button_url' => '',
            'site_title_show' => '1',
            
            'show_image' => '1',
            'show_blog_author' => '1',
            'show_blog_date' => '1',
            'show_excerpts' => '1',
            
            'show_single_sidebar' => '1',
            'show_preloader' => '1',


            'show_prefooter' => 1,
            'cta_show' => 0,
            'cta_title' => '',
            'cta_subtitle' => '',
            'cta_button_txt' => '',
            'cta_button_url' => '',
            'cta_bg_image' => '',
            'banner_title' => '',
            'banner_desc' => '',
            
            'job_title' => '',
            'job_desc' => '',
            
            'blog_title' => '',
            'banner_bg_image' => '',
            
            'blog_desc' => '',
            
            'job_show' => 1,
            'blog_show' => 1,
            'blog_category' => '',


        );

        $options = get_option('espyjobs_theme_options', $defaults);

        //Parse defaults again - see comments
        $options = wp_parse_args($options, $defaults);

        return $options;
    }
endif;
