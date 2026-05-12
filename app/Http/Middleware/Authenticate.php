<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // Jika request expect JSON (API), jangan redirect — return null
        return $request->expectsJson() ? null : route('login');
    }
}
