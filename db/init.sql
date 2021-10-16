CREATE DATABASE siteviewer;

\c siteviewer

create table site (
  id SERIAL PRIMARY KEY,
  qr_relative varchar(255),
  model varchar(255),
);
