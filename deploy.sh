#!/bin/bash

# Move Data
# sudo cp -R ./data /srv/http/data

# Move to Server Directory
sudo cp -R ./cron /srv/http
sudo cp -R ./images /srv/http
sudo cp -R ./javascripts /srv/http
sudo cp -R ./stylesheets /srv/http

sudo cp ./favicon.ico /srv/http/favicon.ico
sudo cp ./index.html /srv/http/index.html
sudo cp ./timeline.html /srv/http/timeline.html
sudo cp ./chart.html /srv/http/chart.html

