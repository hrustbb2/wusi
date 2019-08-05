#!/usr/bin/env bash

appname="appname"

docker network create -d bridge --subnet 192.168.0.0/24 --gateway 192.168.0.1 dockernet
docker-compose up --force-recreate -d
docker exec -it ${appname}_php_1 sh
wait $!
docker-compose stop
wait $!
for (( i=5; i >= 0; i-- ))
do
    printf 'Please wait '
    printf $i
    printf '\r'
    sleep 1
done
printf '\n'
docker network rm dockernet
