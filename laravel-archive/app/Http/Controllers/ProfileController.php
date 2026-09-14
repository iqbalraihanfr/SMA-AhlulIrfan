<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

/**
 * Pengelolaan akun sendiri.
 *
 * Menghapus akun sendiri SENGAJA tidak disediakan — admin sekolah yang salah
 * pencet bisa mengunci dirinya sendiri keluar dari situs, dan tidak ada tim IT
 * yang siaga memulihkannya. Penghapusan akun dilakukan super admin.
 */
class ProfileController extends Controller
{
    public function edit(Request $request): View
    {
        return view('profile.edit', ['user' => $request->user()]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated())->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }
}
