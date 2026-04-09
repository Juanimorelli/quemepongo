--
-- PostgreSQL database dump
--

\restrict dAB8uabfgyCGHYwHEWBljwELqU9kLQvFVLGY43b27cfBjc1WCOwpuIkb2XkIuDs

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: u0_a424
--

CREATE TABLE public.feedback (
    id integer NOT NULL,
    prenda_id character varying,
    puntuacion integer
);


ALTER TABLE public.feedback OWNER TO u0_a424;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a424
--

CREATE SEQUENCE public.feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feedback_id_seq OWNER TO u0_a424;

--
-- Name: feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a424
--

ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;


--
-- Name: moda_vigente; Type: TABLE; Schema: public; Owner: u0_a424
--

CREATE TABLE public.moda_vigente (
    id integer NOT NULL,
    estilo character varying,
    paleta_colores character varying[],
    prendas_clave character varying[]
);


ALTER TABLE public.moda_vigente OWNER TO u0_a424;

--
-- Name: moda_vigente_id_seq; Type: SEQUENCE; Schema: public; Owner: u0_a424
--

CREATE SEQUENCE public.moda_vigente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.moda_vigente_id_seq OWNER TO u0_a424;

--
-- Name: moda_vigente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: u0_a424
--

ALTER SEQUENCE public.moda_vigente_id_seq OWNED BY public.moda_vigente.id;


--
-- Name: prendas; Type: TABLE; Schema: public; Owner: u0_a424
--

CREATE TABLE public.prendas (
    id character varying NOT NULL,
    user_id character varying,
    categoria character varying,
    color_hex character varying,
    formalidad integer,
    ultima_vez_usado timestamp without time zone,
    es_favorito boolean
);


ALTER TABLE public.prendas OWNER TO u0_a424;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: u0_a424
--

CREATE TABLE public.usuarios (
    id character varying NOT NULL,
    email character varying,
    preferencias_estilo json
);


ALTER TABLE public.usuarios OWNER TO u0_a424;

--
-- Name: feedback id; Type: DEFAULT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);


--
-- Name: moda_vigente id; Type: DEFAULT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.moda_vigente ALTER COLUMN id SET DEFAULT nextval('public.moda_vigente_id_seq'::regclass);


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: u0_a424
--

COPY public.feedback (id, prenda_id, puntuacion) FROM stdin;
\.


--
-- Data for Name: moda_vigente; Type: TABLE DATA; Schema: public; Owner: u0_a424
--

COPY public.moda_vigente (id, estilo, paleta_colores, prendas_clave) FROM stdin;
1	Urbano Contemporáneo	{#4A5568,#2D3748,#E53E3E}	{"Pantalón Cargo","Campera Bomber","Zapatillas de Cuero"}
\.


--
-- Data for Name: prendas; Type: TABLE DATA; Schema: public; Owner: u0_a424
--

COPY public.prendas (id, user_id, categoria, color_hex, formalidad, ultima_vez_usado, es_favorito) FROM stdin;
343aa623-90b0-422c-97b5-8de2f6c66d5e	jimorelli	Chomba	#007BFF	5	2026-04-06 03:38:22.688713	t
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: u0_a424
--

COPY public.usuarios (id, email, preferencias_estilo) FROM stdin;
jimorelli	emilio@ejemplo.com	{}
\.


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a424
--

SELECT pg_catalog.setval('public.feedback_id_seq', 1, false);


--
-- Name: moda_vigente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: u0_a424
--

SELECT pg_catalog.setval('public.moda_vigente_id_seq', 1, true);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: moda_vigente moda_vigente_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.moda_vigente
    ADD CONSTRAINT moda_vigente_pkey PRIMARY KEY (id);


--
-- Name: prendas prendas_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.prendas
    ADD CONSTRAINT prendas_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_prenda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_prenda_id_fkey FOREIGN KEY (prenda_id) REFERENCES public.prendas(id);


--
-- Name: prendas prendas_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u0_a424
--

ALTER TABLE ONLY public.prendas
    ADD CONSTRAINT prendas_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

\unrestrict dAB8uabfgyCGHYwHEWBljwELqU9kLQvFVLGY43b27cfBjc1WCOwpuIkb2XkIuDs

