#!/usr/bin/env bash

/usr/bin/supervisord -c /home/supervisord.conf
tail -f /dev/null