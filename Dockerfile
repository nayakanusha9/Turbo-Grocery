FROM ubuntu:latest
RUN apt-get update -y && \
    apt-get install apache2 -y
COPY . /var/www/html
EXPOSE 85
ENTRYPOINT apachectl -D FOREGROUND