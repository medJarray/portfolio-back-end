#!/bin/sh
set -e
if [ -z "$MONGODB_URI" ]; then
    echo "No MONGODB_URI environment variable set."
    exit 1
else
    echo "MONGODB_URI is set."
fi
exec "$@"
