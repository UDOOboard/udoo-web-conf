<?php

namespace App\Http\Controllers;

use App\Services\BackgroundService;
use App\Services\IoT;
use App\Services\Online;
use App\Services\Stats;
use Laravel\Lumen\Routing\Controller;
use App\Services\Connections;

class IndexController extends Controller
{
    public function index() {
        return redirect(route('dashboard'));
    }

    public function dashboard() {
        $hostname = file_get_contents("/etc/hostname");

        $connections = new Connections();
        $stats = new Stats();
        $iot = new IoT();
        $online = new Online();

        exec("udooscreenctl get", $screen, $status);
        if ($status === 0) {
            $screen = strtoupper(trim($screen[0]));
        } else {
            $screen = "Unknown";
        }

        return view('dashboard', [
            'ethernet' => str_replace(" ", "&nbsp;", $connections->getEthernetAddress()),
            'usb' => str_replace(" ", "&nbsp;", $connections->getUsbAddress()),
            'wlan' => str_replace(" ", "&nbsp;", $connections->getWirelessAddress()),
            'ssid' => str_replace(" ", "&nbsp;", $connections->getSSID()),
            'iot' => [
                'status' => $iot->getStatus(),
                'clientavailable' => $iot->isClientAvailable(),
                'loggedin' => $iot->isLoggedIn(),
            ],
            'board' => [
                'id' => $_SESSION['board']['id'],
                'name' => trim($hostname),
                'image' => $_SESSION['board']['image'],
                'model' => $_SESSION['board']['model'],
                'online' => $online->toString(),
                'display' => $screen,
                'os' => $stats->getOS(),
                'uptime' => $stats->getUptime(),
                'temp' => $stats->getCpuTemperature(),
                'disk' => $stats->getDiskUsage(),
                'ram' => $stats->getRamUsage(),
            ],
            'default_password' => array_key_exists('default_password', $_SESSION) && $_SESSION['default_password'] === true,
        ]);
    }

    public function startwebsocket() {
        if (array_key_exists('websocketservice', $_SESSION)) {
            return response()->json([
                'success' => true
            ]);
        }

        $_SESSION['websocketservice'] = true;
        $bs = new BackgroundService();
        return $bs->run("wsserver");
    }
}
