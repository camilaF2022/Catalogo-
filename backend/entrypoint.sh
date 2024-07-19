#!/bin/sh

set -e

host="db"  # The service name of the PostgreSQL database from docker-compose

until pg_isready -h "$host"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

if [ ! -f /app/.setup_done ]; then
  cd /app/catalogo_arqueologico

  python manage.py migrate --noinput
  python manage.py collectstatic --noinput

  python manage.py importAllData
  python manage.py createGroups
  touch /app/.setup_done
fi

exec "$@"
