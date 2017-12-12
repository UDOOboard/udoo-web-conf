<?php

namespace App\Services;

class Hardware
{
    public function getConnectedScreen() {
        if ($_SESSION['board']['arch'] == 'arm') {
            exec("udooscreenctl get", $screen, $status);
            if ($status === 0) {
                return strtoupper(trim($screen[0]));
            } else {
                return "Unknown";
            }
        } else {
            return 'HDMI';
        }
    }
}
