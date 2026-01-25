<?php

namespace App\Http\Controllers;

use App\Models\FundingOpportunity;
use Illuminate\Http\Request;

class AdminFundingController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => FundingOpportunity::with([
                'organization.user'
            ])->latest()->get()
        ]);
    }


    public function show($id)
    {
        $fund = FundingOpportunity::with([
            'organization.user'
        ])->find($id);

        if (!$fund) {
            return response()->json([
                'message' => 'Funding not found'
            ], 404);
        }

        return response()->json([
            'data' => $fund
        ]);
    }



    public function store(Request $request)
    {
        $data = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'deadline' => 'required|date',
            'amount' => 'required|numeric',
            'funding_type' => 'required|in:grant,equity,loan,convertible_note',
            'status' => 'required|in:pending,open,closed,cancelled',
        ]);

        $fund = FundingOpportunity::create($data);

        return response()->json(['data' => $fund]);
    }

    public function update(Request $request, $id)
    {
        $fund = FundingOpportunity::findOrFail($id);

        $data = $request->only([
            'title',
            'short_description',
            'description',
            'deadline',
            'amount',
            'funding_type',
            'status',
        ]);

        $fund->update($data);

        return response()->json([
            'message' => 'Funding updated',
            'data' => $fund,
        ]);
    }

    public function destroy($id)
    {
        FundingOpportunity::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function trashed()
    {
        return response()->json([
            'data' => FundingOpportunity::onlyTrashed()
                ->with(['organization.user'])
                ->latest()
                ->get()
        ]);
    }


    public function restore($id)
    {
        FundingOpportunity::withTrashed()->findOrFail($id)->restore();
        return response()->json(['message' => 'Restored']);
    }

    public function forceDelete($id)
    {
        FundingOpportunity::withTrashed()->findOrFail($id)->forceDelete();
        return response()->json(['message' => 'Permanently deleted']);
    }

    public function feature($id)
    {
        $funding = FundingOpportunity::withTrashed()->findOrFail($id);

        $funding->update([
            'is_featured' => !$funding->is_featured,
        ]);

        return response()->json([
            'message' => 'Funding feature status updated',
            'data' => $funding,
        ]);
    }
}
