<?php
/**
 * Robojob functions.
 *
 * @package robojob lite
 */

if ( ! function_exists('robojob_lite_options') ) {
    function robojob_lite_options() {
        // Options API
            return wp_parse_args(
                get_option( 'robojob-lite', array() ),
                robojob_lite_default_settings()
            );

    }
}

if ( ! function_exists('robojob_lite_default_settings') ) {
    function robojob_lite_default_settings() {
        $robojob_lite_options = array(
            'banner_page_id'            => '',
            'find_a_job_link'           => '',
            'post_a_job_link'           => '',
            'manage_job_link'           => '',
            'cta_page_id'               => '',
            'logo_img'                  => '',
            'logo_height'               => '62px',
            'banner_text_color'         => '',
            'twitter_link'              => '#',
            'fb_link'                   => '#',
            'linkedin_link'             => '#',
            'youtube_link'              => '#',
            'instagram'                 => '#',
            'gplus'                     => '#',
            '_show_search'              => '1',
            'blog_checkbox'             => '1',
            'blog_title'                => '',
            'blog_category'             => 'none',
            'blog_author_image'         => '1',
            'blog_meta'                 => '1',
            'cta_layout'                => 'center-button',
            'cta_button_link'           => '',
            '_job_sidebar'              => '1',
            'archive_layout'            => 'right',
            'blog_excerpt_length'       => 100,
        );
                return apply_filters( 'robojob_lite_options', $robojob_lite_options );
    }
}

if ( class_exists('Astoundify_Job_Manager_Companies') ) {
    if ( ! function_exists('robojob_lite_clients') ) {
        function robojob_lite_clients() {
             $robojob_lite_theme_options = robojob_lite_options();
             $title = $robojob_lite_theme_options['client_title'];
             $per_page = '1000000';

                global $post;
                global $wp_query;
                global $wpdb;
                ob_start();
            if ( ! $company_data = wp_cache_get( $post->ID, '_company_name' ) ) {
                $companies   = $wpdb->get_col( $wpdb->prepare(
                    "SELECT pm.meta_value FROM {$wpdb->postmeta} pm
                     LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
                     WHERE pm.meta_key = '_company_name'
                     AND p.post_status = 'publish'
                     AND p.post_type = 'job_listing'
                     GROUP BY pm.meta_value
                     ORDER BY pm.meta_value
                     LIMIT %d", $per_page
                     )
                );
                echo '<section class="section"><div class="loader"></div><div class="container">';
                 if (! empty($title)) { ?>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="section-header">
                                        <h3><?php echo esc_html($title); ?></h3>
                                    </div>
                                </div>
                            </div>
                <?php   }
                 echo '<div class="client-carousel client-served filter">';

                        foreach ( $companies as $company_name ) {

                            $args_company = array(
                                             'post_type' => 'job_listing',
                                             'meta_key' => '_company_name',
                                             'meta_value' => $company_name,
                                             );

                            $comp = get_posts( $args_company );

                            foreach ($comp as $co ) {
                                    $post_id = $co->ID;
                                    $post_thumbnail_id = get_post_thumbnail_id($post_id);
                                    $attachment = get_post_meta($post_thumbnail_id);
                                    $featured_image = wp_get_attachment_url($post_thumbnail_id );
                                    $company_website = get_post_meta( $post_id, '_company_website', true);
                            }
                              ?>
                              <?php if ($featured_image ) : ?>

                                    <li class="client-logo">
                                        <a href="<?php echo esc_url($company_website); ?>" target="_blank">
                                            <img src="<?php echo esc_url($featured_image); ?>" alt="<?php echo esc_attr($company_name);?>">
                                        </a>
                                    </li>

                          <?php endif; ?>
                        <?php  }
                echo '</div></div></section>';

                wp_cache_add( $post->ID, $company_data, '_company_name' );
            }
        }
    }
}

if ( ! function_exists('robojob_lite_the_featured_video') ) {
    function robojob_lite_the_featured_video( $content ) {

        $ori_url = explode("\n", esc_html($content));
        $url = esc_url( $ori_url[0] );

        $w = get_option( 'embed_size_w' );
        if ( ! is_single() ) {
            $url = str_replace( '448', $w, $url ); }

        if ( 0 === strpos( $url, 'https://' ) ) {
            $embed_url = wp_oembed_get( esc_url( $url ) );
            print_r($embed_url);
            $content = trim( str_replace( $url, '', esc_html( $content ) ) );
        }
        elseif ( preg_match( '#^<(script|iframe|embed|object)#i', $url ) ) {
            $h = get_option( 'embed_size_h' );
            echo esc_url( $url );
            if ( ! empty( $h ) ) {

                if ( $w === $h ) { $h = ceil( $w * 0.75 ); }
                $url = preg_replace(
                    array( '#height="[0-9]+?"#i', '#height=[0-9]+?#i' ),
                    array( sprintf( 'height="%d"', $h ), sprintf( 'height=%d', $h ) ),
                    $url
                    );
                echo esc_url( $url );
            }

            $content = trim( str_replace( $url, '', $content ) );
        }
    }
}




/**
 * Search Function
 * Adds the search bar in header
 *
 * @package code-themes
 */

if ( ! function_exists('robojob_lite_headsearch') ) {

    add_filter('wp_nav_menu_items','robojob_lite_headsearch', 10, 2);

    /** Add searchbar in header. */
    function robojob_lite_headsearch( $items, $args ) {
        if ( $args->theme_location == 'primary' ) {
            return $items .= "<li class='menu-header-search'><a href='#' id='header-search-toggle'><i class='fa fa-search'></i></a></li>"; }
        return $items;
    }
}

if ( ! function_exists('robojob_lite_logo') ) {
    function robojob_lite_logo() {
        $robojob_lite_theme_options = robojob_lite_options();
        $version_wp = get_bloginfo('version');
        if ($version_wp < 4.5 ) {
                if ($robojob_lite_theme_options['logo_img'] ) { ?>
                    <a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <img src="<?php echo esc_url($robojob_lite_theme_options['logo_img']); ?>" alt="Robojob">
                    </a>
                <?php } else { ?>
                    <a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <span><?php echo bloginfo('name'); ?></span>
                        <p class="site-description"><?php echo bloginfo('description'); ?></p>
                    </a>
                <?php }
        }
            else {
                    if ( function_exists( 'the_custom_logo' ) && has_custom_logo() ) {
                        the_custom_logo();
                    }
                    elseif ( ! has_custom_logo() ) {
                        ?>
                        <a class="navbar-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                            <span><?php echo bloginfo('name'); ?></span>
                            <p class="site-description"><?php echo bloginfo('description'); ?></p>
                        </a>
                        <?php
                    }
                    elseif ( function_exists('the_custom_logo') && ! empty($robojob_lite_theme_options['logo_img']) ) {
                        $previous_logo = attachment_url_to_postid($robojob_lite_theme_options['logo_img']);
                        if ( is_int( $previous_logo ) ) {
                            set_theme_mod( 'custom_logo', $previous_logo );
                            $customizer_values = get_option( 'robojob-lite');
                            unset($customizer_values['logo_img']);
                            update_option( 'robojob-lite', $customizer_values );
                        }
                    }
                }
    }
}



if ( ! function_exists('robojob_lite_strip_url_content') ) {
    function robojob_lite_strip_url_content( $posttype, $content_length ) {
        $strip = explode( ' ' , strip_shortcodes(wp_trim_words($posttype->post_content  , $content_length)) );
        foreach ($strip as $key => $single ) {
            if ( ! filter_var($single, FILTER_VALIDATE_URL) === false ) {
                unset($strip[ $key ]);
            }
        }
        return implode( ' ', $strip );
    }
}

if ( ! function_exists('robojob_lite_sidebar_archive') ) {
    function robojob_lite_sidebar_archive() {
        $robojob_lite_theme_options = robojob_lite_options();
        $sidebar_layout_archive = $robojob_lite_theme_options['archive_layout'];

                if ( is_active_sidebar( 'sidebar' ) ) { ?>
                    <div id="secondary" class="col-md-4 col-sm-12 col-xs-12">
                        <?php dynamic_sidebar('sidebar'); ?>
                    </div>
                    <!-- End Secondary -->
    <?php       }

    }
}

if ( ! function_exists('robojob_lite_sidebar_archive_class') ) {
    function robojob_lite_sidebar_archive_class() {
            $sidebar_class = 'col-md-8  col-sm-12 col-xs-12 right-sidebar';
            return $sidebar_class;
    }
}

    if ( ! function_exists('robojob_lite_sidebar_single') ) {
        function robojob_lite_sidebar_single() {
                if ( is_active_sidebar( 'sidebar' ) ) { ?>
                    <div id="secondary" class="col-md-4 col-sm-12 col-xs-12">
                        <?php dynamic_sidebar('sidebar'); ?>
                    </div>
                    <!-- End Secondary -->
        <?php       }

        }
    }

if ( ! function_exists('robojob_lite_sidebar_single_class') ) {
    function robojob_lite_sidebar_single_class() {
            $sidebar_class = 'col-md-8  col-sm-12 col-xs-12 right-sidebar';
            return $sidebar_class;
    }
}



if ( ! function_exists('robojob_lite_job_navigation_page') ) {
    function robojob_lite_job_navigation_page() {
        ?>
        <div class="clearfix">
            <div class="nav-links">
            <?php previous_posts_link('<i class="fa fa-angle-left"></i>&nbsp;&nbsp;&nbsp;'. esc_html(  __('Previous Jobs','robojob-lite'))); ?></div>
            <div class="nav-links">
                <?php next_posts_link(esc_html( __('Next Jobs','robojob-lite')).'&nbsp;&nbsp;&nbsp;<i class="fa fa-angle-right"></i>'. ''); ?>
            </div>
        </div>
        <?php
    }
}

if ( ! function_exists('robojob_lite_navigation_page') ) {
    function robojob_lite_navigation_page() {
        ?>
        <div class="clearfix">
            <div class="nav-links">
            <?php previous_posts_link('<i class="fa fa-angle-left"></i>&nbsp;&nbsp;&nbsp;'. esc_attr(  __('Previous ','robojob-lite'))); ?></div>
            <div class="nav-links">
                <?php next_posts_link(esc_html( __('Next ','robojob-lite')).'&nbsp;&nbsp;&nbsp;<i class="fa fa-angle-right"></i>'. ''); ?>
            </div>
        </div>
        <?php
    }
}

if ( ! function_exists('robojob_lite_get_image_id') ) {

    // retrieves the attachment ID from the file URL
    function robojob_lite_get_image_id($image_url) {
        global $wpdb;
        $attachment = $wpdb->get_col($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE guid='%s';", $image_url ));
        if ( $attachment ) {
            return $attachment[0];
        }
    }
}

if (! function_exists('robojob_lite_seperate_frame_src')) {
    function robojob_lite_seperate_frame_src($string)
    {
        $regex = '/https?\:\/\/[^\" ]+/i';
        preg_match_all($regex, $string, $matches);
        $urls = ($matches[0]);
        print_r('<iframe src="'.$urls[0].'" width="100%" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>');
    }
}

if (! function_exists('robojob_lite_custom_submit_job_form_login_url')) {

    add_filter( 'submit_job_form_login_url', 'robojob_lite_custom_submit_job_form_login_url' );

    function robojob_lite_custom_submit_job_form_login_url() {
        return esc_url(get_permalink(get_page_by_path('login')));
    }
}


if ( ! function_exists( 'robojob_lite_excerpt_by_id' ) ) {
    function robojob_lite_excerpt_by_id($post_id) {
        $post = get_post($post_id);
        if ($post->post_excerpt) {
            // excerpt set, return it
            return apply_filters('the_excerpt', $the_post->post_excerpt);

        } else {
            setup_postdata( $post );
            $excerpt = get_the_excerpt();
            wp_reset_postdata();
            return $excerpt;
        }
    }
}

if ( ! function_exists( 'robojob_lite_author_desc' ) ) {
    function robojob_lite_author_desc() {
        if (is_author()) { echo '<div class="post-author">';}
        ?>

            <div class="entry-author">
                <div class="author-img">
                    <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" title="<?php esc_attr_e('Author Archive', 'robojob-lite') ?>">
                        <?php echo get_avatar( get_the_author_meta( 'ID' ), 60 ); ?>
                    </a>
                </div>
                <?php
                    $author_id = get_the_author_meta('ID');
                    $user_info = get_userdata($author_id);
                    $author_url = $user_info->user_url;
                ?>
                <div class="author-desc">
                    <h3>
                        <?php esc_html_e('Articles By ', 'robojob-lite') ?>
                        <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"> <?php echo get_the_author(); ?></a>
                    </h3>
                    <p><?php echo esc_html( get_the_author_meta('description') ); ?></p>
                    <div class="author-links">
                        <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" title="<?php esc_attr_e('Author Archive', 'robojob-lite') ?>">
                            <i class="icon ion-archive"></i> <?php esc_html_e('Author Archives', 'robojob-lite') ?>
                        </a>
                        <?php if ($author_url) { ?>
                            <a href="<?php the_author_meta('url')  ?>" title="<?php esc_attr_e('Author URL', 'robojob-lite') ?>">
                                <i class="icon ion-android-globe"></i> <?php esc_html_e('Author Website', 'robojob-lite') ?>
                            </a>
                        <?php } ?>
                    </div>
                </div>
            </div>

        <?php
        if (is_author()) { echo '</div>'; }
    }
}