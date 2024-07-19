#!/bin/sh

cd /app/catalogo_arqueologico

python manage.py migrate --noinput
python manage.py collectstatic --noinput

python manage.py importAllData
python manage.py createGroups

python manage.py runserver 0.0.0.0:8000