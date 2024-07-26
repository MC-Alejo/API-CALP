const fs = require("fs");
const { spawn } = require("child_process");
const {
  dataBackup,
  dataRestore,
  dataBackupLinux,
  dataRestoreLinux,
} = require("../models/scripts");

//escribo el script..
const escribirScriptBackups = (fecha, os) => {
  if (os === "win32") {
    const data = dataBackup(fecha);
    fs.writeFile("./scripts/backups.bat", data, (error) => {
      if (error) throw error;
    });

    return null;
  }

  const data = dataBackupLinux(fecha);
  fs.writeFile("./scripts/backups.sh", data, (error) => {
    if (error) throw error;
  });
};

const escribirScriptRestores = (backup, os) => {
  if (os === "win32") {
    const data = dataRestore(backup);
    fs.writeFile("./scripts/restores.bat", data, (error) => {
      //if (error) throw error;
    });

    return null;
  }

  const data = dataRestoreLinux(backup);
  fs.writeFile("./scripts/restores.sh", data, (error) => {
    //if (error) throw error;
  });
};

const ejecutarScriptBackups = (os) => {
  //ejecutar script windows
  if (os === "win32") {
    const child = spawn("cmd.exe", ["/c", "%cd%\\scripts\\backups.bat"]);

    child.stdout.on("data", (data) => {});

    child.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });

    return null;
  }

  //ejecutar script linux
  ruta = "./scripts/backups.sh";
  //doy permisos al script (solo al dueño) y si sale todo bien lo ejecuto
  const chmod = spawn("chmod", ["700", ruta]);

  chmod.on("close", (code) => {
    console.log(`chmod process exited with code ${code}`);

    if (code === 0) {
      const shScript = spawn("sh", [ruta]);

      shScript.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      shScript.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
      });

      shScript.on("close", (code) => {
        console.log(`script process exited with code ${code}`);
      });
    }
  });
};

const ejecutarScriptRestores = (os) => {
  //ejecutar script windows
  if (os === "win32") {
    const child = spawn("cmd.exe", ["/c", "%cd%\\scripts\\restores.bat"]);

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });

    return null;
  }

  //ejecutar script linux
  ruta = "./scripts/restores.sh";
  //doy permisos al script (solo al dueño) y si sale todo bien lo ejecuto
  const chmod = spawn("chmod", ["700", ruta]);

  chmod.on("close", (code) => {
    console.log(`chmod process exited with code ${code}`);

    if (code === 0) {
      const shScript = spawn("sh", [ruta]);

      shScript.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      shScript.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
      });

      shScript.on("close", (code) => {
        console.log(`script process exited with code ${code}`);
      });
    }
  });
};

module.exports = {
  ejecutarScriptBackups,
  ejecutarScriptRestores,
  escribirScriptBackups,
  escribirScriptRestores,
};
