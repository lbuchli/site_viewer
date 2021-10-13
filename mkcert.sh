#!/bin/bash

# run this to locally trust the developement certificate (rerun after every certificate refresh)
mkcert -install
mkcert -cert-file cert/server-dev.crt -key-file cert/server-dev.key 0.0.0.0 localhost 127.0.0.1 ::1
