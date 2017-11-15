<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller;

class PowerController extends Controller
{
    public function reboot() {
        return view('power/reboot');
    }

    public function rebootaction() {
        exec("sync && reboot");

        return response()->json([
            'success' => true
        ]);
    }

    public function poweroff() {
        return view('power/poweroff');
    }

    public function poweroffaction() {
        exec("sync && poweroff");

        return response()->json([
            'success' => true
        ]);
    }
}
