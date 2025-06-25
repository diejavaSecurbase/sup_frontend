# Portal de clientes

## Paso 1: Levantar frontend

### Requerimientos frontend

- Instalar NPM 

- Instalar Node.js (Node.js 10 en adelante)

- Instalar NPM (Viene instalado por defecto con Node.js)

### Pasos a seguir frontend

- Pararse en la carpeta raiz del proyecto

- Ejecutar este comando desde una terminal: **npm i**. Este comando instala todas las dependencias necesarias para que el proyecto funcione correctamente.

- Una vez hecho todos estos pasos, es posible levantar el front-end con el comando: **ng serve --open**. Se abrira su navegador por defecto con la aplicacion corriendo.



## Git flow 

- Al tener asignado un ticket crear un branch a partir de master. Este se deberá llamar con el nombre del ticket. Ejemplo: BA-123.

- Una vez finalizada la implementación del ticket, se debera commitear los cambios en la misma rama.

- Cambiarse a la rama develop y mergear esa rama que hemos creado para dicho ticket.

- Por último, pushear.

### Ejemplo

Situado en la branch del ticket listo para pushear

~~~git

git add .

git commit -m "Cambios a desarrollo..."

git checkout develop

git pull

git merge BA-123 -m "Merge BA-123 a develop"

git push

~~~


### URLs:

- TESTING: https://portal-clientes-tst.gscorp.ad/

- PRODUCCIÓN: https://portal-clientes.gscorp.ad/