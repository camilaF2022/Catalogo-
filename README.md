# Catalogo de piezas arqueológicas
El propósito de este proyecto es diseñar e implementar un sistema de catálogo digital que permita visualizar, registrar, modificar y buscar rápidamente piezas arqueológicas junto con sus datos asociados, tales como imágenes, modelos 3D, etiquetas y descripciones textuales. Este sistema será fundamental para que los funcionarios del Museo de Arte Popular Americano Tomás Lago (MAPA) accedan a la información de la colección de piezas arqueológicas de manera intuitiva y amigable.

## Requisitos
Para ejecutar la aplicación en un ambiente de desarrollo, se debe tener:
* Python 3.8 o superior

Para ejecutar la aplicación en un ambiente de producción, se deben tener:
* Docker Desktop
* Docker Compose

## Importar contenido
Para subir contenido de forma masiva, el primer paso es ubicar los archivos de la siguiente forma:

```
CATALOGO
├── nginx
├── backend
├── frontend
└── data
    ├── CH_tags.csv
    ├── clasificacion-forma
    ├── coleccion-cultura.csv
    ├── complete-dataset
    ├── metadata - descripcion.csv
    ├── institutions.csv
    ├── multimedia
    └── thumbnails
```

Dependiendo del ambiente de ejecución se deberá ejecutar un comando distinto para cargar el contenido.

## Configurar ambiente de desarrollo
### 1. Frontend
Para comenzar, se deben instalar los paquetes ejecutando el siguiente comando en la carpeta `frontend`:

```bash
npm install
```

#### Ejecución del frontend
Para ejecutar el frontend, se debe ejecutar el siguiente comando en la carpeta `frontend`:

```bash
npm start
```
### 2. Backend
#### Configuración del entorno

La aplicación utiliza el paquete `django-environ` para la configuración del entorno. Para ello, se debe crear un archivo `.env` en la carpeta `backend/catalogo_arqueologico` con las siguientes variables de entorno:

```bash
DEBUG=True
SECRET_KEY=django-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost,0.0.0.0

CORS_ALLOW_ALL_ORIGINS=True
```

Se recomienda el uso de SQLite para el ambiente de desarrollo. Para ello, se debe configurar el archivo `settings.py` ubicado en la carpeta `backend/catalogo_arqueologico/catalogo_arqueologico` de la siguiente forma:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

#### Creación de ambiente virtual e instalación de paquetes

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

#### Cargar contenido
Para cargar el contenido de la base de datos, se deben ejecutar los siguientes comandos desde la carpeta que contiene `manage.py`, ubicada en la ruta `backend/catalogo_arqueologico`:

```bash
python manage.py migrate
python manage.py importAllData
```

Si se desea volver a cargar la base de datos, se debe
* eliminar la base de datos `db.sqlite3` ubicada en la carpeta `backend/catalogo_arqueologico`,
* eliminar las migraciones `0001_initial.py` de la carpeta `backend/catalogo_arqueologico/piezas/migrations` y
* eliminar el contenido de la carpeta media ubicada en `backend/catalogo_arqueologico/media`. 

Luego, ubicado en la carpeta contenedora de `manage.py`, se debe ejecutar el comando `python manage.py makemigrations` seguido de los comandos de importación de datos mencionados anteriormente.

#### Creación de grupos y superusuario
La aplicación tiene dos roles de usuario y dos grupos de permisos: `administrador` y `funcionario`. Para crear estos grupos, se debe ejecutar el siguiente comando desde la carpeta que contiene `manage.py`, ubicada en la ruta `backend/catalogo_arqueologico`:

```bash
python manage.py createGroups
```

Para crear un superusuario, se debe ejecutar el siguiente comando desde la misma carpeta anterior:

```bash
python manage.py createsuperuser
```

Luego, se deben seguir las instrucciones que se presentan en la terminal.

Cabe destacar que el superusuario creado no tendrá todos sus atributos definidos, por lo que se recomienda completarlos desde la interfaz de administrador de Django una vez se ejecute la aplicación por primera vez.

#### Ejecución del backend
Desde la carpeta `backend/catalogo_arqueologico`, ejecutar el siguiente comando:

```bash
python manage.py runserver
```

### Ambiente de producción
La aplicación se puede ejecutar en un ambiente de producción utilizando Docker y Docker Compose. El contenedor `nginx` se encarga de servir los archivos estáticos y redirigir las peticiones al backend o frontend según corresponda.

#### Configuración del entorno
Por un lado, se deben actualizar las variables de entorno en el archivo `.env` ubicado en la carpeta `backend/catalogo_arqueologico` con las siguientes variables:

```bash
DEBUG=False
SECRET_KEY=django-secret-key-prod
ALLOWED_HOSTS=mydomain.com,www.mydomain.com,subdomain.mydomain.com

CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=http://yourdomain.com,https://yourdomain.com,http://subdomain.yourdomain.com

POSTGRES_DB=postgres_db
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
DB_HOST=db
DB_PORT=5432
```

No olvide cambiar los valores de las variables de entorno según su configuración.

Por otro lado, es necesario cambiar la configuración de la base de datos en el archivo `settings.py` ubicado en la carpeta `backend/catalogo_arqueologico/catalogo_arqueologico` de la siguiente forma:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

#### Montaje de la aplicación
Para montar la aplicación en un ambiente de producción, se deben ejecutar los siguientes comandos:

```bash
docker-compose build
docker-compose run django python manage.py migrate
docker-compose run django python manage.py collectstatic
docker-compose run django python manage.py importAllData
docker-compose run django python manage.py createGroups
docker-compose run django python manage.py createsuperuser
```

Para elimitar la base de datos y volver a cargar el contenido, se deben eliminar los volúmenes mediante el siguiente comando:

```bash
docker-compose down -v
```

Luego se deben ejecutar los comandos mencionados anteriormente.

#### Ejecución de la aplicación
Para ejecutar la aplicación en un ambiente de producción, se debe ejecutar el siguiente comandos:

```bash
docker-compose up
```



