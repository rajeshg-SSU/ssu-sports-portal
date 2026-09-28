<?php
// ============================================
// Collympics 11.0 - Admin Configuration
// ============================================
// IMPORTANT: Change these credentials before deploying!

define('ADMIN_USERNAME', 'sscollympics');
define('ADMIN_PASSWORD', 'Collympics@2026');

// Path to scores data file
define('DATA_FILE', __DIR__ . '/data/scores.json');

// Sports list (key => display name)
define('SPORTS', [
    'cricket'        => 'Cricket',
    'volley_ball'    => 'Volley Ball',
    'throw_ball'     => 'Throw Ball',
    'basket_ball'    => 'Basket Ball',
    'kho_kho'        => 'Kho-Kho',
    'kabaddi'        => 'Kabaddi',
    'tug_of_war'     => 'Tug of War',
    'badminton'      => 'Badminton',
    'power_lifting'  => 'Power Lifting',
    'indoor_game'    => 'Indoor Game',
    'athletic'       => 'Athletic',
    'esports'        => 'Esports'
]);

// Session timeout in seconds (2 hours)
define('SESSION_TIMEOUT', 7200);
?>
