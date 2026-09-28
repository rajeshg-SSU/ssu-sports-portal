<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config.php';

// =============================================
// GET: Return current scores (public)
// =============================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists(DATA_FILE)) {
        http_response_code(404);
        echo json_encode(['error' => 'Data file not found']);
        exit;
    }

    $data = json_decode(file_get_contents(DATA_FILE), true);

    // Calculate total points for each contingent team
    foreach ($data['contingent'] as &$team) {
        $total = 0;
        foreach (SPORTS as $key => $name) {
            $total += isset($team[$key]) ? (int)$team[$key] : 0;
        }
        $team['total_points'] = $total;
    }
    unset($team);

    // Sort contingent by total points (descending)
    usort($data['contingent'], function ($a, $b) {
        if ($b['total_points'] === $a['total_points']) {
            return strcmp($a['name'], $b['name']); // alphabetical tiebreak
        }
        return $b['total_points'] - $a['total_points'];
    });

    // Assign ranks (teams with equal points share the same rank)
    $rank = 1;
    foreach ($data['contingent'] as $i => &$team) {
        if ($i > 0 && $team['total_points'] < $data['contingent'][$i - 1]['total_points']) {
            $rank = $i + 1;
        }
        $team['rank'] = $rank;
    }
    unset($team);

    // Sort friendly by total points
    usort($data['friendly'], function ($a, $b) {
        return $b['total_points'] - $a['total_points'];
    });

    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
}

// =============================================
// POST: Update scores (admin only)
// =============================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();

    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized. Please login first.']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit;
    }

    if (!file_exists(DATA_FILE)) {
        http_response_code(404);
        echo json_encode(['error' => 'Data file not found']);
        exit;
    }

    $data = json_decode(file_get_contents(DATA_FILE), true);

    // --- Update contingent team score ---
    if (isset($input['type']) && $input['type'] === 'contingent') {
        if (!isset($input['team'], $input['sport'], $input['points'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing team, sport, or points']);
            exit;
        }

        $teamName = $input['team'];
        $sport    = $input['sport'];
        $points   = (int)$input['points'];

        // Validate sport key
        if (!array_key_exists($sport, SPORTS)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid sport: ' . $sport]);
            exit;
        }

        $found = false;
        foreach ($data['contingent'] as &$team) {
            if ($team['name'] === $teamName) {
                $team[$sport] = $points;
                $found = true;
                break;
            }
        }
        unset($team);

        if (!$found) {
            http_response_code(400);
            echo json_encode(['error' => 'Team not found: ' . $teamName]);
            exit;
        }
    }

    // --- Update friendly participant score ---
    elseif (isset($input['type']) && $input['type'] === 'friendly') {
        if (!isset($input['team'], $input['points'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing team or points']);
            exit;
        }

        $teamName = $input['team'];
        $points   = (int)$input['points'];

        $found = false;
        foreach ($data['friendly'] as &$team) {
            if ($team['name'] === $teamName) {
                $team['total_points'] = $points;
                $found = true;
                break;
            }
        }
        unset($team);

        if (!$found) {
            http_response_code(400);
            echo json_encode(['error' => 'Friendly team not found: ' . $teamName]);
            exit;
        }
    }

    // --- Bulk update (multiple scores at once) ---
    elseif (isset($input['type']) && $input['type'] === 'bulk') {
        if (!isset($input['updates']) || !is_array($input['updates'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing updates array']);
            exit;
        }

        foreach ($input['updates'] as $update) {
            $teamName = $update['team'];
            $sport    = $update['sport'];
            $points   = (int)$update['points'];

            foreach ($data['contingent'] as &$team) {
                if ($team['name'] === $teamName && array_key_exists($sport, SPORTS)) {
                    $team[$sport] = $points;
                }
            }
            unset($team);
        }
    }

    else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid update type. Use: contingent, friendly, or bulk']);
        exit;
    }

    // Save with timestamp
    $data['last_updated'] = date('c');
    file_put_contents(DATA_FILE, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);

    echo json_encode(['success' => true, 'message' => 'Score updated successfully', 'last_updated' => $data['last_updated']]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
