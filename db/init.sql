CREATE DATABASE siteviewer;

\c siteviewer

create table IF NOT EXISTS model (
  id SERIAL PRIMARY KEY,
  qr_relative varchar(255),
  model BYTEA,
);

  create table IF NOT EXISTS site (
  id SERIAL PRIMARY KEY,
  title varchar(255)
  model_id integer REFERENCES model
);
