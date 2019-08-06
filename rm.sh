#!/usr/bin/env bash

appname="wusi"

sed -i 's/^appname="'${appname}'"/appname="appname"/' ./rm.sh
sed -i 's/^appname="'${appname}'"/appname="appname"/' ./up.sh
sed -i 's/COMPOSE_PROJECT_NAME='${appname}'_/COMPOSE_PROJECT_NAME=appname_/' ./.env

docker rm ${appname}_nodejs_1 --force
docker rm ${appname}_nginx_1 --force
docker rm ${appname}_php_1 --force

docker rmi ${appname}_nodejs --force
docker rmi ${appname}_nginx --force
docker rmi ${appname}_php --force
