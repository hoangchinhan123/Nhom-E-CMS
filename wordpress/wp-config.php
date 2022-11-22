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
define( 'AUTH_KEY',         '`s`R9zmNWAJ|}cx}Rw7:G>7e4Fn6at2*[>g-%TD~iu!|L h[dEI/M*s+Vbq8Zz22' );
define( 'SECURE_AUTH_KEY',  'cVMr:7n|!WWA]y6A ]=@nsOi77{il|n<+?Kb$l3;lfB6,AhbFo0uC0mk$T0}@jaN' );
define( 'LOGGED_IN_KEY',    'w7.H=dtyP#eBF(MS}?.[04iT*HZS_|LT0{2/,lV,b>v,TvayUG4EZMhVz{15]K=}' );
define( 'NONCE_KEY',        '|.>839e{^E[@+,xQ|J!Cb+/1,W){a&gTv!xT&oykC>)Vti7;`OvP`{)M<aG]c;9.' );
define( 'AUTH_SALT',        ',2rj*aph(!52^rEWok2H]k l/@$O&AP2qETYe>h8./6%`W(^dBOO.L[o8!EKL9y]' );
define( 'SECURE_AUTH_SALT', '_-n;egK*fiEz,{sYnAP`xdTxK-kVDfW/fy)0.-bm{Rjz=d LHa34N$Sa1{T8}bnK' );
define( 'LOGGED_IN_SALT',   'nmNP+e>zdo7n|$M.-~s)z+kC(.3}hTkG?TD^`P,|(0A$z&#kL.zk=7*Aubw6:LVr' );
define( 'NONCE_SALT',       '4.7IV6{mqAPJ^RUWDqJn`1PQ)DWT-l2}&nwKl!;=HlZ;*|oK~st=_jI,$hJDlK[$' );

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
