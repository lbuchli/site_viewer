#!/bin/bash
#!/bin/bash
if [ "$(cat /usr/src/cert/server-dev.crt | openssl x509 -noout -checkend 3600)" == "Certificate will expire" ]; then
    openssl x509 -req -days 365 -in /usr/src/cert/server-dev.csr -signkey /usr/src/cert/server-dev.key -out /usr/src/cert/server-dev.crt
fi
poetry install
poetry run uvicorn src.main:app --reload --host 0.0.0.0 --port 8443 --ssl-keyfile /usr/src/cert/server-dev.key --ssl-certfile /usr/src/cert/server-dev.crt
