#!/usr/bin/env bash

user=$1

if [ -z "$user" ]
then
      echo "specify user name"
      exit 1
fi

echo -n ${user}':' >> ../nginx/scripts/.htpasswd
openssl passwd -apr1 >> ../nginx/scripts/.htpasswd