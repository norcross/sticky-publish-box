<?php
/**
 * Sticky Publish Box - Admin Module
 *
 * Contains our admin side related functionality.
 *
 * @package Sticky Publish Box
 */

/**
 * Start our engines.
 */
class StickyPublishBox_Admin {

	/**
	 * Call our hooks.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_enqueue_scripts',            array( $this, 'scripts_styles'          ),  10      );
		add_filter( 'admin_body_class',                 array( $this, 'sticky_publish_body'     )           );
	}


	/**
	 * Load CSS and JS files
	 *
	 * @return
	 */
	/**
	 * Load our JS and CSS for the side box.
	 *
	 * @param  string $hook  The hook of the page we're on.
	 *
	 * @return void/
	 */
	public function scripts_styles( $hook ) {

		// If we don't have the 'get_current_screen' function, bail immediately.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}

		// Fetch the post types we are using this on.
		$types  = self::get_post_types();

		// Get current screen info.
		$screen = get_current_screen();

		// Load on post types as indicated.
		if ( is_object( $screen ) && ! empty( $screen->post_type ) && in_array( $screen->post_type, $types ) ) {

			// Set the version based on dev or not.
			$vers   = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? time() : STKBX_VER;
			$mins   = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '.js' : '.min.js';

			// Now load it up.
			wp_enqueue_script( 'sticky-publish-box', plugins_url( '/js/stkbx.admin' . $mins, __FILE__ ), array( 'jquery' ), $vers, true );
			wp_localize_script( 'sticky-publish-box', 'stickyVars', array(
				'stickyid'      => apply_filters( 'sticky_publish_id', 'div#submitdiv' ),
				'opacity'       => apply_filters( 'sticky_publish_opacity', 0.35 ),
				'breakpoint'    => apply_filters( 'sticky_publish_breakpoint', 850 ),
			));
		}
	}

	/**
	 * Add an admin body class to the areas using this.
	 *
	 * @param  string $classes  The original string of body classes
	 *
	 * @return string $classes  The modified string of body classes
	 */
	public function sticky_publish_body( $classes ) {

		// Bail on non-admin.
		if ( ! is_admin() ) {
			return $classes;
		}

		// Get our global post object.
		global $post;

		// Bail if we have no post object to work with.
		if ( ! $post || ! is_object( $post ) ) {
			return $classes;
		}

		// Get our post types.
		$types  = self::get_post_types();

		// If we're in our array, do it.
		if ( in_array( $post->post_type, $types ) ) {
			$classes .= ' sticky-publish-box';
		}

		// Send it back.
		return $classes;
	}

	/**
	 * Set a default array of post types to use this on.
	 *
	 * @return array $types  The post types.
	 */
	public static function get_post_types() {
		return apply_filters( 'sticky_publish_types', array( 'post', 'page' ) );
	}

	// End our class.
}

// Call our class.
$StickyPublishBox_Admin = new StickyPublishBox_Admin();
$StickyPublishBox_Admin->init();

