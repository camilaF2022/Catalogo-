# Catalogo de piezas arqueológicas
El propósito de este proyecto es diseñar e implementar un sistema de catálogo digital que permita visualizar, registrar, modificar y buscar rápidamente piezas arqueológicas junto con sus datos asociados, como imágenes, modelos 3D, etiquetas y descripciones textuales. Este sistema será fundamental para acceder a la información de la colección de piezas arqueológicas de manera intuitiva y amigable para los funcionarios del museo MAPA (Museo de Arte Popular Americano Tomás Lago).

## Ejecución
### Frontend

El proyecto usa React para el frontend y Django para el backend. Para ejecutar el proyecto, primero se debe instalar las dependencias de ambos proyectos. Para ello, se debe ejecutar el siguiente comando en la carpeta `catalogo-arqueologico`:
``` 
npm install
```
Luego, para ejecutar el frontend, se debe ejecutar el siguiente comando en la carpeta `catalogo-arqueologico`:
```
npm start
```
### Backend
#### Enviroment setup
Es necesario crearse un ambiente virtual con los paquetes que estan en "backend/requirements.txt". Crear un ambiente virtual es disintos por sistema operativo:
Windows:
```
py -m venv myworld
```

Unix/MacOS:
```
python -m venv myworld
```

Para activarlo hay que estar al mismo nivel que la carpeta creada para el ambiente y sería de la siguiente manera:

Windows:
```
myworld/Scripts/activate
```

Unix/MacOS:
```
source myworld/bin/activate
```
Una vez que es activado, se verá un "(myworld) C: ..." en la consola para Windows y "(myworld) ... $" para Unix/MacOS.

Finalmente, para instalar las dependencias utilizar el siguiente comando, estando en el mismo nivel que el "requirements.txt":
```
pip install -r requirements.txt
```
### Subir  data a backend
Para subir datos al backend, se debe correr los siguientes comandos en la carpeta `backend/catalogo-arquelogico`:  
```python 
#  Para  generar  el esquema de la base de datos: 
python manage.py migrate
```
Para subir los datos de prueba al backend, generar un archivo con la misma estructura que los datos entregados en el drive. A modo de ejemplo a nivel de repositorio  agregar la carpeta "data" con la siguiente estructura: 
```
Repo/
    /Catalogo
    /data
        /clasificacion-forma
        /complete-dataset
        /thumbnails
        /CH_tags.csv
        /coleccion-cultura.csv
        /metadata-descripcion.csv
```
Añadir la carpeta multimedia en backend/catalogo-arqueologico/ , con los archivos  como se encuentran en el drive:
```
Repo/
    /Catalogo
    /backend
        /catalogo-arqueologico
            /multimedia
                /0027
                /0028
                ...
```
Ejecutar los  commandos en el siguiente orden:
```python
python manage.py  importCulture  ../../../data/coleccion-cultura.csv 
python manage.py  importModel3D  ../../../data/complete-dataset/
python manage.py  importShape  ../../../data/clasificacion-forma/botella.txt
python manage.py  importShape  ../../../data/clasificacion-forma/cantaro.txt
python manage.py  importShape  ../../../data/clasificacion-forma/cuenco.txt
python manage.py  importShape  ../../../data/clasificacion-forma/figurina.txt
python manage.py  importShape  ../../../data/clasificacion-forma/lebrillo.txt
python manage.py  importShape  ../../../data/clasificacion-forma/olla.txt
python manage.py  importShape  ../../../data/clasificacion-forma/plato.txt
python manage.py  importShape  ../../../data/clasificacion-forma/vaso.txt
python manage.py  importTags  ../../../data/CH_tags.csv 
python manage.py  importThumbs  ../../../data/thumbnails 
python manage.py  importDescriptions  ../../../data/metadata-descripcion.csv 
```
#### Run server
Para correr el backend, correr esto (estando al mismo nivel que manage.py):
```
python manage.py runserver
```
* No subir el ambiente al repo, ignorarlo.