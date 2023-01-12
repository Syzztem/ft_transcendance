CREATE TABLE "User"
(
 "id"       bigserial NOT NULL,
 username varchar(8) NOT NULL,
 email    varchar(254) NOT NULL,
 "rank"     int NOT NULL,
 "token"    char(50) NOT NULL,
 wins     int NOT NULL,
 losses   int NOT NULL,
 level    int NOT NULL,
 CONSTRAINT PK_username PRIMARY KEY ( "id" )
);

CREATE TABLE friendship
(
 "id"    bigserial NOT NULL,
 user1 bigint NOT NULL,
 user2 bigint NOT NULL,
 CONSTRAINT PK_friendship PRIMARY KEY ( "id" ),
 CONSTRAINT FK_1 FOREIGN KEY ( user1 ) REFERENCES "User" ( "id" ),
 CONSTRAINT FK_2 FOREIGN KEY ( user2 ) REFERENCES "User" ( "id" )
);

CREATE INDEX FK_U1 ON friendship
(
 user1
);

CREATE INDEX FK_U2 ON friendship
(
 user2
);

CREATE TABLE friend_message
(
 "id"            bigserial NOT NULL,
 friendship_id bigint NOT NULL,
 content       text NOT NULL,
 "timestamp"     timestamp NOT NULL,
 CONSTRAINT PK_friendmsg PRIMARY KEY ( "id" ),
 CONSTRAINT FK_10 FOREIGN KEY ( friendship_id ) REFERENCES friendship ( "id" )
);

CREATE INDEX FK_friendship ON friend_message
(
 friendship_id
);

CREATE TABLE Game
(
 "id"           int NOT NULL,
 player1      bigint NOT NULL,
 player2      bigint NOT NULL,
 player1score int NOT NULL,
 player2score int NOT NULL,
 "timestamp"    timestamp NOT NULL,
 CONSTRAINT PK_game PRIMARY KEY ( "id" ),
 CONSTRAINT FK_3 FOREIGN KEY ( player1 ) REFERENCES "User" ( "id" ),
 CONSTRAINT FK_4 FOREIGN KEY ( player2 ) REFERENCES "User" ( "id" )
);

CREATE INDEX FK_p1 ON Game
(
 player1
);

CREATE INDEX FK_p2 ON Game
(
 player2
);


CREATE TABLE Channel
(
 "id"    bigserial NOT NULL,
 admin bigint NOT NULL,
 CONSTRAINT PK_chan PRIMARY KEY ( "id" ),
 CONSTRAINT FK_6 FOREIGN KEY ( admin ) REFERENCES "User" ( "id" )
);

CREATE INDEX FK_admin ON Channel
(
 admin
);

CREATE TABLE channel_message
(
 "id"        bigserial NOT NULL,
 channel   bigint NOT NULL,
 sender    bigint NOT NULL,
 content   text NOT NULL,
 "timestamp" timestamp NOT NULL,
 CONSTRAINT PK_1 PRIMARY KEY ( "id" ),
 CONSTRAINT FK_5 FOREIGN KEY ( sender ) REFERENCES "User" ( "id" ),
 CONSTRAINT FK_7 FOREIGN KEY ( channel ) REFERENCES Channel ( "id" )
);

CREATE INDEX FK_2 ON channel_message
(
 sender
);

CREATE INDEX FK_3 ON channel_message
(
 channel
);

CREATE TABLE channel_user
(
 "id"      bigserial NOT NULL,
 "user"    bigint NOT NULL,
 channel bigint NOT NULL,
 CONSTRAINT PK_chanusr PRIMARY KEY ( "id" ),
 CONSTRAINT FK_9 FOREIGN KEY ( channel ) REFERENCES Channel ( "id" ),
 CONSTRAINT FK_8 FOREIGN KEY ( "user" ) REFERENCES "User" ( "id" )
);

CREATE INDEX FK_channel ON channel_user
(
 channel
);

CREATE INDEX FK_usr ON channel_user
(
 "user"
);
