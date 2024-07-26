//BACKUP SCRIPT WINDOWS (.BAT)
const dataBackup = (fecha) => {
  const data = `@echo off
SET PG_HOST=${process.env.PGHOST}
SET PG_PORT=${process.env.PGPORT}
SET PG_DATABASE=${process.env.PGDATABASE}
SET PG_USER=${process.env.PGUSER}
SET PGPASSWORD=${process.env.PGPASSWORD}
SET PG_BIN="${process.env.RUTA}\\15\\bin\\pg_dump.exe"
SET PG_FILENAME="%cd%\\backups\\BACKUP_${fecha}.backup"
%PG_BIN% -h %PG_HOST% -p %PG_PORT% -U %PG_USER% --format custom -b -f %PG_FILENAME% %PG_DATABASE%`;
  return data;
};

//BACKUP SCRIPT LINUX (.SH)
const dataBackupLinux = (fecha) => {
  const data = `#!/bin/bash
PG_HOST=${process.env.PGHOST}
PG_PORT=${process.env.PGPORT}
PG_DATABASE=${process.env.PGDATABASE}
PG_USER=${process.env.PGUSER}
export PGPASSWORD=${process.env.PGPASSWORD}
PG_FILENAME=./backups/BACKUP_${fecha}.backup
pg_dump -h $PG_HOST -p $PG_PORT -U $PG_USER --format custom -b -f $PG_FILENAME $PG_DATABASE`;
  return data;
};

//RESTORE SCRIPT WINDOWS
const dataRestore = (backup) => {
  const data = `@echo off
SET PG_HOST=${process.env.PGHOST}
SET PG_PORT=${process.env.PGPORT}
SET PG_DATABASE=${process.env.PGDATABASE}
SET PG_USER=${process.env.PGUSER}
SET PGPASSWORD=${process.env.PGPASSWORD}
SET PG_BIN="${process.env.RUTA}\\15\\bin\\dropdb.exe"
SET PG_FILENAME="%cd%\\backups\\${backup}"
%PG_BIN% -h %PG_HOST% -p %PG_PORT% -U %PG_USER% --force %PG_DATABASE%
SET PG_BIN="${process.env.RUTA}\\15\\bin\\createdb.exe"
%PG_BIN% -h %PG_HOST% -p %PG_PORT% -U %PG_USER% %PG_DATABASE%
SET PG_BIN="${process.env.RUTA}\\15\\bin\\pg_restore.exe"
%PG_BIN% -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% %PG_FILENAME%`;
  return data;
};

//RESTORE SCRIPT LINUX
const dataRestoreLinux = (backup) => {
  const data = `#!/bin/bash
PG_HOST=${process.env.PGHOST}
PG_PORT=${process.env.PGPORT}
PG_DATABASE=${process.env.PGDATABASE}
PG_USER=${process.env.PGUSER}
export PGPASSWORD=${process.env.PGPASSWORD}
PG_FILENAME=./backups/${backup}
dropdb -h $PG_HOST -p $PG_PORT -U $PG_USER --force $PG_DATABASE
createdb -h $PG_HOST -p $PG_PORT -U $PG_USER $PG_DATABASE
pg_restore -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DATABASE $PG_FILENAME`;
  return data;
};

module.exports = {
  dataBackup,
  dataRestore,
  dataBackupLinux,
  dataRestoreLinux,
};
