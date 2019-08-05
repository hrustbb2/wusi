#!/usr/bin/env bash

apk update && apk upgrade
apk add nginx
apk add supervisor

mkdir -p /run/nginx