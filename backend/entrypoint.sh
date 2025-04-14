#!/bin/bash

bunx prisma generate

bunx prisma migrate deploy

exec "$@"