<?php
$espyjobs_options = espyjobs_theme_options();

$job_section_title = $espyjobs_options['job_title'];
$job_desc = $espyjobs_options['job_desc'];
$check_job          = in_array('wp-job-manager/wp-job-manager.php', apply_filters('active_plugins', get_option('active_plugins'))) ? true : false;

?>

<section class="job-listings section">

    <div class="container">
      <div class="row">
          <?php if ($job_section_title || $job_desc): ?>
              <div class="section-title">
                  <?php


                  
                  if ($job_section_title)
                      echo '<h2>' . esc_html($job_section_title) . '</h2>';
                      if ($job_desc)
                      echo '<p>' . esc_html($job_desc) . '</p>';
                  ?>
              </div>
          <?php endif; ?>
      </div>
   </div>
             
             
    <div class="container">
        <div class="row">
          
        <?php
          if($check_job){
          echo do_shortcode('[jobs show_filters="false"]'); } ?>
    </div>
    </div>
</section>