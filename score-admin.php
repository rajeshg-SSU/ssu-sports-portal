<?php
session_start();
require_once __DIR__ . '/config.php';

// --- Handle Login ---
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'login') {
        if ($_POST['username'] === ADMIN_USERNAME && $_POST['password'] === ADMIN_PASSWORD) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['login_time'] = time();
            header('Location: score-admin.php');
            exit;
        } else {
            $error = 'Invalid username or password!';
        }
    }
    if ($_POST['action'] === 'logout') {
        session_destroy();
        header('Location: score-admin.php');
        exit;
    }
}

// --- Check Session Timeout ---
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time'] > SESSION_TIMEOUT)) {
    session_destroy();
    header('Location: score-admin.php');
    exit;
}

$isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// --- Load Current Scores ---
$scores = [];
if (file_exists(DATA_FILE)) {
    $scores = json_decode(file_get_contents(DATA_FILE), true);
}

$sports = SPORTS;
$contingentTeams = [];
$friendlyTeams = [];
if (!empty($scores['contingent'])) {
    foreach ($scores['contingent'] as $team) {
        $contingentTeams[] = $team['name'];
    }
}
if (!empty($scores['friendly'])) {
    foreach ($scores['friendly'] as $team) {
        $friendlyTeams[] = $team['name'];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collympics 11.0 — Admin Panel</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚙️</text></svg>">
    <style>
        /* ====== Admin Panel Styles ====== */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
        }

        /* --- Navbar --- */
        .navbar {
            background: linear-gradient(135deg, #1a1a3e, #0d2137);
            color: #fff;
            padding: 15px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .navbar h1 {
            font-size: 1.3rem;
            color: #FFD700;
        }

        .navbar .nav-links {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .navbar a {
            color: #aaa;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s;
        }

        .navbar a:hover { color: #FFD700; }

        .btn-logout {
            background: rgba(255,0,0,0.15);
            border: 1px solid rgba(255,0,0,0.3);
            color: #ff6b6b;
            padding: 8px 18px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-logout:hover {
            background: rgba(255,0,0,0.25);
        }

        /* --- Login Form --- */
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .login-container h2 {
            text-align: center;
            color: #1a1a3e;
            margin-bottom: 8px;
            font-size: 1.5rem;
        }

        .login-container .sub-text {
            text-align: center;
            color: #888;
            margin-bottom: 25px;
            font-size: 0.9rem;
        }

        .form-group {
            margin-bottom: 18px;
        }

        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: #555;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .form-group input {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
            outline: none;
        }

        .form-group input:focus {
            border-color: #1a1a3e;
        }

        .btn-login {
            width: 100%;
            padding: 13px;
            background: linear-gradient(135deg, #1a1a3e, #0d2137);
            color: #FFD700;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: opacity 0.3s;
        }

        .btn-login:hover { opacity: 0.9; }

        .error-box {
            background: #fff3f3;
            border: 1px solid #ffcccc;
            color: #cc0000;
            padding: 10px 14px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 0.9rem;
            text-align: center;
        }

        /* --- Dashboard --- */
        .dashboard {
            max-width: 1100px;
            margin: 25px auto;
            padding: 0 20px;
        }

        .card {
            background: #fff;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }

        .card h3 {
            color: #1a1a3e;
            margin-bottom: 18px;
            font-size: 1.15rem;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }

        /* --- Update Form --- */
        .update-row {
            display: grid;
            grid-template-columns: 1fr 1fr 120px auto;
            gap: 12px;
            align-items: end;
            margin-bottom: 12px;
        }

        .update-row label {
            display: block;
            margin-bottom: 5px;
            color: #666;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .update-row select,
        .update-row input[type="number"] {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 0.95rem;
            outline: none;
            transition: border-color 0.3s;
        }

        .update-row select:focus,
        .update-row input[type="number"]:focus {
            border-color: #1a1a3e;
        }

        .btn-update {
            padding: 10px 24px;
            background: #1a1a3e;
            color: #FFD700;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            white-space: nowrap;
            height: 42px;
        }

        .btn-update:hover {
            background: #2a2a5e;
        }

        .btn-update:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* --- Notification --- */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 14px 24px;
            border-radius: 10px;
            color: #fff;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.4s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .notification.show { transform: translateX(0); }
        .notification.success { background: #27ae60; }
        .notification.error { background: #e74c3c; }

        /* --- Score Table in Admin --- */
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
            margin-top: 10px;
        }

        .admin-table th {
            background: #1a1a3e;
            color: #FFD700;
            padding: 10px 8px;
            text-align: center;
            font-size: 0.78rem;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .admin-table th:first-child,
        .admin-table th:nth-child(2) {
            text-align: left;
            padding-left: 12px;
        }

        .admin-table td {
            padding: 9px 8px;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
            color: #555;
        }

        .admin-table td:first-child {
            font-weight: 700;
            color: #888;
            width: 40px;
            text-align: center;
        }

        .admin-table td:nth-child(2) {
            text-align: left;
            padding-left: 12px;
            font-weight: 700;
            color: #1a1a3e;
        }

        .admin-table td:last-child {
            font-weight: 800;
            color: #FFD700;
            background: #fffdf0;
        }

        .admin-table td.scored {
            color: #27ae60;
            font-weight: 700;
        }

        .admin-table tr:hover {
            background: #f8f9fa;
        }

        .admin-table-wrapper {
            overflow-x: auto;
        }

        /* --- Friendly Update --- */
        .friendly-update-row {
            display: grid;
            grid-template-columns: 1fr 120px auto;
            gap: 12px;
            align-items: end;
            margin-bottom: 12px;
        }

        /* --- Responsive --- */
        @media (max-width: 768px) {
            .update-row {
                grid-template-columns: 1fr;
            }

            .friendly-update-row {
                grid-template-columns: 1fr;
            }

            .navbar {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>

<?php if (!$isLoggedIn): ?>
    <!-- ===== LOGIN PAGE ===== -->
    <div class="login-container">
        <h2>🔐 Admin Login</h2>
        <p class="sub-text">Collympics 11.0 — Score Management</p>

        <?php if ($error): ?>
            <div class="error-box"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST">
            <input type="hidden" name="action" value="login">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required autofocus placeholder="Enter username">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="Enter password">
            </div>
            <button type="submit" class="btn-login">Sign In</button>
        </form>
    </div>

<?php else: ?>
    <!-- ===== ADMIN DASHBOARD ===== -->

    <!-- Navbar -->
    <nav class="navbar">
        <h1>⚙️ Collympics 11.0 — Admin Panel</h1>
        <div class="nav-links">
            <a href="scoreboard.html" target="_blank">📊 View Scoreboard</a>
            <form method="POST" style="display:inline;">
                <input type="hidden" name="action" value="logout">
                <button type="submit" class="btn-logout">Logout</button>
            </form>
        </div>
    </nav>

    <!-- Notification -->
    <div id="notification" class="notification"></div>

    <div class="dashboard">

        <!-- ===== Update Contingent Score ===== -->
        <div class="card">
            <h3>🏅 Update Contingent Score</h3>
            <div class="update-row">
                <div>
                    <label>Department</label>
                    <select id="team-select">
                        <?php foreach ($contingentTeams as $team): ?>
                            <option value="<?= htmlspecialchars($team) ?>"><?= htmlspecialchars($team) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label>Sport</label>
                    <select id="sport-select">
                        <?php foreach ($sports as $key => $name): ?>
                            <option value="<?= $key ?>"><?= htmlspecialchars($name) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label>Points</label>
                    <input type="number" id="points-input" min="0" value="0" placeholder="0">
                </div>
                <div>
                    <button class="btn-update" id="btn-update-score" onclick="updateScore()">
                        ✅ Update
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== Update Friendly Score ===== -->
        <div class="card">
            <h3>🤝 Update Friendly Participant Score</h3>
            <div class="friendly-update-row">
                <div>
                    <label>Team</label>
                    <select id="friendly-team-select">
                        <?php foreach ($friendlyTeams as $team): ?>
                            <option value="<?= htmlspecialchars($team) ?>"><?= htmlspecialchars($team) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label>Total Points</label>
                    <input type="number" id="friendly-points-input" min="0" value="0" placeholder="0">
                </div>
                <div>
                    <button class="btn-update" onclick="updateFriendlyScore()">
                        ✅ Update
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== Current Scores Table ===== -->
        <div class="card">
            <h3>📊 Current Scores (Live Preview)</h3>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Department</th>
                            <?php foreach ($sports as $key => $name): ?>
                                <th><?= htmlspecialchars($name) ?></th>
                            <?php endforeach; ?>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body">
                        <!-- Filled by JS -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ===== Friendly Scores ===== -->
        <div class="card">
            <h3>🤝 Friendly Participants — Current Scores</h3>
            <table class="admin-table" style="max-width: 400px;">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody id="admin-friendly-body">
                    <!-- Filled by JS -->
                </tbody>
            </table>
        </div>

    </div>

    <script>
        const API_URL = 'api/scores.php';

        const SPORT_KEYS = <?= json_encode(array_keys($sports)) ?>;

        // ===== Show notification =====
        function showNotification(msg, type) {
            const el = document.getElementById('notification');
            el.textContent = msg;
            el.className = 'notification ' + type + ' show';
            setTimeout(() => { el.classList.remove('show'); }, 3000);
        }

        // ===== Fetch and render current scores =====
        async function loadAdminScores() {
            try {
                const res = await fetch(API_URL + '?t=' + Date.now());
                const data = await res.json();

                // Render contingent table
                const tbody = document.getElementById('admin-table-body');
                let html = '';
                data.contingent.forEach(team => {
                    html += '<tr>';
                    html += `<td>${team.rank}</td>`;
                    html += `<td>${team.name}</td>`;
                    SPORT_KEYS.forEach(key => {
                        const val = team[key] || 0;
                        html += `<td class="${val > 0 ? 'scored' : ''}">${val}</td>`;
                    });
                    html += `<td>${team.total_points}</td>`;
                    html += '</tr>';
                });
                tbody.innerHTML = html;

                // Render friendly table
                const friendlyBody = document.getElementById('admin-friendly-body');
                let fhtml = '';
                data.friendly.forEach((team, i) => {
                    fhtml += `<tr>
                        <td>${i + 1}</td>
                        <td>${team.name}</td>
                        <td class="${team.total_points > 0 ? 'scored' : ''}">${team.total_points}</td>
                    </tr>`;
                });
                friendlyBody.innerHTML = fhtml;

            } catch (err) {
                console.error('Failed to load scores:', err);
            }
        }

        // ===== Update contingent score =====
        async function updateScore() {
            const team   = document.getElementById('team-select').value;
            const sport  = document.getElementById('sport-select').value;
            const points = parseInt(document.getElementById('points-input').value) || 0;

            const btn = document.getElementById('btn-update-score');
            btn.disabled = true;
            btn.textContent = 'Saving...';

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'contingent',
                        team: team,
                        sport: sport,
                        points: points
                    })
                });

                const data = await res.json();

                if (data.success) {
                    showNotification(`✅ ${team} — ${sport} updated to ${points} points!`, 'success');
                    loadAdminScores(); // Refresh table
                } else {
                    showNotification('❌ Error: ' + (data.error || 'Unknown error'), 'error');
                }
            } catch (err) {
                showNotification('❌ Network error: ' + err.message, 'error');
            }

            btn.disabled = false;
            btn.textContent = '✅ Update';
        }

        // ===== Update friendly score =====
        async function updateFriendlyScore() {
            const team   = document.getElementById('friendly-team-select').value;
            const points = parseInt(document.getElementById('friendly-points-input').value) || 0;

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'friendly',
                        team: team,
                        points: points
                    })
                });

                const data = await res.json();

                if (data.success) {
                    showNotification(`✅ ${team} updated to ${points} points!`, 'success');
                    loadAdminScores();
                } else {
                    showNotification('❌ Error: ' + (data.error || 'Unknown error'), 'error');
                }
            } catch (err) {
                showNotification('❌ Network error: ' + err.message, 'error');
            }
        }

        // ===== Init =====
        document.addEventListener('DOMContentLoaded', () => {
            loadAdminScores();
            // Auto-refresh admin table every 15 seconds
            setInterval(loadAdminScores, 15000);
        });
    </script>

<?php endif; ?>

</body>
</html>
