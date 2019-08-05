#!/usr/bin/env bash

apk update && apk upgrade
apk add mariadb mariadb-client
apk add supervisor

mkdir -p /run/mysqld
sed -i 's/skip-networking/#skip-networking/g' /etc/my.cnf.d/mariadb-server.cnf
sed -i 's/#bind-address=0.0.0.0/bind-address=0.0.0.0/g' /etc/my.cnf.d/mariadb-server.cnf