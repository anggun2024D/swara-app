<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Daftarkan JWT Aliases
        $this->app->booting(function() {
            $loader = \Illuminate\Foundation\AliasLoader::getInstance();
            $loader->alias('JWTAuth', \Tymon\JWTAuth\Facades\JWTAuth::class);
            $loader->alias('JWTFactory', \Tymon\JWTAuth\Facades\JWTFactory::class);
        });
    }

    public function boot(): void
    {
        //
    }
}
