<?php
/**
 * Robojob extra-posts (testimonial, latest blog, services, call-to-action, call out).
 *
 * @package robojob lite
 */

if ( ! function_exists( 'robojob_lite_latest_blog' ) ) :
    function robojob_lite_latest_blog() {

        $customizer_options = robojob_lite_options();
        $blog_excerpt_length = $customizer_options['blog_excerpt_length'];
        $blog_title = $customizer_options['blog_title'];
        global $post;
        global $wp_query;
        $blog_category    = $customizer_options['blog_category'];
        $blog_post_count = 6;
        $tax_query = '';
         if($blog_category!='none'){
                $tax_query[] =  array(
                    'taxonomy' => 'category',
                    'field' => 'slug',
                    'terms' => $blog_category,
                );
            }
        elseif ($blog_category == 'none') {
            $tax_query = '';
        }
        /* Get all sticky posts */
        $sticky = get_option( 'sticky_posts' );
        $sticky_count = count($sticky);

        if(!empty($sticky)){
            if(!empty($sticky_count) && $sticky_count > $blog_post_count):
                $blog_post_count = 0;
            elseif (!empty($sticky_count) && $blog_post_count >$sticky_count):
                $blog_post_count = $blog_post_count - $sticky_count;
            endif;
        }

        $blog_argument = array(
                'post_type' => 'post',
                'post_status' => 'publish',
                'posts_per_page' => $blog_post_count,
                'orderby'     => 'date',
                'order'          => 'desc',
                'tax_query' => $tax_query,
                'ignore_sticky_posts' => 1,
                    );
        $blog_query = new WP_Query($blog_argument);
            $bg_image_class        = 'section-bg';
           ?>
            <!-- Start the  Blog section-->
            <section class="section cp-blog-sec">
                <div class="container">
                    <div class="row">
                            <div class="col-md-12 mb0">
                                <div class="section-header">
                                    <h3><?php echo esc_html($blog_title); ?></h3>
                                </div>
                                <!-- End Section Header -->
                            </div>
                        <?php

                        if (!empty($sticky)) {
                               robojob_lite_sticky_posts($post);
                        }
                        /* Start the Loop */
                        global $post;
                        $count = 1;
                        /* Start the Loop */
                        while ( $blog_query->have_posts() ) :
                            $blog_query->the_post();
                            $post_format = get_post_format();
                            $total_posts = $blog_query->post_count;
                            ?>
                            <div class="col-md-4 col-sm-12 mob-margin-bot-30">
                                <div class="card">
                                    <article class="recent-post card-content">
                                        <?php robojob_lite_blog_post_format($post_format, $post->ID);?>
                                        <div class="card-body">
                                            <h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
                                            <div class="entry-meta">
                                                <?php
                                                $blog_post_author = $customizer_options['blog_author_image'] ;
                                                    if ('1' == $blog_post_author ) {  ?>
                                                        <div class="entry-author">
                                                            <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" title="<?php echo esc_attr(get_the_author()); ?>">
                                                                <span class="author-img"><?php echo get_avatar( get_the_author_meta( 'ID' ), 60, '', 'author-image', '' ); ?></span>
                                                            </a>
                                                        </div>
                                                    <?php }
                                                $blog_meta = $customizer_options['blog_meta'];
                                                if ('1' == $blog_meta ) {
                                                    robojob_lite_posted_on();
                                                } ?>
                            				</div>
                                            <p><?php echo wp_kses_post(robojob_lite_get_excerpt($post->ID,$blog_excerpt_length)); ?></p>
                                        </div>
                                        <a href="<?php the_permalink(); ?>" class="btn btn-primary btn-card"><?php echo esc_html__('Read More', 'robojob-lite'); ?></a>
                                    </article>
                                </div>
                            </div>
                            <?php
                                if (($count + $sticky_count) % 3 == 0 && ($count + $sticky_count) < $total_posts) {
                                        echo '</div>';
                                        echo '<div class="row">';
                                }
                             $count++;
                        endwhile;
                        wp_reset_postdata();
                        ?>
                    </div>
                </div>
            </section>
             <?php

    }

endif;

if ( ! function_exists( 'robojob_lite_cta_section' ) ) :

    function robojob_lite_cta_section() {

            $customizer_options  = robojob_lite_options();
            $cta_page_id         = $customizer_options['cta_page_id'];
            $cta_button_link     = $customizer_options['cta_button_link'];
            $cta_layout          = 'center-button';
            $cta_right_button    = '';
            $post_thumbnail_id   = get_post_thumbnail_id($cta_page_id);
            $attachment          = get_post_meta($post_thumbnail_id);
            $featured_image      = wp_get_attachment_image_src($post_thumbnail_id , 'full');
            $bg_image_class      = ( ! empty($featured_image)?'section-bg':'');
            if ( $cta_page_id ) :
            ?>
            <!-- Start of call toacton imagebackground section -->
                <section class="call-to-action section text-center <?php echo esc_attr($bg_image_class); ?>" <?php if( ! empty($featured_image) ) { echo 'style="background-image:url(' . esc_url($featured_image[0]) . ')"'; } ?>>
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="c2a-inner upper <?php echo esc_attr($cta_right_button); ?>">
                                    <h3><?php echo esc_html(get_the_title($cta_page_id)); ?></h3>
                                    <p><?php echo esc_html(robojob_lite_excerpt_by_id($cta_page_id)); ?></p>
                                    <div class="c2a-btn">
                                        <?php if ( ! empty($cta_button_link) ) { ?>
                                            <a href="<?php echo esc_url($cta_button_link); ?>" class="btn btn-default btn-lg "><?php echo esc_html__('Read More', 'robojob-lite'); ?></a>
                                        <?php } ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            <?php
            endif;
    }

endif;