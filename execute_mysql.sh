#!/bin/bash
echo "Copying SQL file to server..."
scp SETUP_MYSQL.sql root@82.29.56.143:/tmp/

echo "Executing SQL script on server..."
ssh root@82.29.56.143 "mysql -u root -p < /tmp/SETUP_MYSQL.sql"

echo "Done!"
