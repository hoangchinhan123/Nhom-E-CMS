<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package robojob lite
 */

if ( ! function_exists( 'robojob_lite_posted_on' ) ) :
/**
 * Prints HTML with meta information for the current post-date/time and author.
 */
function robojob_lite_posted_on() {
	global $post;
	$post_id = $post->ID;
	$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
	if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
	}

	$time_string = sprintf( $time_string,
		esc_attr( get_the_date( 'c' ) ),
		esc_html( get_the_date() ),
		esc_attr( get_the_modified_date( 'c' ) ),
		esc_html( get_the_modified_date() )
	);

	$comment_number = esc_attr(get_comments_number($post_id));

	$author_id = $post->post_author;

	$author_name = get_the_author_meta( 'display_name', $author_id );

	$posted_on = '<a href="' . esc_url(get_day_link(get_post_time('Y'), get_post_time('m'), get_post_time('j'))) . '" rel="bookmark"><i class="icon ion-ios-calendar-outline"></i> ' . $time_string . '</a> ';


	$byline = '<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( $author_id ) ) . '">   <i class="icon ion-person"></i> ' . esc_html( $author_name ) . '</a></span>';

	$comment_number =  '<a href="' . esc_url(get_comments_link( $post_id )) . '" rel="bookmark"><i class="fa fa-comment"></i> ' .  $comment_number . '</a>';

	echo '<span class="posted-on">' . $posted_on .  "  ".'</span><span class="byline"> ' . $byline . '</span> <span class="comment-number">' .$comment_number.'</span>' ; // WPCS: XSS OK.

}
endif;

if ( ! function_exists( 'robojob_lite_entry_footer' ) ) :
/**
 * Prints HTML with meta information for the categories, tags and comments.
 */
function robojob_lite_entry_footer() {
	// Hide category and tag text for pages.
	if ( 'post' === get_post_type() ) {
		/* translators: used between list items, there is a space after the comma */
		$categories_list = get_the_category_list( esc_html__( ', ', 'robojob-lite' ) );
		if ( $categories_list && robojob_lite_categorized_blog() ) {
			printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'robojob-lite' ) . '</span>', $categories_list ); // WPCS: XSS OK.
		}

		/* translators: used between list items, there is a space after the comma */
		$tags_list = get_the_tag_list( '', esc_html__( ' ', 'robojob-lite' ) );
		if ( $tags_list ) {
			echo '<span class="tags-links">'. $tags_list . '</span>';
		}
	}

	if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo '<span class="comments-link">';
		comments_popup_link( esc_html__( 'Comment', 'robojob-lite' ), esc_html__( '1', 'robojob-lite' ), esc_html__( '%', 'robojob-lite' ) );
		echo '</span>';
	}

	edit_post_link(
		sprintf(
			/* translators: %s: Name of current post */
			esc_html__( 'Edit %s', 'robojob-lite' ),
			the_title( '<span class="screen-reader-text">"', '"</span>', false )
		),
		'<span class="edit-link">',
		'</span>'
	);
}
endif;

if ( ! function_exists( 'robojob_lite_breadcrumb_meta' ) ) :
/**
 * Prints HTML with meta information for the categories, tags and comments.
 */
function robojob_lite_breadcrumb_meta() {
	// Hide category and tag text for pages.
	if ( 'post' === get_post_type() ) {
		/* translators: used between list items, there is a space after the comma */
		$categories_list = get_the_category_list( esc_html__( ', ', 'robojob-lite' ) );
		if ( $categories_list && robojob_lite_categorized_blog() ) {
			printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'robojob-lite' ) . '</span>', $categories_list ); // WPCS: XSS OK.
		}
	}

	if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
		echo '<span class="comments-link">';
		comments_popup_link( esc_html__( 'Comment', 'robojob-lite' ), esc_html__( '1', 'robojob-lite' ), esc_html__( '%', 'robojob-lite' ) );
		echo '</span>';
	}

	edit_post_link(
		sprintf(
			/* translators: %s: Name of current post */
			esc_html__( 'Edit %s', 'robojob-lite' ),
			the_title( '<span class="screen-reader-text">"', '"</span>', false )
		),
		'<span class="edit-link">',
		'</span>'
	);
}
endif;

if ( ! function_exists( 'robojob_lite_categorized_blog' ) ) :

	/**
	 * Returns true if a blog has more than 1 category.
	 *
	 * @return bool
	 */
	function robojob_lite_categorized_blog() {
		if ( false === ( $all_the_cool_cats = get_transient( 'robojob_lite_categories' ) ) ) {
			// Create an array of all the categories that are attached to posts.
			$all_the_cool_cats = get_categories( array(
				'fields'     => 'ids',
				'hide_empty' => 1,
				// We only need to know if there is more than one category.
				'number'     => 2,
			) );

			// Count the number of categories that are attached to the posts.
			$all_the_cool_cats = count( $all_the_cool_cats );

			set_transient( 'robojob_lite_categories', $all_the_cool_cats );
		}

		if ( $all_the_cool_cats > 1 ) {
			// This blog has more than 1 category so robojob_lite_categorized_blog should return true.
			return true;
		} else {
			// This blog has only 1 category so robojob_lite_categorized_blog should return false.
			return false;
		}
	}

endif;

if ( ! function_exists( 'robojob_lite_category_transient_flusher' ) ) :
	/**
	 * Flush out the transients used in robojob_lite_categorized_blog.
	 */
	function robojob_lite_category_transient_flusher() {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Like, beat it. Dig?
		delete_transient( 'robojob_lite_categories' );
	}
	add_action( 'edit_category', 'robojob_lite_category_transient_flusher' );
	add_action( 'save_post',     'robojob_lite_category_transient_flusher' );
endif;

if ( ! function_exists( 'robojob_lite_post_content' ) ) :
	/*
	* Displays the post content on single page or
	* excerpt on index page
	*
	*
	*/
	function robojob_lite_post_content() {
		if ( ! get_the_content() ) {
			return;
		}
		if ( is_singular() || is_page() ) :
			the_content();
			else :
				if ( has_post_format( array( 'video', 'audio' ) ) ) :
					the_content();
					else :
						the_excerpt();
				endif;
		endif;
	}
endif;
