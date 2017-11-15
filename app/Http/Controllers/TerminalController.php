<?php

namespace App\Http\Controllers;

use App\Services\BackgroundService;
use Laravel\Lumen\Routing\Controller;

class TerminalController extends Controller
{
    public function index() {
        return view('terminal');
    }

    public function start() {
        if (array_key_exists('terminalservice', $_SESSION)) {
            return response()->json([
                'success' => true
            ]);
        }

        $_SESSION['terminalservice'] = true;
        $bs = new BackgroundService();
        return $bs->run("terminal");
    }
}
