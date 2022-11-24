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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
define( 'AUTH_KEY',         '`s`R9zmNWAJ|}cx}Rw7:G>7e4Fn6at2*[>g-%TD~iu!|L h[dEI/M*s+Vbq8Zz22' );
define( 'SECURE_AUTH_KEY',  'cVMr:7n|!WWA]y6A ]=@nsOi77{il|n<+?Kb$l3;lfB6,AhbFo0uC0mk$T0}@jaN' );
define( 'LOGGED_IN_KEY',    'w7.H=dtyP#eBF(MS}?.[04iT*HZS_|LT0{2/,lV,b>v,TvayUG4EZMhVz{15]K=}' );
define( 'NONCE_KEY',        '|.>839e{^E[@+,xQ|J!Cb+/1,W){a&gTv!xT&oykC>)Vti7;`OvP`{)M<aG]c;9.' );
define( 'AUTH_SALT',        ',2rj*aph(!52^rEWok2H]k l/@$O&AP2qETYe>h8./6%`W(^dBOO.L[o8!EKL9y]' );
define( 'SECURE_AUTH_SALT', '_-n;egK*fiEz,{sYnAP`xdTxK-kVDfW/fy)0.-bm{Rjz=d LHa34N$Sa1{T8}bnK' );
define( 'LOGGED_IN_SALT',   'nmNP+e>zdo7n|$M.-~s)z+kC(.3}hTkG?TD^`P,|(0A$z&#kL.zk=7*Aubw6:LVr' );
define( 'NONCE_SALT',       '4.7IV6{mqAPJ^RUWDqJn`1PQ)DWT-l2}&nwKl!;=HlZ;*|oK~st=_jI,$hJDlK[$' );
=======
define( 'AUTH_KEY',         'kB)qKj+u3Xu3x.+@LTS$yC.dzZb(^3ZSUx)Fos^ %z/{U3y]WMg1v-bU{K:_yMLW' );
define( 'SECURE_AUTH_KEY',  'zn{$hvk<4]UREdxP:4Bly%/lDHFe0.}fW>KziZy>SvI}g|:;D[4f(~+;wNU[oV`e' );
define( 'LOGGED_IN_KEY',    'B$f6q@ns(vNax?+=IVk%ST23w;c_n^jjq,%vA;LQY0s}$=gma9hd1nWI`PlHWW%b' );
define( 'NONCE_KEY',        'Fge(%OT4K?((CPUOKTYJ*qgWR[suwwQNN_4BLWnrGu><weX4=Z%;Z-Ar[u93]%hu' );
define( 'AUTH_SALT',        '{N30A*[drZPd7`3CXUZR6!JXj34uO;>XuRXq.[&K|o*Ow:cK#%1hNG@_I%!a5[Z:' );
define( 'SECURE_AUTH_SALT', 'ib3kaa{8.){,S_vv(Co-w*%xad<bAxi5-%mQLo.prC(C!=kZ=EF~-(?eI{]j.V@u' );
define( 'LOGGED_IN_SALT',   'dq@tIBx:PN{>g;xBDWoKB)#vg@go^iaA>H1pBU||nss(G{=PW(zM`#g)?%vJ/58-' );
define( 'NONCE_SALT',       '4>>&mWY9p>0Y7a,&&^o6.ol[|#>Gj7<No;nB%3Z[Vbw_?J(H45 %J}{w&8I?t!|)' );
>>>>>>> yeu_cau_2_top_jobs
=======
define( 'AUTH_KEY',         '}J5SM-34HJ. CiISeHCMw6waRQ?KO3WDFQK]/:eu=J)::0@Q(Obb=zatAen%EL6Z' );
define( 'SECURE_AUTH_KEY',  'lk7{[rZo1o@_?lOtibUcu;tH,G5Q.NfoCi92D eHOTfS>a$q ?M~bg,!5a$yIdo;' );
define( 'LOGGED_IN_KEY',    'n,c[^y;usOWb|B,&D<K{^?lji^F<#,)cytN;G{~s3s2o^!h!<b8lL]o<wH9uP_.0' );
define( 'NONCE_KEY',        'Q{hA,{K>a<cQTu<dD@jMRQxC`1!{a@-7BC}J|/e&p$f){RDK.Ag.tT ;l,WJAdd4' );
define( 'AUTH_SALT',        '(oVE^!cJ0L@p(;S@:!1IKwCTm~eONLmd[dXbDAh>? mFM!MU&<DnlZd{5Zn,t|?6' );
define( 'SECURE_AUTH_SALT', 'Sn,;Pu:gAGi(Ff2s&pqt>HD2qfPO[Zi6Q4]5@).(WL3F+9~VhU+dm0X[9M.,CpNY' );
define( 'LOGGED_IN_SALT',   '~i67{aELuERV3K&EkLVT/LL1aTYq]|$UJ^4oz#74a|jPVWIw2y8QYqi|jP>LxvH{' );
define( 'NONCE_SALT',       '_KyC[.9shiU+0Qz%D4TU&~e6*:V]9Ii/kvKp6M^;)2$!:1+tSzFIg>Nk/0kbr/{Y' );
>>>>>>> yeu_cau_3-blog
=======
define( 'AUTH_KEY',         'S[N%UT_p?XqXC>_W (0S8Ta+;Ouupk=?bI<z#=^BE4d$`im4gDanTvkR/r|ja,l9' );
define( 'SECURE_AUTH_KEY',  '=QV!]QlEmRtHcHuANo/6@q&YeY=3G N``I*5]0p5GIS;d7c*;Z[>g}#bFSy[X/O|' );
define( 'LOGGED_IN_KEY',    '(AqHjSq<)NV<Ctg6BMe)>#^)QsI?:q&>;-504;)MY:hc4jrZ4|l<Zcr*Y2C&9;f[' );
define( 'NONCE_KEY',        '~yZ3QmwM,4su9$>gbR<_N71VDy~C,&]COV>;g)Q/6YnAt,Z}{|1vh.1DY5j_e@Gd' );
define( 'AUTH_SALT',        '=s&yaH:>wK)Wm2pD/3YyhfG[!m1+UsDyL@<rUd~;qxIqlMu=,3P::4jBlDMF}|~N' );
define( 'SECURE_AUTH_SALT', 'Kqap]iY$t48LEy0S8NW5[%?3~uMr`MlZapY5<.~,(`UU4!k=I)WqlV8dD-Sk(ebE' );
define( 'LOGGED_IN_SALT',   'CJdX_BDQFYAtH<@RqcX> _u}9|0YmM1{d}AFm,iov%j;:gWv.7AlU}@nA]/&`OBl' );
define( 'NONCE_SALT',       '7h5AS/T8Cnqp}^rjkJ&1+;o3P1SZh/h~Cu_X3ax&VzK&2D`*08.+yoYX`^_#,ru1' );
>>>>>>> yeu-cau-4-jobs-new

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
