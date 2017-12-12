<?php

namespace App\Services;

class Hardware
{
    public function getConnectedScreen() {
        if ($_SESSION['board']['arch'] == 'arm') {
            exec("udooscreenctl get", $screen, $status);
            if ($status === 0) {
                $screen = strtoupper(trim($screen[0]));
            } else {
                $screen = "Unknown";
            }
        } else {
            return 'HDMI';
        }
    }
}
