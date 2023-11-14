#!/bin/sh

if [ $# -gt 0 ]; then
    exec "$@"
else
    exec node dist/index.js
fi