<?php

namespace App\Services;

class Stats
{
    public function getCpuTemperature()
    {
        $temp = (int)trim(file_get_contents("/sys/class/thermal/thermal_zone0/temp"));
        return number_format($temp/1000, 1);
    }

    public function getOS()
    {
        $os = trim(file_get_contents("/etc/issue"));
        $os = explode(PHP_EOL, $os);
        return trim(str_replace('\n \l', '', $os[0]));
    }

    public function getUptime()
    {
        $uptime = trim(file_get_contents("/proc/uptime"));
        $uptime = explode(" ", $uptime);
        return $this->secondsToTime((float)$uptime[0]);
    }

    public function getDiskUsage() {
        exec("df -x tmpfs -x devtmpfs |grep -v \'/boot\' |awk '{print $2 \"   \" $3}'", $disk, $retval);
        $disk = explode('   ', $disk[1]);
        return [
            'total' => (int)$disk[0],
            'used' => (int)$disk[1],
            'free' => (int)$disk[0] - (int)$disk[1]
        ];
    }

    public function getRamUsage() {
        exec("free |grep Mem|awk '{print $2 \"   \" $3 \"   \" \$NF-1}'", $ram, $retval);
        $ram = explode('   ', $ram[0]);

        if ($_SESSION['board']['is1604']) {
            return [
                'total' => (int)$ram[0],
                'used' => (int)$ram[1],
            ];
        } else {
            return [
                'total' => (int)$ram[0],
                'used' => (int)$ram[1] - (int)$ram[2]
            ];
        }
    }

    private function secondsToTime($inputSeconds) {
        $secondsInAMinute = 60;
        $secondsInAnHour = 60 * $secondsInAMinute;
        $secondsInADay = 24 * $secondsInAnHour;

        // Extract days
        $days = floor($inputSeconds / $secondsInADay);

        // Extract hours
        $hourSeconds = $inputSeconds % $secondsInADay;
        $hours = floor($hourSeconds / $secondsInAnHour);

        // Extract minutes
        $minuteSeconds = $hourSeconds % $secondsInAnHour;
        $minutes = floor($minuteSeconds / $secondsInAMinute);

        // Extract the remaining seconds
        $remainingSeconds = $minuteSeconds % $secondsInAMinute;
        $seconds = ceil($remainingSeconds);

        // Format and return
        $timeParts = [];
        $sections = [
            'day' => (int)$days,
            'hour' => (int)$hours,
            'minute' => (int)$minutes,
            'second' => (int)$seconds,
        ];

        $i = 0;
        foreach ($sections as $name => $value) {
            if ($value > 0 && $i < 2) {
                $i++;
                $timeParts[] = $value. ' '.$name.($value == 1 ? '' : 's');
            }
        }

        return implode(', ', $timeParts);
    }
}
