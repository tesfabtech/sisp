<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Mentor;
use App\Models\Startup;
use Illuminate\Http\Request;
use App\Enums\MentorshipStatus;

class MessageController extends Controller
{
    // Fetch messages between startup and approved mentor
    public function index(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
        ]);

        // Determine if user is a startup or a mentor
        $user = $request->user();

        if ($mentor = Mentor::where('user_id', $user->id)->first()) {
            // Mentor side
            $startup = $mentor->mentorshipRequests()
                ->where('status', MentorshipStatus::ACCEPTED)
                ->where('startup_id', $request->startup_id)
                ->first()?->startup;
        } else {
            // Startup side
            $startup = Startup::where('id', $request->startup_id)
                ->where('user_id', $user->id)
                ->first();
            $mentor = $startup->mentorshipRequests()
                ->where('status', MentorshipStatus::ACCEPTED)
                ->first()?->mentor;
        }

        if (!$startup || !$mentor) {
            return response()->json([]);
        }

        $messages = Message::where('startup_id', $startup->id)
            ->where('mentor_id', $mentor->id)
            ->orderBy('created_at')
            ->get()
            ->map(fn($msg) => [
                'id' => $msg->id,
                'sender' => $msg->sender,
                'content' => $msg->content,
                'created_at' => $msg->created_at->toDateTimeString(),
            ]);

        return response()->json($messages);
    }

    // Send a message
    public function store(Request $request)
    {
        $request->validate([
            'startup_id' => 'required|exists:startups,id',
            'sender' => 'required|in:startup,mentor',
            'content' => 'required|string|max:1000',
        ]);

        $user = $request->user();

        if ($mentor = Mentor::where('user_id', $user->id)->first()) {
            // Mentor sending
            $startup = $mentor->mentorshipRequests()
                ->where('status', MentorshipStatus::ACCEPTED)
                ->where('startup_id', $request->startup_id)
                ->first()?->startup;
        } else {
            // Startup sending
            $startup = Startup::where('id', $request->startup_id)
                ->where('user_id', $user->id)
                ->first();
            $mentor = $startup->mentorshipRequests()
                ->where('status', MentorshipStatus::ACCEPTED)
                ->first()?->mentor;
        }

        if (!$startup || !$mentor) {
            return response()->json(['error' => 'No approved mentor or startup found'], 422);
        }

        $message = Message::create([
            'startup_id' => $startup->id,
            'mentor_id' => $mentor->id,
            'sender' => $request->sender,
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'message' => [
                'id' => $message->id,
                'sender' => $message->sender,
                'content' => $message->content,
                'created_at' => $message->created_at->toDateTimeString(),
            ],
        ], 201);
    }

    // Delete single message
    public function destroy($id)
    {
        $msg = Message::findOrFail($id);
        $msg->delete();
        return response()->json(['success' => true]);
    }

    // Delete all messages for a startup
    public function destroyAll(Request $request)
    {
        $request->validate(['startup_id' => 'required|exists:startups,id']);
        Message::where('startup_id', $request->startup_id)->delete();
        return response()->json(['success' => true]);
    }
}
