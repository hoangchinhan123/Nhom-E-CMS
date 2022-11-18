<?php

/**
 * Job Posting Section
 * 
 * @package JobScout
 * <?php echo do_shortcode( '[searchandfilter fields="search,category,post_tag"]' ); ?>
 */

$job_title         = get_theme_mod('job_posting_section_title', __('Job Posting', 'jobscout'));
$ed_jobposting     = get_theme_mod('ed_jobposting', true);
$count_posts       = wp_count_posts('job_listing');
if ($ed_jobposting && jobscout_is_wp_job_manager_activated() && $job_title) {
?>
    <br>
    <div class="container" style="background: #26558e; padding:10px 10px;">
        <form class="jobscout_job_filters" method="GET" action="<?php echo esc_url($action_page) ?>">
            <div class="search_jobs">
                <!-- input search -->
                <div class="search_keywords">
                    <input type="text" id="search_keywords" name="search_keywords" placeholder="<?php esc_attr_e('Tìm kiếm việc làm, vị trí, kỹ năng', 'jobscout'); ?>">
                </div>
                <!-- Search locatin -->
                <div class="search_location">
                    <input type="text" id="search_location" name="search_location" placeholder="<?php esc_attr_e('Địa điểm', 'jobscout'); ?>">
                </div>
                <!-- Search category -->
                <div class="search_category">
                    <select name="category" id="category" class="form-control">
                        <option value="">Tất cả ngành nghề</option>
                        <?php $args = array(
                            'hide_empty' => 0,
                            'taxonomy' => 'category'
                        );
                        $cates = get_categories($args);
                        foreach ($cates as $cate) {  ?>
                            <option value="<?php echo $cate->term_id; ?>"><?php echo $cate->name; ?></option>
                        <?php } ?>
                    </select>
                </div>


                <?php
                /** if ($ed_job_category) { ?>
                 *    <div class="search_categories custom_search_categories">
                 *        <label for="search_category"><?php esc_html_e('Job Category', 'jobscout'); ?></label>
                 *        <select id="search_category" class="robo-search-category" name="search_category">
                 *           <option value=""><?php _e('Select Job Category', 'jobscout'); ?></option>
                 *            <?php foreach (get_job_listing_categories() as $jobcat) : ?>
                 *                <option value="<?php echo esc_attr($jobcat->term_id); ?>"><?php echo esc_html($jobcat->name); ?></option>
                 *            <?php endforeach; ?>
                 *        </select>
                 *    </div>
                 *<?php } 
                 */ ?>

                <div class="search_submit">
                    <input type="submit" value="<?php esc_attr_e('Search', 'jobscout'); ?>" />
                </div>

            </div>
        </form>

    </div>
    <section id="job-posting-section" class="top-job-section">
        <div class="container">
            <?php
            $args = array(
                'taxonomy'  => 'category',
                'orderby'   => 'id',
                'order'     => 'DESC',
                'number'    => 6,
            );
            $categories = get_categories($args);
            ?>
            <div class="row" style="display: flex;">

                <div class="col-md-9" style="width:70%;">
                    <h3>Việc làm theo ngành nghề</h3>
                    <?php
                    foreach ($categories as $category) :
                        $category_thumbnail =  get_term_meta($category->term_taxonomy_id, 'category-image-id', true);
                        $image = wp_get_attachment_url($category_thumbnail);
                    ?>
                        <div class="col-md-3" style="width: 33.33%;">
                            <img src="<?php echo $image; ?>" alt="">
                            <p><?php echo $category->name ?></p>
                        </div>
                    <?php endforeach ?>
                </div>
                <div class="col-md-3" style="width:30%;">
                <h3>Từ khóa phổ biến</h3>
                </div>
            </div>


            <?php
            if ($job_title) echo '<h2 class="section-title">' . esc_html($job_title) . '</h2>';
            if (jobscout_is_wp_job_manager_activated() && $count_posts->publish != 0) { ?>
                <div class="row">
                    <div class="col-md-12">
                        <?php echo do_shortcode('[jobs show_filters="false" post_status="publish"]'); ?>
                    </div>
                </div>
            <?php }
            ?>

        </div>
    </section>
<?php
}
