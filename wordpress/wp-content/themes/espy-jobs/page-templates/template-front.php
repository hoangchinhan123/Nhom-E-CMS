<?php
/**
 *
 * Template Name: Front Template

 *
 * @package espyjobs
 */
 
get_header();

$espyjobs_options = espyjobs_theme_options();

$blog_show = $espyjobs_options['blog_show'];
$job_show = $espyjobs_options['job_show'];

get_template_part('template-parts/homepage/banner', 'section');

if($job_show == 1)
get_template_part('template-parts/homepage/job', 'section');

get_template_part('template-parts/homepage/cta', 'section');
if($blog_show == 1)
get_template_part('template-parts/homepage/blog', 'section');


get_footer();
