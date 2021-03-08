--------------------
-- Users
--------------------

CREATE TABLE "users" (
    "id" character varying(40) NOT NULL,
    "username" character varying(40) NOT NULL,
    "password" character varying(80) NOT NULL,
    "rootperson" character varying(40) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE INDEX "users_username" ON "users" ("username");

--------------------
-- Auth Tokens
--------------------

CREATE TABLE "auth" (
    "token" character varying(40) NOT NULL,
    "userid" character varying(40) NOT NULL,
    "timestamp" timestamp default current_timestamp,
    PRIMARY KEY ("token")
);

CREATE INDEX "auth_token" ON "auth" ("token");

--------------------
-- netapp database
--------------------

CREATE DATABASE test WITH TEMPLATE netapp;