ALTER TABLE timers ADD COLUMN audio_cue INTEGER;
CREATE TABLE audio_cues ("id" SERIAL NOT NULL, "url" VARCHAR(255), "name" VARCHAR (255), dash_id VARCHAR(255), PRIMARY KEY ("id"));
ALTER TABLE timers ADD CONSTRAINT fk_audio FOREIGN KEY (audio_cue) REFERENCES audio_cues (id);
INSERT INTO audio_cues VALUES (0,'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3','Roar','demo');


CREATE TABLE organisations ("id" SERIAL NOT NULL, "name" VARCHAR(255), hash VARCHAR, PRIMARY KEY ("id"));
CREATE TABLE dashboards ("id" SERIAL NOT NULL, "dash_id" VARCHAR(10) UNIQUE NOT NULL, "org_id" INTEGER);
ALTER TABLE dashboards ADD CONSTRAINT fk_dashboards FOREIGN KEY (org_id) REFERENCES organisations ("id");
ALTER TABLE audio_cues ADD CONSTRAINT fk_dash FOREIGN KEY (dash_id) REFERENCES dashboards ("dash_id") ON UPDATE CASCADE;
ALTER TABLE posts ADD CONSTRAINT fk_dash FOREIGN KEY (dash_id) REFERENCES dashboards ("dash_id") ON UPDATE CASCADE;
ALTER TABLE round_types ADD CONSTRAINT fk_dash FOREIGN KEY (dash_id) REFERENCES dashboards ("dash_id") ON UPDATE CASCADE;