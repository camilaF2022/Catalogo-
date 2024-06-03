# Catalogo de piezas arqueológicas
El propósito de este proyecto es diseñar e implementar un sistema de catálogo digital que permita visualizar, registrar, modificar y buscar rápidamente piezas arqueológicas junto con sus datos asociados, tales como imágenes, modelos 3D, etiquetas y descripciones textuales. Este sistema será fundamental para que los funcionarios del Museo de Arte Popular Americano Tomás Lago (MAPA) accedan a la información de la colección de piezas arqueológicas de manera intuitiva y amigable.

## Ejecución
El proyecto utiliza React para el frontend y Django para el backend. Para ejecutar el proyecto, primero se deben instalar las dependencias de ambos componentes.

### Frontend
Para comenzar, se deben instalar los paquetes ejecutando el siguiente comando en la carpeta `frontend`:

```bash
npm install
```
Luego, para ejecutar el frontend, se debe ejecutar el siguiente comando en la carpeta `frontend`:

```bash
npm start
```
### Backend
#### Configuración del Entorno

Es necesario crear un ambiente virtual con los paquetes que están en `backend/requirements.txt`. La creación y activación de un ambiente virtual varía según el sistema operativo:

**Windows:**

1. Abra la línea de comandos (Command Prompt).
2. Navegue a la carpeta del proyecto backend.
3. Ejecute los siguientes comandos:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/macOS:**
1. Abra la terminal.
2. Navegue a la carpeta del proyecto backend.
3. Ejecute los siguientes comandos:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Subir contenido al backend

Antes de subir el contenido de prueba proveniente de Google Drive, se debe generar el esquema de la base de datos. Esto se realiza ejecutando el siguiente comando desde la carpeta que contiene `manage.py`, es decir, en la ruta `backend/catalogo_arqueologico`:

```bash
python manage.py migrate
```

Los archivos a cargar deben estar ubicados en un lugar específico. La estructura de carpetas debe ser la siguiente:

```
CATALOGO
├── backend
│   └── catalogo_arquelogico
│       └── multimedia
└── data
    ├── CH_tags.csv
    ├── clasificacion-forma
    ├── coleccion-cultura.csv
    ├── complete-dataset
    ├── metadata - descripcion.csv
    └── thumbnails
```
Notar que la carpeta `multimedia` debe estar en una ubicación distinta.

Finalmente, desde la carpeta `backend/catalogo_arqueologico`, se debe ejecutar el siguiente comando:

```bash
python manage.py importAllData
```

Si se desea volver a cargar la base de datos, se deben eliminar los archivos `db.sqlite3` de la carpeta `backend/catalogo_arqueologico`, `0001_initial.py` de la carpeta `backend/catalogo_arqueologico/piezas/migrations` y el contenido de la carpeta media ubicada en `backend/catalogo_arqueologico/media`. Luego, ubicado en la carpeta contenedora de `manage.py`, se debe ejecutar el comando `python manage.py makemigrations` seguido de `python manage.py migrate` y los comandos de importación de datos.

#### Creación de superusuario
Para crear un superusuario, se debe ejecutar el siguiente comando desde la carpeta que contiene `manage.py`, es decir, en la ruta `backend/catalogo_arqueologico`:

```bash
python manage.py createsuperuser
```

Luego, se deben seguir las instrucciones que se presentan en la terminal.

#### Ejecución del backend
Desde la carpeta `backend/catalogo_arqueologico`, ejecutar el siguiente comando:

```bash
python manage.py runserver
```