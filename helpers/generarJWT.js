const jwt = require('jsonwebtoken');


const generarJWT = ( id = '' ) => {
    
        return new Promise( (resolve, reject) => {
    
            const payload = { id };
            
            //sing es para firmar el token
            // la funcion pide el payload, la clave secreta y la expiracion
            // el payload es lo que se va a guardar en el token
            // la clave secreta o llave, es la que se usa para firmar el token, esta es muy importante y nadie debe saberla porque sino pueden falsificar tokens
            jwt.sign( payload, process.env.PRIVATEKEY, (err, token) => {
    
                if ( err ) {
                    console.log(err);
                    reject('No se pudo generar el JWT');
                } else {
                    resolve( token );
                }
    
            })
    
        });
}



module.exports = {
    generarJWT,
}