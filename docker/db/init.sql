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
-- Persons
--------------------

CREATE TABLE "persons" (
    "id" character varying(40) NOT NULL,
    "rootperson" boolean NOT NULL,
    "firstname" character varying(40) NOT NULL,
    "lastname" character varying(40) NOT NULL,
    "organizationid" character varying (40),
    "positionid" character varying(40),
    "network" TEXT [],
    "daterequested" timestamp default current_timestamp,
    "datecontacted" timestamp default current_timestamp,
    "replied" boolean,
    "description" character varying(40)
);

CREATE INDEX "personid" ON "persons" ("id");

--------------------
-- Organizations
--------------------

CREATE TABLE "organizations" (
    "id" character varying(40) NOT NULL,
    "name" character varying(40) NOT NULL,
    "locations" json [],
    "positions" json [],
    "rating" integer,
    "description" character varying(40)
);

CREATE INDEX "organizationid" ON "organizations" ("id");

--------------------
-- netapp database
--------------------

CREATE DATABASE test WITH TEMPLATE netapp;