#!/usr/bin/env bash

function gdrive_download() {
  CONFIRM=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate "https://docs.google.com/uc?export=download&id=$1" -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')
  wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$CONFIRM&id=$1" -O $2
  rm -rf /tmp/cookies.txt
}

if ! [ -f ./nginx_dev.tar ];
then
    gdrive_download 17i1aM9IM8SDbuPsArcMyEE8uqfGGPRgq nginx_dev.tar
fi
if ! [ -f ./mysql_dev.tar ];
then
    gdrive_download 1mKp1fxsobKa-xeLasMdIkAPqNlm9CYL7 mysql_dev.tar
fi
if ! [ -f ./php_dev.tar ];
then
    gdrive_download 139sPGXSYHROWVkC0Cj0HZs7xyR0lLo7o php_dev.tar
fi

echo 'Please wait for loading images\r\n'
docker load -i ./nginx_dev.tar
echo 'nginx loading\r\n'
docker load -i ./mysql_dev.tar
echo 'mysql loading\r\n'
docker load -i ./php_dev.tar
echo 'phpmyadmin loading\r\n'
