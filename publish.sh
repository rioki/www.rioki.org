#!/bin/sh

cd _site
rsync -r * root@eris.rioki.org:/var/www/rioki/www/
ssh root@eris.rioki.org "cd /var/www/rioki/www/ && chown -R www-data:www-data *"
