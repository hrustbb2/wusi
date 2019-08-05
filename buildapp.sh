#!/usr/bin/env bash

appname=$1

sed -i 's/^appname="appname"/appname="'${appname}'"/' ./rm.sh
sed -i 's/appname="appname"/appname="'${appname}'"/g' ./up.sh
sed -i 's/COMPOSE_PROJECT_NAME=appname_/COMPOSE_PROJECT_NAME='${appname}'_/g' ./.env

docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 dockernet
docker-compose build --no-cache

#if ! [ -d ./data ];
#then
#    docker run -v $PWD/data:/var/lib/mysql -it ${appname}_db sh /home/init.sh
#fi

wait $!
echo 'Please wait...'
sleep 3
docker network rm dockernet