CREATE DATABASE siteviewer;

\c siteviewer

create table IF NOT EXISTS site (
  id SERIAL PRIMARY KEY,
  qr_relative varchar(255),
  model BYTEA,
);
