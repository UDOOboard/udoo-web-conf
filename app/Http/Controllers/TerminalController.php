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
        $bs = new BackgroundService();
        return $bs->run("terminal");
    }
}
