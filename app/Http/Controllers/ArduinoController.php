<?php

namespace App\Http\Controllers;

use App\Services\IoT;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller;

class ArduinoController extends Controller
{
    public function samples() {
        return view('arduino/samples');
    }

    public function webide() {
        if (file_exists($this->getSketchPath())) {
            $last = file_get_contents($this->getSketchPath());
        } else {
            $last = "void setup() {
                        }
                        
                        void loop() {
                        }
                        ";
        }

        return view('arduino/webide', [
            'last' => $last
        ]);
    }

    public function appinventor() {
        $iot = new IoT();

        return view('arduino/appinventor', [
            'loggedin' => $iot->getStatus() != 'Not logged in',
        ]);
    }

    public function uploadsketch($sketch) {
        exec("/usr/bin/udooneo-m4uploader " . app()->basePath() . "/arduino/examples/" . $sketch . ".bin", $out, $status);

        return response()->json([
            'success' => $status === 0 ? true : false,
            'message' => implode("<br>", $out)
        ]);
    }

    public function compilesketch() {

        $command = "xvfb-run /usr/bin/arduino --upload ". $this->getSketchPath();
        exec($command, $out, $status);
	$out_string = implode("\n", $out);
        $success = strpos($out_string, 'Success!!') !== false;

        return [
            'success' => $status === 0  && $success ? true : false,
            'errors' => [],
            'ide_data' => [
                'std_output' => "Output from Arduino IDE: " . $out_string,
                'err_output' => '',

            ]
        ];
    }

    public function ardublockly() {
        return view('arduino/ardublockly');
    }

    public function ardublocklycompile(Request $request) {
        $code = $request->request->get("sketch_code");

        file_put_contents($this->getSketchPath(), $code);

        $response = $this->compilesketch();

        return response()->json($response);

    }

    private function getSketchPath() {
        $dir = app()->basePath() ."/arduino/sketch";
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        return $dir . "/sketch.ino";
    }
}
