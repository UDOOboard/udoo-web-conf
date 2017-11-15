<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\ServiceProvider;

class BoardServiceProvider extends ServiceProvider
{
    /**
     * @return void
     */
    public function register()
    {
    }

    /**
     * @return void
     */
    public function boot()
    {
        if (array_key_exists('board', $_SESSION)) {
            return;
        }

        if (file_exists("/proc/device-tree/model")) {
            $model = file_get_contents("/proc/device-tree/model");
            $boardModel = trim($model);
            $cpuID = $this->getIMXCpuID();
            $arch = 'arm';
        } else {
            $boardModel = file_get_contents("/sys/class/dmi/id/board_name");
            $cpuID = file_get_contents("/sys/class/dmi/id/board_serial");
            $arch = 'x86';
        }

        switch ($boardModel) {
            case 'UDOO Quad Board':
                $shortModel = 'UDOO Quad';
                $boardImage = 'quad.png';
                $hasArduinoMenu = false;
                $hasM4 = false;
                $hasLvds15 = true;
                break;
            case 'UDOO Dual-lite Board':
                $shortModel = 'UDOO Dual';
                $boardImage = 'dual.png';
                $hasArduinoMenu = false;
                $hasM4 = false;
                $hasLvds15 = true;
                break;
            case 'UDOO Neo Extended':
                $shortModel = 'UDOO Neo';
                $boardImage = 'neo_extended.png';
                $hasArduinoMenu = true;
                $hasM4 = true;
                $hasLvds15 = false;
                break;
            case 'UDOO Neo Full':
                $shortModel = 'UDOO Neo';
                $boardImage = 'neo_full.png';
                $hasArduinoMenu = true;
                $hasM4 = true;
                $hasLvds15 = false;
                break;
            case 'UDOO Neo Basic Kickstarter':
            case 'UDOO Neo Basic':
                $shortModel = 'UDOO Neo';
                $boardImage = 'neo_basic.png';
                $hasArduinoMenu = true;
                $hasM4 = true;
                $hasLvds15 = false;
                break;
            default:
                $shortModel = $boardModel;
                $boardImage = 'unknown.png';
                $hasArduinoMenu = false;
                $hasM4 = false;
                $hasLvds15 = false;
        }

        exec("lsb_release -r", $out, $ret);
        $version = explode(":", $out[0]);
        $version = trim($version[1]);
        $is1604 = version_compare($version, "16.04", ">=");

        $_SESSION['board'] = [
            'arch' => $arch,
            'is1604' => $is1604,
            'model' => $boardModel,
            'shortmodel' => $shortModel,
            'id' => $cpuID,
            'image' => $boardImage,
            'supports' => [
                'arduino' => $hasArduinoMenu,
                'm4' => $hasM4,
                'lvds15' => $hasLvds15,
            ]
        ];
    }

    private function getIMXCpuID() {
        $H = trim(file_get_contents("/sys/fsl_otp/HW_OCOTP_CFG0"));
        $L = trim(file_get_contents("/sys/fsl_otp/HW_OCOTP_CFG1"));

        $H = str_replace("0x", "", $H);
        $L = str_replace("0x", "", $L);

        return strtoupper($L . $H);
    }
}
