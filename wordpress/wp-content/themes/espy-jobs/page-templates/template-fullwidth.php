<?php
/**
 *
 * Template Name: Fullwidth Template

 *
 * @package lawyerfirm
 */
get_header();
?>
<div class="fullwidth-page section">
  <div class="container">
  <div class="row">
<?php if ( have_posts() ) : ?>

<?php while ( have_posts() ) : ?>
  <?php the_post(); ?>
    <?php the_content();?>
<?php endwhile;

endif; ?>
</div>
</div>
</div>


<?php

get_footer();
