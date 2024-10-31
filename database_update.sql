ALTER TABLE timers ADD COLUMN audio_cue INTEGER;
CREATE TABLE audio_cues ("id" SERIAL NOT NULL, "url" VARCHAR(255), "name" VARCHAR (255), dash_id VARCHAR(255), PRIMARY KEY ("id"));
ALTER TABLE timers ADD CONSTRAINT fk_audio FOREIGN KEY (audio_cue) REFERENCES audio_cues (id);
INSERT INTO audio_cues VALUES (0,'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3','Roar','demo');