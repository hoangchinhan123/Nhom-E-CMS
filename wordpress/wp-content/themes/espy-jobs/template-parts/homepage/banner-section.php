<?php
$espyjobs_options = espyjobs_theme_options();

$banner_section_title = $espyjobs_options['banner_title'];
$banner_desc = $espyjobs_options['banner_desc'];
$banner_bg_image = $espyjobs_options['banner_bg_image'];
$check_job          = in_array('wp-job-manager/wp-job-manager.php', apply_filters('active_plugins', get_option('active_plugins'))) ? true : false;

if(!empty($banner_bg_image)){
  $background_style = "style='background-image:url(".esc_url($banner_bg_image).")'";
}
else{
  $background_style = '';
}
?>

<section id="header-slider" class="header-slider" <?php echo wp_kses_post($background_style); ?>>
    <div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-1">
                <div class="banner-content">
                    <div class="banner-wrap">

                        <?php
                        if ($banner_section_title)
                                echo '<h1>' . esc_html($banner_section_title) . '</h1>';
                                if ($banner_desc)
                                echo '<h4>' . esc_html($banner_desc) . '</h4>';
                            ?>
                    </div>
                    <?php
                   
                   if($check_job){
                      $terms = get_terms( array(
                          'taxonomy' => 'job_listing_category',
                          'hide_empty' => false,
                        ) );
                      
                        $regions = get_terms( array(
                          'taxonomy' => 'job_listing_region',
                          'hide_empty' => false,
                        ) );
                      
                        $job_region = get_option('job_manager_regions_filter');
                      
                        ?>
                        <div class="search-filter-wrap">
                          <form  class="form-inline" method="GET" action="<?php echo job_manager_get_permalink( 'jobs' ); ?>">
                          
                          <div class="filter-inputwrap">
                            <div class="form-group">
                              <label class="sr-only" for="search_keywords"><?php _e('Job Titles, Keywords, Phrase','espy-jobs'); ?></label>
                              <input type="text" name="search_keywords" class="form-control" id="search-keywords" placeholder="<?php esc_attr_e( 'Job Titles, Keywords, Phrase', 'espy-jobs' ); ?>">
                            </div>
                            
                            <?php if($job_region == '1') : ?>
                              <?php if ( ! empty( $regions ) && ! is_wp_error( $regions ) ) :?>
                                <div class="form-group">
                                  <label class="sr-only" for="search_region"><?php _e('Job Region','espy-jobs') ?></label>
                                  <select class="form-control" id="job-region" name="search_region"  >
                                    <option><?php _e('All Regions' ,'espy-jobs') ?></option>
                                    <?php 
                                      foreach($regions as $r):
                                        echo '<option value="'.$r->term_id.'">'.$r->name.'</option>';
                                      endforeach; 
                                    ?>
                                  </select>
                                </div>
                            <?php endif; ?>
                            <?php else: ?>
                            <div class="form-group">
                              <label class="sr-only" for="search_location"><?php _e('All Location','espy-jobs') ?></label>
                              <input type="text" name="search_location" class="form-control" id="search-location" placeholder="All Location">
                            </div>
                            <?php endif; ?>

                            <div class="form-group">
                            <button type="submit" class="btn btn-primary">Search</button>
                            </div>
                            
                          </div>
                          
               
                          </form> 
                        </div>
                        <?php } ?>
                </div>
            </div>
        </div>
    </div>
</section>