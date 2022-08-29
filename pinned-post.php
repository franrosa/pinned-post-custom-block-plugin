<?php
/**
 * Plugin Name:       Pinned Post
 * Description:       Display the pinned post, or last post if no post is pinned, for a given post type or category.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Fran Rosa
 * License:           GNU General Public License v3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       pinned-post
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function franrosa_pinned_post_block_init() {
	register_block_type(
		__DIR__ . '/build',
		array(
			'render_callback' => 'franrosa_pinned_post_block_render'
		)
	);
}
add_action( 'init', 'franrosa_pinned_post_block_init' );

function franrosa_pinned_post_block_render($block_attributes) {
	$args = ($block_attributes['queryType']=='postType') ? array( 'post_type' => $block_attributes['queryValue'], 'post_count' => 1 ) : array( 'post_type' => 'post', 'category_name' => $block_attributes['queryValue'], 'post_count' => 1 );
	$posts = new WP_Query($args);
	return '<p>' . $block_attributes['title'] . '<br /><a href="' . get_permalink($posts->post->ID) . '">' . $posts->post->post_title . '</a></p>';
}