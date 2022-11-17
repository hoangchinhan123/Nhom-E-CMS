<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package espyjobs
 */

$espyjobs_options = espyjobs_theme_options();

$show_prefooter = $espyjobs_options['show_prefooter'];

?>

<footer id="colophon" class="site-footer">


	<?php if ($show_prefooter== 1){ ?>
	    <section class="footer-sec">
	        <div class="container">
	            <div class="row">
	                <?php if (is_active_sidebar('espyjobs_footer_1')) : ?>
	                    <div class="col-md-4">
	                        <?php dynamic_sidebar('espyjobs_footer_1') ?>
	                    </div>
	                    <?php
	                else: espyjobs_blank_widget();
	                endif; ?>
	                <?php if (is_active_sidebar('espyjobs_footer_2')) : ?>
	                    <div class="col-md-4">
	                        <?php dynamic_sidebar('espyjobs_footer_2') ?>
	                    </div>
	                    <?php
	                else: espyjobs_blank_widget();
	                endif; ?>
	                <?php if (is_active_sidebar('espyjobs_footer_3')) : ?>
	                    <div class="col-md-4">
	                        <?php dynamic_sidebar('espyjobs_footer_3') ?>
	                    </div>
	                    <?php
	                else: espyjobs_blank_widget();
	                endif; ?>
	            </div>
	        </div>
	    </section>
	<?php } ?>



		<div class="site-info">
		<p><?php esc_html_e('Powered By WordPress', 'espy-jobs');
                    esc_html_e(' | ', 'espy-jobs') ?>
					<span><a target="_blank" href="https://www.flawlessthemes.com/theme/espy-jobs-best-jobboard-wordpress-theme/"><?php esc_html_e('Espy Jobs' , 'espy-jobs'); ?></a></span>
                </p> 
		</div><!-- .site-info -->


	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
