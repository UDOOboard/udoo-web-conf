<?php

namespace App\Http\Controllers;

use App\Services\BackgroundService;
use App\Services\IoT;
use App\Services\Online;
use App\Services\IniFile;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller;

class IotController extends Controller
{
    public function index() {
        $iot = new IoT();

        if (!$iot->isClientAvailable()) {
            return redirect(route('iot-service'));
        }

        if (!$iot->isLoggedIn()) {
            return redirect(route('iot-login'));
        }

        $ini = new IniFile("/etc/udoo-iot-client/config.ini");
        $conf = $ini->get();

        return view('iot/index', [
            'status' => $iot->getStatus(),
            'server' => $conf['server']['ip'],
        ]);
    }

    public function service() {
        return '^_^';
    }

    public function login() {
        $iot = new IoT();
        $online = new Online();

        $ini = new IniFile("/etc/udoo-iot-client/config.ini");
        $conf = $ini->get();

        $base = $conf['server']['protocol'] . '://' . $conf['server']['ip'];
        if ($conf['server']['port'] != 80) {
            $base .= ':' . $conf['server']['port'];
        }

        return view('iot/login', [
            'online' => $online->isOnline(),
            'iotserver' => $conf['server'],
            'iotbaseurl' => $base,
            'hostname' => trim(file_get_contents("/etc/hostname")),
        ]);
    }

    public function logout() {
        $online = new Online();
        return view('iot/logout', [
            'online' => $online->isOnline(),
        ]);
    }

    public function register(Request $request) {
        $username = $request->request->get("username");
        $password = $request->request->get("password");

        $iot = new IoT();
        $result = $iot->authenticate($username, $password);

        return response()->json($result);
    }

    public function unregister(Request $request) {
        $username = $request->request->get("username");
        $password = $request->request->get("password");

        $iot = new IoT();
        $result = $iot->logout($username, $password);

        return response()->json($result);
    }

    public function setserver(Request $request) {
        $ip = $request->request->get("ip");
        $port = $request->request->get("port");
        $protocol = $request->request->get("protocol");

        $ini = new IniFile("/etc/udoo-iot-client/config.ini");
        $ini->set('server', 'ip', $ip);
        $ini->set('server', 'port', $port);
        $ini->set('server', 'protocol', $protocol);
        $ini->update();

        exec("service udoo-iot-cloud-client restart");

        return response()->json([
            'success' => true,
        ]);
    }

    public function log() {
        return view('iot/log');
    }

    public function logserver() {
        $bs = new BackgroundService();
        return $bs->run("iot-log");
    }
}
