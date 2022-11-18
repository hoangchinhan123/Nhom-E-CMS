<?php
/**
 * Register widget area.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_sidebar
 *
 * @package robojob lite
 * @since Robojob 1.0.0
 */

if ( ! function_exists('robojob_lite_widgets_init') ) {
    function robojob_lite_widgets_init() {

        register_sidebar( array(
            'name'          => __( 'Sidebar','robojob-lite' ),
            'id'            => 'sidebar',
            'description'   => __( 'Robojob Sidebar','robojob-lite' ),
            'before_widget' => '<aside id="%1$s" class="widget %2$s">',
            'after_widget'  => '</aside>',
            'before_title'  => '<h1 class="widget-title">',
            'after_title'   => '</h1>',
            ) );

         register_sidebar( array(
            'name'          => __( 'Jobs Sidebar','robojob-lite' ),
            'id'            => 'sidebar-jobs',
            'description'   => __( 'Robojob Jobs Sidebar','robojob-lite' ),
            'before_widget' => '<aside id="%1$s" class="widget %2$s">',
            'after_widget'  => '</aside>',
            'before_title'  => '<h1 class="widget-title">',
            'after_title'   => '</h1>',
            ) );

        register_sidebar( array(
            'name'          => __( 'Footer A','robojob-lite' ),
            'id'            => 'footer-1',
            'description'   => __( 'Footer A','robojob-lite' ),
            'before_widget' => '<aside id="%1$s" class="widget %2$s">',
            'after_widget'  => '</aside>',
            'before_title'  => '<h1 class="widget-title">',
            'after_title'   => '</h1>',
            ) );

        register_sidebar( array(
            'name'          => __( 'Footer B','robojob-lite' ),
            'id'            => 'footer-2',
            'description'   => __( 'Footer B','robojob-lite' ),
            'before_widget' => '<aside id="%1$s" class="widget %2$s">',
            'after_widget'  => '</aside>',
            'before_title'  => '<h1 class="widget-title">',
            'after_title'   => '</h1>',
            ) );

        register_sidebar( array(
            'name'          => __( 'Footer C','robojob-lite' ),
            'id'            => 'footer-3',
            'description'   => __( 'Footer C','robojob-lite' ),
            'before_widget' => '<aside id="%1$s" class="widget %2$s">',
            'after_widget'  => '</aside>',
            'before_title'  => '<h1 class="widget-title">',
            'after_title'   => '</h1>',
            ) );
    }
    add_action( 'widgets_init', 'robojob_lite_widgets_init' );
}
