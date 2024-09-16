--CONFIGS POR DEFECTO DEL BACKUP
-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- SET default_tablespace = '';

-- SET default_table_access_method = heap;

-- --
-- -- TOC entry 214 (class 1259 OID 16540)
-- -- Name: alarma; Type: TABLE; Schema: public; Owner: postgres
-- --


CREATE TABLE usuario
(
    id uuid PRIMARY KEY UNIQUE NOT NULL,
    nombre VARCHAR(46),
    apellido VARCHAR(46),
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE gerente
(
    id_usuario uuid PRIMARY KEY NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE area
(
    id SERIAL PRIMARY KEY NOT NULL,
    -- el tipo serial es para realizar autoincrementos integer
    nombre VARCHAR(65) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE encargado_area
(
    id_usuario uuid PRIMARY KEY NOT NULL,
    id_area integer,
    --no le ponemos not null porque es necesario saber si dicho empleado tiene un area a cargo o por alguna razon ya no

    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_area) REFERENCES area(id)
);

CREATE TABLE responsable
(
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    nombre character varying(65) NOT NULL,
    telefono VARCHAR UNIQUE NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE sector
(
    id SERIAL PRIMARY KEY NOT NULL,
    nombre character varying(65) NOT NULL,
    id_area integer NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (id_area) REFERENCES area(id)
);

CREATE TABLE equipamiento
(
    id SERIAL PRIMARY KEY NOT NULL,
    nombre character varying(65) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    id_sector integer NOT NULL,

    FOREIGN KEY (id_sector) REFERENCES sector(id)
);

CREATE TABLE deposito
(
    id SERIAL PRIMARY KEY NOT NULL,
    nombre character varying(65) NOT NULL
);

CREATE TABLE jefe_mantenimiento
(
    -- como hay dos jefes de mantenimiento tiene un deposito a cargo en su sector entonces de ahi proviene
    id_usuario uuid PRIMARY KEY NOT NULL,
    id_deposito integer,
    --no le ponemos not null porque es necesario saber si dicho empleado tiene un area a cargo o por alguna razon ya no

    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_deposito) REFERENCES deposito(id)
);

CREATE TABLE inventario
(
    id SERIAL PRIMARY KEY NOT NULL,
    nombre character varying(65) UNIQUE NOT NULL,
    stock integer NOT NULL,
    id_deposito integer NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (id_deposito) REFERENCES deposito(id)
);

CREATE TABLE solicitud
(
    id SERIAL PRIMARY KEY NOT NULL,
    estado character varying(15) NOT NULL,
    -- puede ser pendiente, aceptada o rechazada
    fecha TIMESTAMPTZ NOT NULL ,
    descripcion character varying(250) NOT NULL,
    id_equipamiento integer NOT NULL, --//EL EQUIPAMIENTO ES OBLIGATORIO
    id_usuario uuid NOT NULL,
    id_juez uuid,
    -- id que es el que acepta o no una solicitud
    FOREIGN KEY (id_equipamiento) REFERENCES equipamiento(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_juez) REFERENCES usuario(id)
);

CREATE TABLE tarea
(
    id SERIAL PRIMARY KEY NOT NULL,
    estado character varying(15) NOT NULL,
    -- el estado varia en: en curso y finalizada
    fecha TIMESTAMPTZ NOT NULL,
    fechaCumplimiento TIMESTAMPTZ,
    descripcion character varying(250),
    prioridad integer,
    id_solicitud integer NOT NULL,
    id_responsable integer NOT NULL,
    --
    FOREIGN KEY (id_solicitud) REFERENCES solicitud(id),
    FOREIGN KEY (id_responsable) REFERENCES responsable(id)
);

CREATE TABLE inv_tar
(
    id_inventario integer NOT NULL,
    id_tarea integer NOT NULL,
    cantidad_usada integer NOT NULL,

    PRIMARY KEY (id_inventario, id_tarea),
    FOREIGN KEY (id_inventario) REFERENCES inventario(id),
    FOREIGN KEY (id_tarea) REFERENCES tarea(id)
);

------USO DE INDICES PARA OPTIMIZAR CONSULTAS
CREATE INDEX idx_usuario_estado ON usuario(estado);
CREATE INDEX idx_encargado_area_id_area ON encargado_area(id_area);
CREATE INDEX idx_jefe_mantenimiento_id_deposito ON jefe_mantenimiento(id_deposito);

CREATE INDEX idx_area_nombre ON area(nombre);
CREATE INDEX idx_area_estado ON area(estado);

CREATE INDEX idx_deposito_nombre ON deposito(nombre);

CREATE INDEX idx_inventario_id_deposito ON inventario(id_deposito);

CREATE INDEX idx_sector_estado ON sector(estado);
CREATE INDEX idx_sector_id_area ON sector(id_area);

CREATE INDEX idx_responsable_estado ON responsable(estado);

CREATE INDEX idx_equipamiento_estado ON equipamiento(estado);
CREATE INDEX idx_equipamiento_id_sector ON equipamiento(id_sector);

CREATE INDEX idx_solicitud_estado ON solicitud(estado);
CREATE INDEX idx_solicitud_id_equipamiento ON solicitud(id_equipamiento);
CREATE INDEX idx_solicitud_id_usuario ON solicitud(id_usuario);
CREATE INDEX idx_solicitud_id_juez ON solicitud(id_juez);

CREATE INDEX idx_tarea_fecha ON tarea(fecha);
CREATE INDEX idx_tarea_estado ON tarea(estado);
CREATE INDEX idx_tarea_prioridad ON tarea(prioridad);
CREATE INDEX idx_tarea_id_solicitud ON tarea(id_solicitud);
CREATE INDEX idx_tarea_id_responsable ON tarea(id_responsable);


------INSERTS
INSERT INTO usuario (id, nombre, apellido, email, password, estado) VALUES ('4b65e372-c063-4358-8771-8ba1b5648a33', 'Admin', 'Minad', 'dev-calp@calp.com', '$2a$10$slnHEuXgV/MaCMZk6DX/W.U0J7fWMBMqCSOQzgzZWJClTnR4gRdKG', true);

INSERT INTO gerente (id_usuario) VALUES ('4b65e372-c063-4358-8771-8ba1b5648a33');