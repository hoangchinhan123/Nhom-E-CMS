<?php
/**
 * Header search form
 *
 * @package robojob lite
 */
?>
<form role="search" method="get" id="header-search" class="header-search-form search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label>
        <span class="screen-reader-text"><?php esc_html_e( 'Search for' , 'robojob-lite' ); ?></span>
        <input type="search" class="search-field" placeholder="<?php esc_attr_e( 'Start Typing and Hit Enter' , 'robojob-lite' ); ?>" value="" name="s" title="<?php esc_attr_e( 'Search for:' , 'robojob-lite' ); ?>" >
    </label>
    <input type="submit" class="search-submit" value="<?php esc_attr_e( 'Search ' , 'robojob-lite' ); ?>">
</form>
