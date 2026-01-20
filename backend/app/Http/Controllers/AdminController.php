<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * List all admins (Super Admin only)
     */
    public function index()
    {
        $admins = User::whereIn('role', ['admin', 'super_admin'])
            ->select('id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'admins' => $admins,
        ]);
    }

    /**
     * Create a new Admin (Super Admin only)
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8',
        ]);

        $admin = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'admin',
            'status'     => 'active',
        ]);

        return response()->json([
            'message' => 'Admin created successfully',
            'admin'   => [
                'id'         => $admin->id,
                'first_name' => $admin->first_name,
                'last_name'  => $admin->last_name,
                'email'      => $admin->email,
                'role'       => $admin->role,
                'status'     => $admin->status,
            ],
        ], 201);
    }

    /**
     * Suspend or Activate an Admin (Super Admin only)
     */
    public function toggleStatus($id)
    {
        $admin = User::where('id', $id)
            ->whereIn('role', ['admin', 'super_admin'])
            ->firstOrFail();

        // Prevent suspending self
        if ($admin->id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot change your own status',
            ], 403);
        }

        $admin->status = $admin->status === 'active'
            ? 'suspended'
            : 'active';

        $admin->save();

        return response()->json([
            'message' => 'Admin status updated successfully',
            'admin'   => [
                'id'     => $admin->id,
                'status' => $admin->status,
            ],
        ]);
    }

    /**
     * List all platform users (EXCLUDING admins)
     */
    public function users()
    {
        $users = User::whereNotIn('role', ['admin', 'super_admin'])
            ->select(
                'id',
                'first_name',
                'last_name',
                'email',
                'role',
                'status',
                'created_at'
            )
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }


    /**
     * Suspend or Activate a User (Admin & Super Admin)
     */
    public function toggleUserStatus($id)
    {
        $user = User::findOrFail($id);

        // Prevent self suspension
        if ($user->id === Auth::id()) {
            return response()->json([
                'message' => 'You cannot change your own status',
            ], 403);
        }

        $user->status = $user->status === 'active'
            ? 'suspended'
            : 'active';

        $user->save();

        return response()->json([
            'message' => 'User status updated successfully',
            'user'    => [
                'id'     => $user->id,
                'status' => $user->status,
            ],
        ]);
    }
}
