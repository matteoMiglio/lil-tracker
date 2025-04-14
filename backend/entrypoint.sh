#!/bin/bash

# Run Prisma Generate (for making sure schema is updated)
bunx prisma generate

# Run Prisma Migrate to apply any pending migrations
bunx prisma migrate deploy

bunx prisma db seed

# Start the app
exec "$@"