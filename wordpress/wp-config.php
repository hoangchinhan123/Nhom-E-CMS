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
define( 'AUTH_KEY',         '}J5SM-34HJ. CiISeHCMw6waRQ?KO3WDFQK]/:eu=J)::0@Q(Obb=zatAen%EL6Z' );
define( 'SECURE_AUTH_KEY',  'lk7{[rZo1o@_?lOtibUcu;tH,G5Q.NfoCi92D eHOTfS>a$q ?M~bg,!5a$yIdo;' );
define( 'LOGGED_IN_KEY',    'n,c[^y;usOWb|B,&D<K{^?lji^F<#,)cytN;G{~s3s2o^!h!<b8lL]o<wH9uP_.0' );
define( 'NONCE_KEY',        'Q{hA,{K>a<cQTu<dD@jMRQxC`1!{a@-7BC}J|/e&p$f){RDK.Ag.tT ;l,WJAdd4' );
define( 'AUTH_SALT',        '(oVE^!cJ0L@p(;S@:!1IKwCTm~eONLmd[dXbDAh>? mFM!MU&<DnlZd{5Zn,t|?6' );
define( 'SECURE_AUTH_SALT', 'Sn,;Pu:gAGi(Ff2s&pqt>HD2qfPO[Zi6Q4]5@).(WL3F+9~VhU+dm0X[9M.,CpNY' );
define( 'LOGGED_IN_SALT',   '~i67{aELuERV3K&EkLVT/LL1aTYq]|$UJ^4oz#74a|jPVWIw2y8QYqi|jP>LxvH{' );
define( 'NONCE_SALT',       '_KyC[.9shiU+0Qz%D4TU&~e6*:V]9Ii/kvKp6M^;)2$!:1+tSzFIg>Nk/0kbr/{Y' );

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
