//Aceleración del proceso TTL

const ttl = 86400;

//Reducir el TTL (time to live).

async function actualizarTTL(dnsRecordsId, nuevoTTL) {
    const url = `https://alcaidiarafaela.github.io/SistemaConteoDigital/${dnsRecordId}`;
    const token = 'tu_token_de_autenticación'; // Debes poner tu token de acceso o credenciales

    const  headers = {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`,
    };

    const data = {
        ttl: nuevoTTL, //aca va el nuevo TTL (en segundos)
    };

    try {
        const response = await fetch (url, {
            method: 'PUT',
            headers: headers, 
            body: JSON.stringify(data),
        });

        if (!response.ok){
            throw new Error (`Error al actualizar el TTL: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('TTL actualizado con exito:', result);
    } catch (error) {
        console.log('Error al actualizar el TTL:', error);
    }
}

//llamada a la funcion para actualizar el TTL a 2 horas (7200 segundos)
actualizarTTL('id_del_registro_dns', 7200);
