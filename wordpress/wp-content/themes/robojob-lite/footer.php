<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package robojob lite
 */
$robojob_lite_theme_options = robojob_lite_options();

?>

    <footer  id="colophon" class="site-footer section-parallax">

        <div class="container">

        <a href="#" id="to-top"><i class="fa fa-angle-up"></i></a>

        <div class="footer-widgets">
          <div class="row">
          <?php
              if ( is_active_sidebar( 'footer-1' ) ) {
              ?>
                <div class="col-md-4 col-sm-12">
                    <?php dynamic_sidebar( 'footer-1' ); ?>
                </div>
            <?php } else {
              if (is_user_logged_in() && current_user_can('edit_theme_options') ) {
                echo '<div class="col-md-4 col-sm-12"><h4 class="widget-title"><a href="'.esc_url(admin_url('customize.php')).'"><i class="fa fa-plus-circle"></i> '.esc_html__('Assign a Widget', 'robojob-lite').'</a></h4></div>';
              }
            } ?>

            <?php
              if ( is_active_sidebar( 'footer-2' ) ) {
              ?>
                <div class="col-md-4 col-sm-12">
                    <?php dynamic_sidebar( 'footer-2' ); ?>
                </div>
            <?php } else {
                if (is_user_logged_in() && current_user_can('edit_theme_options') ) {
                        echo '<div class="col-md-4 col-sm-12"><h4 class="widget-title"><a href="'.esc_url(admin_url('customize.php')).'"><i class="fa fa-plus-circle"></i> '.esc_html__('Assign a Widget', 'robojob-lite').'</a></h4></div>';
                    }
                }  ?>

             <?php
              if ( is_active_sidebar( 'footer-3' ) ) {
              ?>
                <div class="col-md-4 col-sm-12">
                    <?php dynamic_sidebar( 'footer-3' ); ?>
                </div>
            <?php } else {
                  if (is_user_logged_in() && current_user_can('edit_theme_options') ) {
                     echo '<div class="col-md-4 col-sm-12"><h4 class="widget-title"><a href="'.esc_url(admin_url('customize.php')).'"><i class="fa fa-plus-circle"></i> '.esc_html__('Assign a Widget', 'robojob-lite').'</a></h4></div>';
                  }
                }  ?>

          </div>
          <!-- /End Row -->
        </div>
        <!-- /End Footer Widgets-->


      </div>
      <!-- /End Container -->

      <div class="copyrights">
          <div class="container">
            <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                    <p class="copyright" ><?php esc_html_e('Developed by' , 'robojob-lite');?><a href="<?php echo esc_url('https://codethemes.co'); ?>" target="_blank"><?php echo ' '. esc_html__('Code Themes', 'robojob-lite'); ?></a>
                      <span>
                        <?php echo esc_html__('. Powered by WordPress', 'robojob-lite'); ?>
                      </span>
                    </p>

                  </div>
              </div>
            </div>
            <!-- /End Row -->
          </div>
          <!-- /End Container -->
        </div>
        <!-- /End Copyright -->

    </footer>
    </div>
    <!-- The wrap -->
    <?php wp_footer(); ?>
  </body>

</html>