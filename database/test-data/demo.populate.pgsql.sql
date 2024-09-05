--  database/test-data/demo.populate.pgsql.sql
--  Populate tables with test data for example ‘demo’ dashboard.

INSERT INTO "round_types" ("id", "round_name", "dash_id")
VALUES
    (1, 'Normal', 'demo'),
    (2, 'Lunch', 'demo');

INSERT INTO "game_structure" ("round_id")
VALUES
    (1),
    (1),
    (2),
    (1),
    (1);

INSERT INTO "timers" ("phase", "duration", "round_id", "minor")
VALUES
    ('Test', 45, 2, 'false'),
    ('Ministerial', 5, 2, 'false'),
    ('Main', 1, 1, 'false'),
    ('Ministerial', 1, 1, 'false'),
    ('Main 2', 1, 1, 'false'),
    ('Main 3', 1, 1, 'false');


INSERT INTO "posts" ("dash_id", "timecode", "posttext", "active")
VALUES
    ('demo', '00:22:35', 'Suspendisse facilisis nunc nec mauris scelerisque convallis non vel massa. Donec et maximus velit, sit amet eleifend turpis. Proin nec ante aliquam, rutrum nulla ut, rutrum justo. Praesent at odio vehicula, ullamcorper erat et orci aliquam. ', 'true'),
    ('demo', '00:23:54', 'Vivamus porttitor eros non magna pellentesque mattis. Curabitur suscipit eu magna nec ullamcorper. Cras in tellus sit amet sapien scelerisque faucibus non non ligula. Morbi purus ligula, finibus quis imperdiet quis, ullamcorper quis nullam. ', 'true'),
    ('demo', '00:25:56', ' Donec a imperdiet massa. Sed erat massa, mattis quis feugiat nec, lacinia non arcu. Sed vitae sapien libero. Cras placerat ex auctor purus molestie tempus. Cras est massa, posuere sed enim eget, viverra malesuada nulla. Fusce facilisis sit. ', 'true'),
    ('demo', '00:37:14', 'In vehicula, tortor lacinia rhoncus posuere, ligula purus rhoncus massa, egestas aliquet ex ipsum eu orci. Donec ultrices placerat augue, et elementum neque pretium a. Nulla facilisi. Ut ullamcorper tempor leo, in gravida ligula massa nunc. ', 'true'),
    ('demo', '12:31:20', 'This is some top notch work Comrade Carl. You’re hired! 🫡', 'false'),
    ('demo', '11:59:44', 'Integer cursus facilisis egestas. In tincidunt turpis quis massa fermentum, eu sodales ex tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed augue nunc. Nullam arcu diam, malesuada ac ex sit amet, efficitur tincidunt nulla.', 'true'),
    ('demo', '00:50:52', 'Etiam ac ligula nisl. Donec volutpat lobortis dui, et viverra tortor ornare quis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean porta ut urna id dapibus. Vestibulum vulputate sodales sed. ', 'true'),
    ('demo', '00:55:23', 'Donec nisl nulla, sodales vel ornare vel, mattis et est. Sed nec justo lobortis, blandit orci id, iaculis velit. Etiam ut ultrices enim. Etiam faucibus vehicula ultricies. Nulla neque ex, tristique vel pulvinar id, fringilla at risus augue.', 'true'),
    ('demo', '00:39:39', 'Duis justo justo, faucibus eu sodales nec, dictum nec risus. Quisque vitae ultrices mi. Maecenas risus purus, pretium ut suscipit non, varius a justo. Aliquam porta sodales eros vel fringilla. Proin eu neque non nulla gravida elementum sit.', 'true'),
    ('demo', '00:44:43', 'Sollicitudin cursus rhoncus. Etiam convallis vehicula cursus. Nunc dictum dolor vel purus faucibus convallis. Nam condimentum lacinia mi, at sodales nulla tempor at. Duis dignissim, lectus et malesuada malesuada, est orci aliquam tortor. ', 'true'),
    ('demo', '12:04:54', 'Ut ut laoreet dolor, a tempus orci. In at viverra tortor, a sodales sapien. Maecenas leo felis, gravida eu diam at, efficitur pretium lectus. Mauris elementum enim at lorem bibendum facilisis. Donec maximus tortor ut sem sollicitudin ultricies et at.', 'false'),
    ('demo', '12:16:26', 'Cras arcu libero, vestibulum eu lacinia a, rutrum nec quam. Sed a finibus orci, quis laoreet eros. Integer malesuada nisl libero, a lobortis turpis scelerisque at. Curabitur nunc libero, auctor vitae massa eu, volutpat vehicula quam. Sed a tellus in.', 'true'),
    ('demo', '22:06:00', 'Test 12345', 'true');



--  Local variables:
--  coding: utf-8
--  mode: sql
--  End:
--  vim: fileencoding=utf-8 filetype=sql :
