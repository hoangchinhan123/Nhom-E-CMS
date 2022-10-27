<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'wordpress' );

/** Database password */
define( 'DB_PASSWORD', '123456789' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '^3?Z}LDq]8{->=5Fi._z1T:fr5x. t{VleII1[rF7^/o4#Fkvwz]XdUlW./mu9Lc' );
define( 'SECURE_AUTH_KEY',  'j9KqjkOY;aAk<&V$?+qXl, 6oC52[fVXc%tu`0`IbYgOe_Rlwx!X*.v(^MSuQck-' );
define( 'LOGGED_IN_KEY',    '>JUP4k*PMKI0?+RoR$Kr}E7;#/3CuR[R!.2t%O`>A`+U`[tM`BBbe;A2d11$aPPm' );
define( 'NONCE_KEY',        '/RJy35/I$@rHBfye;g-(%Gb%ng1VJNrQbEY^<JDR;!U!ez!*^)r+CFzhtzo=-?A5' );
define( 'AUTH_SALT',        'sH$Dq2S(F;TzfXOIVTGJA}ZzJ-Rx?JT5ysO$D$x@_(S*kYv=qDah7;nIFQU>+ +u' );
define( 'SECURE_AUTH_SALT', 'e]+g,xK&Q|.ZzT`C0Q:n_15` U265}a)XVktl!?8NYWsE)0o{ig?`n0-zjR/MB/u' );
define( 'LOGGED_IN_SALT',   'T9O_L)sW)IXUgtb{9rk=>r60Li7#_7r:$&fj#s,BrETMnwE0?[egLqXV&HxX]e+0' );
define( 'NONCE_SALT',       'b^0r3xL7ZI^o,S;P`rJrtd8_ VB<^a1nyX-xQvg.`IqYUxr3[CHL*CNTK /ZmT|z' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_w';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
