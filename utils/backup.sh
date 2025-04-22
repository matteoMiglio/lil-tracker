#!/bin/bash

# Create backup directory if it doesn't exist

BACKUP_DIR="../backups"

mkdir -p "$BACKUP_DIR"

# Get current date/time
timestamp=$(date +"%Y%m%d_%H%M%S")

# Create a tarball backup with timestamp
tar czvf "$BACKUP_DIR/db-backup-$timestamp.tar.gz" data

echo "✅ Backup created: $BACKUP_DIR/db-backup-$timestamp.tar.gz"

find "$BACKUP_DIR" -name "db-backup-*.tar.gz" -type f -mtime +14 -exec rm -f {} \;

echo "🧹 Old backups older than 14 days have been removed."