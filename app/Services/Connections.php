<?php

namespace App\Services;

class Connections
{
    private $devices;

    public function __construct()
    {
        $this->devices = [
            'eth' => $this->getInterfaceName(["eth", "en"]),
            'wlan' => $this->getInterfaceName(["wl"]),
            'usb' => $this->getInterfaceName(["usb"]),
        ];
    }

    public function getEthernetAddress()
    {
        if ($this->devices['eth']) {
            return $this->getInterfaceAddress($this->devices['eth']);
        }

        return 'Not available';
    }

    public function getWirelessAddress()
    {
        if ($this->devices['wlan']) {
            return $this->getInterfaceAddress($this->devices['wlan']);
        }

        return 'Not available';
    }

    public function getUsbAddress()
    {
        if ($this->devices['usb']) {
            return $this->getInterfaceAddress($this->devices['usb']);
        }

        return 'Not available';
    }

    public function getSSID() {
        if (!$this->devices['wlan']) {
            return;
        }

        $ssid = trim(exec("iw dev " . $this->devices['wlan'] . " link | grep SSID"));
        if ($ssid) {
            $ssid = explode("SSID:", $ssid);
            $ssid = trim($ssid[1]);
        }
        return $ssid;
    }

    private function getInterfaceName(array $names) {
        $files = scandir("/sys/class/net");
        foreach ($files as $file) {
            foreach ($names as $name) {
                if (strpos($file, $name) === 0) {
                    return $file;
                }
            }
        }
    }

    private function getInterfaceAddress($interface) {
        if ($interface === null) {
            return 'Not connected';
        }
        $result = trim(exec("ip -4 -o addr show $interface"));
        if (!$result) {
            return 'Not connected';
        }
        $parts = explode("inet ", $result);
        $parts = explode("/", $parts[1]);
        return $parts[0];
    }
}
