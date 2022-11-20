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
define( 'AUTH_KEY',         'S[N%UT_p?XqXC>_W (0S8Ta+;Ouupk=?bI<z#=^BE4d$`im4gDanTvkR/r|ja,l9' );
define( 'SECURE_AUTH_KEY',  '=QV!]QlEmRtHcHuANo/6@q&YeY=3G N``I*5]0p5GIS;d7c*;Z[>g}#bFSy[X/O|' );
define( 'LOGGED_IN_KEY',    '(AqHjSq<)NV<Ctg6BMe)>#^)QsI?:q&>;-504;)MY:hc4jrZ4|l<Zcr*Y2C&9;f[' );
define( 'NONCE_KEY',        '~yZ3QmwM,4su9$>gbR<_N71VDy~C,&]COV>;g)Q/6YnAt,Z}{|1vh.1DY5j_e@Gd' );
define( 'AUTH_SALT',        '=s&yaH:>wK)Wm2pD/3YyhfG[!m1+UsDyL@<rUd~;qxIqlMu=,3P::4jBlDMF}|~N' );
define( 'SECURE_AUTH_SALT', 'Kqap]iY$t48LEy0S8NW5[%?3~uMr`MlZapY5<.~,(`UU4!k=I)WqlV8dD-Sk(ebE' );
define( 'LOGGED_IN_SALT',   'CJdX_BDQFYAtH<@RqcX> _u}9|0YmM1{d}AFm,iov%j;:gWv.7AlU}@nA]/&`OBl' );
define( 'NONCE_SALT',       '7h5AS/T8Cnqp}^rjkJ&1+;o3P1SZh/h~Cu_X3ax&VzK&2D`*08.+yoYX`^_#,ru1' );

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
