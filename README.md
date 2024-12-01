# API CALP V2.0

La API CALP V2.0 es una API construida con Node.js que ofrece funcionalidades para la gestion de tareas, solicitudes, usuarios y areas del taller de mantenimiento de la cooperativa CALP. Este documento proporciona una guía paso a paso para configurar y ejecutar la API en tu entorno local.

## Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y uso](#instalación)
   - [Paso 1: clonar el repositorio](#paso-1-clonar-el-repositorio)
   - [Paso 2: instalar las dependencias](#paso-2-instalar-las-dependencias)
   - [Paso 3: configurar las variables de entorno](#paso-3-configurar-las-variables-de-entorno)
   - [Paso 4: iniciar el servidor](#paso-4-iniciar-el-servidor)
3. [Endpoints](#endpoints)
4. [Historial de Cambios](CHANGELOG.md)

## Requisitos Previos

Asegúrate de tener los siguientes elementos antes de comenzar:

- [**Node.js**](https://nodejs.org/) (versión 18 o superior)
- [**PostgreSQL**](https://www.postgresql.org/)

> **Nota:** CALP-DBvx.x.x.sql contiene las definiciones de las tablas y datos iniciales. Debes cargar este archivo en tu motor de base de datos. Puedes utilizar y probar cualquier motor de base de datos, pero se recomienda utilizar PostgreSQL, ya que las tablas y configuraciones fueron creadas y probadas en este motor.

## Instalación y uso

### Paso 1: clonar el repositorio

Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/MC-Alejo/API-CALP.git
```

### Paso 2: instalar las dependencias

Navega a la carpeta del proyecto (directorio _raíz_) utilizando una terminal y ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

### Paso 3: configurar las variables de entorno

Crea un archivo `.env` en el directorio _raíz_ del proyecto y agrega las variables de entorno tal cual como se muestra en el archivo example.env.

### Paso 4: iniciar el servidor

Una vez configuradas las variables de entorno, puedes iniciar el servidor que hospeda la API ejecutando el siguiente comando en el directorio raíz del proyecto:

```bash
npm run start
```

## Endpoints

Puedes encontrar los endpoints disponibles de la API en el archivo [`API CALP v2.2.5.pdf`](https://github.com/MC-Alejo/API-CALP/blob/main/API%20CALP%20v2.2.5.pdf)

## Historial de Cambios

Para ver el historial de cambios, consulta el archivo [CHANGELOG.md](CHANGELOG.md).
