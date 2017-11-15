<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->is("login")) {
            if (!array_key_exists('auth', $_SESSION) || $_SESSION['auth'] !== true) {
                return redirect('login');
            }
        }

        return $next($request);
    }
}
