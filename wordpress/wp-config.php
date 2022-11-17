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
define( 'AUTH_KEY',         'kB)qKj+u3Xu3x.+@LTS$yC.dzZb(^3ZSUx)Fos^ %z/{U3y]WMg1v-bU{K:_yMLW' );
define( 'SECURE_AUTH_KEY',  'zn{$hvk<4]UREdxP:4Bly%/lDHFe0.}fW>KziZy>SvI}g|:;D[4f(~+;wNU[oV`e' );
define( 'LOGGED_IN_KEY',    'B$f6q@ns(vNax?+=IVk%ST23w;c_n^jjq,%vA;LQY0s}$=gma9hd1nWI`PlHWW%b' );
define( 'NONCE_KEY',        'Fge(%OT4K?((CPUOKTYJ*qgWR[suwwQNN_4BLWnrGu><weX4=Z%;Z-Ar[u93]%hu' );
define( 'AUTH_SALT',        '{N30A*[drZPd7`3CXUZR6!JXj34uO;>XuRXq.[&K|o*Ow:cK#%1hNG@_I%!a5[Z:' );
define( 'SECURE_AUTH_SALT', 'ib3kaa{8.){,S_vv(Co-w*%xad<bAxi5-%mQLo.prC(C!=kZ=EF~-(?eI{]j.V@u' );
define( 'LOGGED_IN_SALT',   'dq@tIBx:PN{>g;xBDWoKB)#vg@go^iaA>H1pBU||nss(G{=PW(zM`#g)?%vJ/58-' );
define( 'NONCE_SALT',       '4>>&mWY9p>0Y7a,&&^o6.ol[|#>Gj7<No;nB%3Z[Vbw_?J(H45 %J}{w&8I?t!|)' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_wordpress';

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
