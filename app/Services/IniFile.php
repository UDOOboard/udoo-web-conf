<?php

namespace App\Services;

class IniFile
{
    private $file;
    private $values;

    public function __construct($file) {
        $this->file = $file;
        $this->values = parse_ini_file($this->file, true);
    }

    public function get() {
        return $this->values;
    }

    public function set($section, $key, $value) {
        $this->values[$section][$key] = $value;
    }

    public function update() {
        $new_content = '';
        foreach ($this->values as $section => $section_content) {
            $section_content = array_map(function($value, $key) {
                return "$key = $value";
            }, array_values($section_content), array_keys($section_content));
            $section_content = implode("\n", $section_content);
            $new_content .= "[$section]\n$section_content\n";
        }
        file_put_contents($this->file, $new_content);
    }
}
