#!/bin/bash

# Usage check
if [ -z "$1" ]; then
  echo "❌ Usage: ./restore.sh <backup-file>"
  exit 1
fi

# Extract the backup tar.gz
tar xzvf "$1" -C .

echo "✅ Backup $1 restored to ./data/"