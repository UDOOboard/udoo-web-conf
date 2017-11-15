<?php

namespace App\Services;

class Online
{
    public function isOnline() {
        exec("ping -c 1 google.com", $ping, $onlineStatus);

        return $onlineStatus === 0;
    }

    public function toString() {
        exec("ping -c 1 google.com", $ping, $onlineStatus);

        return $onlineStatus === 0 ? 'Connected' : 'Unavailable';
    }
}
