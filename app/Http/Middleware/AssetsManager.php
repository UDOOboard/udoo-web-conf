<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AssetsManager
{
    public function includeStyles(array $styles) {
        if (app()->environment('local')) {
            $ret = [];
            foreach ($styles as $style) {
                $ret[] = '<link rel="stylesheet" type="text/css" href="'.$style.'" />';
            }
            return implode("\n\t", $ret).PHP_EOL;
        }

        return '<link rel="stylesheet" type="text/css" href="/css/app.min.css" />';
    }

    public function includeScripts(array $scripts) {
        if (app()->environment('local')) {
            $ret = [];
            foreach ($scripts as $script) {
                $ret[] = '<script src="'.$script.'"></script>';
            }
            return implode("\n\t", $ret).PHP_EOL;
        }

        return '<script src="/js/app.min.js"></script>';
    }
}
