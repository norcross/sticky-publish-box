<?php
/**
 * Plugin Name: Sticky Publish Box
 * Plugin URI: http://andrewnorcross.com/plugins/
 * Description: Set the side publishing box on the WP post editor to stay on the side.
 * Author: Andrew Norcross
 * Author URI: http://andrewnorcross.com/
 * Version: 0.0.3
 * Text Domain: sticky-publish-box
 * Requires WP: 4.0
 * Domain Path: languages
 * License: MIT - http://norcross.mit-license.org
 * GitHub Plugin URI: https://github.com/norcross/sticky-publish-box
 */

// Define our base file.
if ( ! defined( 'STKBX_BASE' ) ) {
	define( 'STKBX_BASE', plugin_basename( __FILE__ ) );
}

// Define our base directory.
if ( ! defined( 'STKBX_DIR' ) ) {
	define( 'STKBX_DIR', plugin_dir_path( __FILE__ ) );
}

// Define our version.
if ( ! defined( 'STKBX_VER' ) ) {
	define( 'STKBX_VER', '0.0.3' );
}

/**
 * Call our class.
 */
class StickyPublishBox_Base
{
	/**
	 * Static property to hold our singleton instance.
	 * @var $instance
	 */
	static $instance = false;

	/**
	 * This is our constructor. There are many like it, but this one is mine.
	 */
	private function __construct() {
		add_action( 'plugins_loaded',               array( $this, 'textdomain'          )           );
		add_action( 'plugins_loaded',               array( $this, 'load_files'          )           );
	}

	/**
	 * If an instance exists, this returns it.  If not, it creates one and
	 * retuns it.
	 *
	 * @return $instance
	 */
	public static function getInstance() {

		if ( ! self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Load our textdomain for localization.
	 *
	 * @return void
	 */
	public function textdomain() {
		load_plugin_textdomain( 'sticky-publish-box', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	/**
	 * Load our actual files in the places they belong.
	 *
	 * @return void
	 */
	public function load_files() {

		// Load our admin-related functions.
		if ( is_admin() ) {
			require_once( STKBX_DIR . 'lib/admin.php' );
		}
	}

	// End our class.
}

// Instantiate our class.
$StickyPublishBox_Base = StickyPublishBox_Base::getInstance();
