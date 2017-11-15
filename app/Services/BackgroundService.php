<?php

namespace App\Services;

class BackgroundService
{
    public function run($name) {
        $script = $this->generateScript("./$name.sh", app()->basePath() . "/bin", $name);
        return $this->executeInBackground($script);
    }

    private function generateScript($command, $dir, $name) {
        $script = "#/bin/bash\ncd $dir\nexec nohup setsid $command &\n";

        $fileName = sys_get_temp_dir() . "/uwc-script-$name.sh";

        file_put_contents($fileName, $script);
        chmod($fileName, 0770);

        return $fileName;
    }

    private function executeInBackground($script) {
        exec("$script >> /dev/null 2>&1 &");

        return response()->json([
            'success' => true,
            'started' => true,
        ]);
    }
}
