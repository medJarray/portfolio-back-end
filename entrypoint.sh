#!/bin/sh
set -e
if [ -z "$DATABASE_HOST" ]; then
    echo "No DATABASE_HOST environment variable set."
    exit 1
else
    echo "DATABASE_HOST is set."
fi
exec "$@"
