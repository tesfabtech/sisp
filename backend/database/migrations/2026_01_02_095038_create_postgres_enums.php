<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                CREATE TYPE user_role AS ENUM ('admin','startup','mentor','investor','organization','public');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
                CREATE TYPE user_status AS ENUM ('active','suspended');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'org_type') THEN
                CREATE TYPE org_type AS ENUM ('government','ngo','private','university','accelerator');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'startup_stage') THEN
                CREATE TYPE startup_stage AS ENUM ('idea','mvp','launched','scaling');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'startup_status') THEN
                CREATE TYPE startup_status AS ENUM ('pending','approved','rejected');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mentorship_status') THEN
                CREATE TYPE mentorship_status AS ENUM ('pending','accepted','rejected','completed');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_mode') THEN
                CREATE TYPE session_mode AS ENUM ('online','physical');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
                CREATE TYPE session_status AS ENUM ('scheduled','completed','cancelled');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_type') THEN
                CREATE TYPE challenge_type AS ENUM ('innovation','hackathon','pitch');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_status') THEN
                CREATE TYPE challenge_status AS ENUM ('open','closed','archived');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_app_status') THEN
                CREATE TYPE challenge_app_status AS ENUM ('submitted','shortlisted','rejected','winner');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type') THEN
                CREATE TYPE event_type AS ENUM ('conference','workshop','networking','bootcamp');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_venue') THEN
                CREATE TYPE event_venue AS ENUM ('physical','virtual');
            END IF;

            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'funding_app_status') THEN
                CREATE TYPE funding_app_status AS ENUM ('submitted','reviewed','accepted','rejected');
            END IF;
        END $$;
        ");
    }

    public function down(): void {}
};
