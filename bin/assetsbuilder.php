<?php

require_once __DIR__ . '/../vendor/autoload.php';

use MatthiasMullie\Minify;

class AssetsBuilder
{
    public function __construct() {
        $this->template = file_get_contents(__DIR__ . "/../resources/views/template.blade.php");
    }

    public function run() {
        $this->buildStyles();
        $this->buildScripts();
    }

    private function stringToArray($list) {
        $ret = [];
        foreach (explode(PHP_EOL, trim($list)) as $element) {
            $element = trim($element);
            $element = substr($element, 1);
            $element = substr($element, 0, -2);
            $ret[] = realpath(__DIR__ . "/../public" . $element);
        }
        return $ret;
    }

    private function buildStyles() {
        $styles = explode('$assetsManager->includeStyles([', $this->template);
        $styles = explode(']);', $styles[1]);
        $styles = $this->stringToArray($styles[0]);

        $minifier = new Minify\CSS();
        foreach ($styles as $style) {
            $minifier->add($style);
        }
        $minifier->minify(__DIR__ . "/../public/css/app.min.css");
        echo "Styles built!" . PHP_EOL;
    }

    private function buildScripts() {
        $scripts = explode('$assetsManager->includeScripts([', $this->template);
        $scripts = explode(']);', $scripts[1]);
        $scripts = $this->stringToArray($scripts[0]);

        $minifier = new Minify\JS();
        foreach ($scripts as $script) {
            $minifier->add($script);
        }
        $minifier->minify(__DIR__ . "/../public/js/app.min.js");
        echo "Scripts built!" . PHP_EOL;
    }
}

$app = new AssetsBuilder();
$app->run();
