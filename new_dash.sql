INSERT INTO audio_cues (url,name,dash_id) VALUES ('url_here','Cue 1','DASHID');

INSERT INTO posts (posttext,timecode,active,dash_id) VALUES ('Welcome to megagame.space!','00:00:00',true,'DASHID');


INSERT INTO round_types (round_name,dash_id) VALUES ('main','DASHID') RETURNING id;

INSERT INTO game_structure (round_id) VALUES (roundId);

INSERT INTO timers (phase,duration,round_id,minor) VALUES ('Main',20,roundId,false);
