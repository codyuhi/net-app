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
-- netapp database
--------------------

CREATE DATABASE test WITH TEMPLATE netapp;