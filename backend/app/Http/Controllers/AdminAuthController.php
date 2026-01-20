<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    /**
     * Admin / Super Admin Login (API)
     */
    public function login(Request $request)
    {
        // 1. Validate request
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Find user by email
        $user = User::where('email', $request->email)->first();

        // 3. Check credentials
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // 4. Check role
        if (! in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // 5. Check account status
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Account suspended',
            ], 403);
        }

        // 6. Revoke old tokens (important for admin security)
        $user->tokens()->delete();

        // 7. Create new token with abilities
        $token = $user->createToken(
            'admin-token',
            $user->role === 'super_admin'
                ? ['admin:*']
                : ['admin:read']
        )->plainTextToken;

        // 8. Return response
        return response()->json([
            'token' => $token,
            'user'  => [
                'id'         => $user->id,
                'first_name' => $user->first_name,
                'last_name'  => $user->last_name,
                'email'      => $user->email,
                'role'       => $user->role,
            ],
        ]);
    }

    /**
     * Admin Logout (API)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
