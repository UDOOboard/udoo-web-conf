<?php

namespace App\Http\Controllers;

use App\Services\BackgroundService;
use Laravel\Lumen\Routing\Controller;

class UpdatesController extends Controller
{
    public function update() {
        if (array_key_exists('updateservice', $_SESSION)) {
            exec("ps aux | grep \"[a]pt update\" |awk '{print $2}'", $out, $ret);

            if (count($out) > 0) {
                return response()->json([
                    'success' => true,
                    'pending' => true,
                ]);
            } else {
                if (!array_key_exists('updates', $_SESSION)) {
                    $_SESSION['updates'] = $this->getNumberOfUpdates();
                }
                return response()->json([
                    'success' => true,
                    'pending' => false,
                    'updates' => $_SESSION['updates'],
                ]);
            }
        }

        $_SESSION['updateservice'] = true;
        $bs = new BackgroundService();
        return $bs->run("apt-update");
    }

    public function install() {
        return view('updates');
    }

    public function distupgrade() {
        $bs = new BackgroundService();
        return $bs->run("apt-upgrade");
    }

    public function installed() {
        $_SESSION['updates'] = $this->getNumberOfUpdates();
        return response()->json([
            'success' => true,
        ]);
    }

    private function getNumberOfUpdates() {
        exec('LANGUAGE=C apt-get dist-upgrade -V --assume-no |grep "upgraded, "', $out, $ret);

        if (count($out) == 0) {
            return 0;
        }

        $parts = explode("upgraded, ", $out[0]);
        return (int) trim($parts[0]);
    }
}
