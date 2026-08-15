<?php

namespace Tests;

use App\View\Composers\SitusComposer;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // SitusComposer memoisasi pengaturan situs per proses. Seluruh test
        // berjalan dalam satu proses, jadi memo harus dilupakan antar-kasus
        // agar data dari test sebelumnya tidak bocor.
        SitusComposer::lupakan();
    }
}
