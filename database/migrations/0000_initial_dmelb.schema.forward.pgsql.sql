--  database/migrations/0000_initial_dmelb.schema.forward.pgsql.sql
--  Database migration (forward): Initial schema representing ‘demo’.

CREATE TABLE IF NOT EXISTS "round_types" (
    "id" SERIAL NOT NULL,
    "round_name" VARCHAR(255) NOT NULL,
    "dash_id" VARCHAR(255) NULL DEFAULT NULL,
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "round_types" IS
    'Game round defined for a dashboard.';
COMMENT ON COLUMN "round_types.id" IS
    'Internal identifier for this round type.';
COMMENT ON COLUMN "round_types.round_name" IS
    'Display name for this round type.';
COMMENT ON COLUMN "round_types.dash_id" IS
    'Identifying name of the dashboard in which this is a round type.';


CREATE TABLE IF NOT EXISTS "game_structure" (
    "id" SERIAL NOT NULL,
    "round_id" INTEGER NOT NULL,
    CONSTRAINT "FKgame" FOREIGN KEY ("round_id")
        REFERENCES "round_types" ("id")
        ON UPDATE CASCADE
        ON DELETE SET DEFAULT,
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "game_structure" IS
    'Timed round for a game';
COMMENT ON COLUMN "game_structure.id" IS
    'Internal identifier for this round.';
COMMENT ON COLUMN "game_structure.round_id" IS
    'Identifier of the type of this round.';


CREATE TABLE IF NOT EXISTS "timers" (
    "id" SERIAL NOT NULL,
    "phase" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,
    "round_id" INTEGER NOT NULL,
    "minor" BOOLEAN NULL DEFAULT NULL,
    CONSTRAINT "FKphase_round" FOREIGN KEY ("round_id")
        REFERENCES "round_types" ("id")
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "timers" IS
    'Fixed duration timer for a game round.';
COMMENT ON COLUMN "timers.id" IS
    'Internal identifier for this timer.';
COMMENT ON COLUMN "timers.phase" IS
    'Game phase when this timer occurs.';
COMMENT ON COLUMN "timers.duration" IS
    'Duration (minutes) of this timer.';
COMMENT ON COLUMN "timers.round_id" IS
    'Identifier of the round type of this timer.';
COMMENT ON COLUMN "timers.minor" IS
    'Is this timer omitted from the display list of phases?';


CREATE TABLE IF NOT EXISTS "posts" (
    "id" SERIAL NOT NULL,
    "dash_id" VARCHAR(255) NULL DEFAULT NULL,
    "timecode" TIME NOT NULL,
    "posttext" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NULL DEFAULT NULL,
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "posts" IS
    'Individual posted item to a media feed for a dashboard';
COMMENT ON COLUMN "posts.id" IS
    'Internal identifier for this posted item.';
COMMENT ON COLUMN "posts.dash_id" IS
    'Identifying name of the dashboard in which this is a media post.';
COMMENT ON COLUMN "posts.timecode" IS
    'Time of day when the item was posted to the dashboard.';
COMMENT ON COLUMN "posts.posttext" IS
    'Text content of the posted item.';
COMMENT ON COLUMN "posts.active" IS
    'Is this item active for display in the media feed?';


--  Local variables:
--  coding: utf-8
--  mode: sql
--  End:
--  vim: fileencoding=utf-8 filetype=sql :
