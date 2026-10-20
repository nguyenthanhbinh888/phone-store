#!/bin/bash
# ==============================================================
# PHONE STORE - AUTOMATED MYSQL BACKUP SCRIPT (LINUX / VPS)
# ==============================================================

set -e

DB_USER=${DB_USER:-"root"}
DB_PASSWORD=${DB_PASSWORD:-"123456"}
DB_NAME=${DB_NAME:-"phone_store_db"}
BACKUP_DIR="./backups"

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/phone_store_backup_$TIMESTAMP.sql"

echo "[INFO] Đang sao lưu cơ sở dữ liệu $DB_NAME vào $BACKUP_FILE..."

mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

echo "[SUCCESS] Sao lưu thành công! File lưu tại: $BACKUP_FILE"
