#!/bin/bash
cd /var/www/subject-sorter-js/site
sudo npm install
sudo webpack
cd ..
sudo npm install
sudo node server.js
