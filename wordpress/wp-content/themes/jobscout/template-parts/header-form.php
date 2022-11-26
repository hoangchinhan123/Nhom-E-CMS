<?php

/**
 *
 * Creating a custom job search form for homepage
 * The [jobs] shortcode is will use search_location and search_keywords variables from the query string.
 *
 * @link https://wpjobmanager.com/document/tutorial-creating-custom-job-search-form/
 *
 * @package JobScout
 */
$find_a_job_link = get_option('job_manager_jobs_page_id', 0);
$post_slug       = get_post_field('post_name', $find_a_job_link);
$ed_job_category = get_option('job_manager_enable_categories');

if ($post_slug) {
  $action_page =  home_url('/' . $post_slug);
} else {
  $action_page =  home_url('/');
}
?>

<div class="job_listings">

  <form class="jobscout_job_filters" method="GET" action="<?php echo esc_url($action_page) ?>" 
  style="background: rgb(0 0 0 / 40%);">
    <div class="search_jobs">

      <div class="search_keywords">
        <span style="background: #fff;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 50 50" width="50px" height="50px">
            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
          </svg>
        </span>
        <input type="text" id="search_keywords" name="search_keywords" placeholder="<?php esc_attr_e('Search for jobs, companies, skills', 'jobscout'); ?>">

      </div>

      <div class="search_location">
        <?php
        global $wpdb;
        $table  = $wpdb->prefix . 'postmeta';
        $sql = "SELECT DISTINCT SUBSTRING_INDEX(`meta_value`,',',-1) as location FROM `wp_postmeta` WHERE `meta_key` like '%location%' ORDER BY location";
        $data = $wpdb->get_results($wpdb->prepare($sql));
        ?>
        <span style="background: #fff;">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
            <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
              <path d="M 45 90 c -0.354 0 -0.681 -0.187 -0.861 -0.491 l -4.712 -7.972 C 30.222 65.976 20.704 49.884 17.64 43.734 c -2.033 -4.169 -3.062 -8.646 -3.062 -13.313 C 14.578 13.647 28.225 0 45 0 c 16.774 0 30.422 13.647 30.422 30.422 c 0 4.664 -1.028 9.141 -3.056 13.305 c -0.012 0.023 -0.023 0.045 -0.036 0.067 c -3.095 6.193 -12.581 22.231 -21.757 37.743 l -4.712 7.972 C 45.681 89.813 45.354 90 45 90 z M 45 2 C 29.328 2 16.578 14.75 16.578 30.422 c 0 4.359 0.96 8.542 2.854 12.43 c 3.027 6.073 12.522 22.126 21.705 37.649 L 45 87.035 l 3.853 -6.517 c 9.187 -15.531 18.686 -31.591 21.717 -37.676 c 0.009 -0.017 0.018 -0.033 0.026 -0.049 c 1.875 -3.874 2.826 -8.036 2.826 -12.372 C 73.422 14.75 60.672 2 45 2 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
              <path d="M 45 42.436 c -7.279 0 -13.2 -5.922 -13.2 -13.201 s 5.921 -13.2 13.2 -13.2 c 7.278 0 13.2 5.921 13.2 13.2 S 52.278 42.436 45 42.436 z M 45 18.035 c -6.176 0 -11.2 5.024 -11.2 11.2 c 0 6.176 5.024 11.201 11.2 11.201 s 11.2 -5.024 11.2 -11.201 C 56.2 23.059 51.176 18.035 45 18.035 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
            </g>
          </svg>
        </span>
        <select id="search_location" name="search_location" class="form-control js-example-tags">
        <option selected="selected">Location</option>
          <?php foreach ($data as $value) : ?>
            <option value="<?php echo $value->location; ?>"><?php echo $value->location; ?></option>
          <?php endforeach ?>
        </select>

      </div>

      <?php if ($ed_job_category) { ?>
        <div class="search_categories custom_search_categories">
          <label for="search_category"><?php esc_html_e('Job Category', 'jobscout'); ?></label>
          <select id="search_category" class="robo-search-category" name="search_category">
            <option value=""><?php _e('Select Job Category', 'jobscout'); ?></option>
            <?php foreach (get_job_listing_categories() as $jobcat) : ?>
              <option value="<?php echo esc_attr($jobcat->term_id); ?>"><?php echo esc_html($jobcat->name); ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      <?php } ?>

      <div class="search_submit">
        <button type="submit" value="<?php esc_attr_e('Search', 'jobscout'); ?>">Search Job</button>

      </div>

    </div>
  </form>


  <?php
  /** 
   *  <select id="search_location" name="search_location">
   *foreach ($arr as $va) :
   *  $slip = explode(', ', $va['meta_value']);
   *  $str_replace = str_replace(', ', '', $slip[1]);
   *  if ($slip[1] != "") {
   *    $re = str_replace($slip[0], '', $va['meta_value']);
   *    $re = $str_replace;
   *  } else {
   *    $re = $slip[0];
   *  }
   *?>
   *  <option value="<?php echo $re; ?>">
   *   <?php echo $re; ?>
   *  </option>
   *<?php endforeach
   *</select>
   */
  ?>



</div>