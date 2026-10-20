@echo off
REM ==============================================================
REM PHONE STORE - AUTOMATED MYSQL BACKUP SCRIPT (WINDOWS)
REM ==============================================================
setlocal

set DB_USER=root
set DB_NAME=phone_store_db
set BACKUP_DIR=.\backups

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%
set BACKUP_FILE=%BACKUP_DIR%\phone_store_backup_%TIMESTAMP%.sql

echo [INFO] Dang sao luu co so du lieu %DB_NAME% vao %BACKUP_FILE%...

mysqldump -u %DB_USER% -p %DB_NAME% > "%BACKUP_FILE%"

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Sao luu thanh cong! File luu tai: %BACKUP_FILE%
) else (
    echo [ERROR] Sao luu that bai! Vui long kiem tra lai MySQL service va thong tin dang nhap.
)

endlocal
