#!/usr/bin/env bash

docker build -t php_dev ./dockerfiles/php
docker build -t mysql_dev ./dockerfiles/mysql
docker build -t nginx_dev ./dockerfiles/nginx

docker save -o ./php_dev.tar php_dev:latest
docker save -o ./mysql_dev.tar mysql_dev:latest
docker save -o ./nginx_dev.tar nginx_dev:latest