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
define( 'AUTH_KEY',         '@KQ`!]v|+9d#H2wD| a<kaU$ 4?p1;ePWxGwpM^3oPA=.2HN`awV}oDer|E7P~K~' );
define( 'SECURE_AUTH_KEY',  '=1$tDp| 3R/T|mcu`Ugy1:94&/k<u).</F/R8neczc1%ZRCF [N+]$bD{Y=qSu-h' );
define( 'LOGGED_IN_KEY',    '}#oDRr!tt-K*bLHg,A-Q4M]kPbvM|mg;+{]=3mH6Fj*n5$Up&9T,=h/G0x{92<qc' );
define( 'NONCE_KEY',        '~(gtkonT^#Y~J5=#k~BW2M|O1UH%>PvZ>?{h2X+!7dhf[2L.ro&V|U!4$ 8)o>D1' );
define( 'AUTH_SALT',        'Ns-=Q|#I-]zg-F2P]RP|w,m_OBJl:nc6FV7w-x KcjY5>%X}^79B2^|a4<K*_zRG' );
define( 'SECURE_AUTH_SALT', 'u 8Qs6SNEGSb_e}UHYUh+O(QS9Y>&u1o( #YryI+ZSg/7)}Qo<VBen.O#V4;]L~5' );
define( 'LOGGED_IN_SALT',   'P]ora0ECSf}Ay[q7:VHfEY!_33yx~pY9&@||0K<H)q38w~=Bd9L=aG316qoOu~?2' );
define( 'NONCE_SALT',       '8/SCtj,,y4IR#/))@/#gu+(~}v=-MACt6+)}t8@2(fBAjAh$T|ZQuSnof8`oV/EL' );

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
