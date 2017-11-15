<?php

namespace App\Services;

class IoT
{
    private $status;
    private $clientAvailable;

    public function authenticate($username, $password) {
        $url = 'http://127.0.0.1/login';
        $params = [
            'username' => $username,
            'password' => $password,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_PORT, 16969);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        $output = curl_exec($ch);

        $record = json_decode($output, true);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Invalid login response from UDOO IoT.',
            ];
        }

        if (!$record['success'] && $record['message'] == 'Unauthorized') {
            return [
                'success' => false,
                'message' => 'Invalid username or password.',
            ];
        }

        return $record;
    }

    public function logout($username, $password) {
        $url = 'http://127.0.0.1/logout';
        $params = [
            'username' => $username,
            'password' => $password,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_PORT, 16969);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
        $output = curl_exec($ch);

        $record = json_decode($output, true);

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Invalid login response from UDOO IoT.',
            ];
        }

        if (!$record['success'] && $record['message'] == 'Unauthorized') {
            return [
                'success' => false,
                'message' => 'Invalid username or password.',
            ];
        }

        return $record;
    }

    public function getStatus() {
        $this->initStatus();

        if (!$this->status) {
            return 'Unknown';
        }

        $code = $this->status['code'];

        if ($code == -1) return 'Client not ready';
        if ($code == 0) return 'Service is starting';
        if ($code == 1) return 'Not logged in';
        if ($code == 2 || $code == 3) return 'Connecting';
        if ($code == 4 || $code == 5 || $code == 6) return 'Connected';
        if ($code == 7) return 'Requests terminated';
        if ($code == 8 || $code == 9) return 'No network';
        if ($code == 10) return 'Logged out';

        return "Unknown ($code)";
    }

    public function isClientAvailable() {
        $this->initStatus();
        return $this->clientAvailable;
    }

    public function isLoggedIn() {
        $this->initStatus();

        $code = $this->status['code'];

        if ($code == 1 || $code == 9) return false;
        return true;
    }

    public function isConnected() {
        $this->initStatus();

        $code = $this->status['code'];

        if ($code == 4 || $code == 5 || $code == 6) return true;
        return false;
    }

    private function initStatus() {
        if (!$this->status) {
            $url = 'http://127.0.0.1/status';

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_PORT, 16969);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            $output = curl_exec($ch);

            if ($output === false) {
                $this->clientAvailable = false;
                $this->status = ['code' => -1];
                return;
            }

            $this->clientAvailable = true;
            $this->status = json_decode($output, true);
        }
    }
}
