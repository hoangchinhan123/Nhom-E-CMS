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
define( 'DB_NAME', 'wordpress_602_core' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

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
define( 'AUTH_KEY',         '(:`pXKW/Piq)h4Xr,UN5?.S9yS+N=4^Jra*OjY_&_lIfkvz|.mp8_Yv-%_]HL{*;' );
define( 'SECURE_AUTH_KEY',  '--DlpI0H1O8@ft/uAu|ET,R;NFlT:SZDJvkdj;@>m|}=- x-DYyZDO({M6/{PSA%' );
define( 'LOGGED_IN_KEY',    '&H&@BIAE)%8wQu+`yHx-vKVW@:m>u/GWoau.]#h2pz76({~&m?tp,^6x,xm%JckE' );
define( 'NONCE_KEY',        '5):I^`zF#2$)+H+d moI#~-+u$X&Rq9+[fo.&@-{HE~Eqz93LQY:ocvlj~#s9!}/' );
define( 'AUTH_SALT',        '[3kQYH,=.QOxVZGtH%):Y!kpSIBGt2,*dI;um P6$hc/b$rUm+B=Knv4f5w3Y{,i' );
define( 'SECURE_AUTH_SALT', 'jL-,O3>uwgSK?%3gDA7wry`mm#U7d2.+(o)EK<0$K,j-M;uz-%:~oS#2A|r%g#/-' );
define( 'LOGGED_IN_SALT',   ':M{1!4o%W(sNg48 4Z{) bt%>xehML&NZs!z5EORGc7hTx@o`iFDD3?n5c2bk;Nf' );
define( 'NONCE_SALT',       '/hlA?=]e_yUx,!.YG>bMP%k=vI7hu[t+F]N %U_),brf5!S}dB1UJ``pj#/BvFQ!' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

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
