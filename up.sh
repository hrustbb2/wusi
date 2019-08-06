#!/usr/bin/env bash

appname="appname"

docker network create -d bridge --subnet 192.168.2.0/24 --gateway 192.168.2.8 ${appname}_dockernet
docker-compose up --force-recreate -d
docker exec -it ${appname}_nodejs_1 /bin/bash
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
docker network rm ${appname}_dockernet
