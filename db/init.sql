CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE role AS ENUM (
    'mentor',
    'mentee'
);

CREATE TABLE public.users (
    id bigint GENERATED ALWAYS AS identity,
    email character varying(100) NOT NULL,
    name text NOT NULL,
    role public.role NOT NULL,
    password text NOT NULL
);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);