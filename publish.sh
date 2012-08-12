#!/bin/sh

set -x

cd _site
rsync -r * root@eris.rioki.org:/var/www/www.rioki.org/htdocs/
ssh root@eris.rioki.org "cd /var/www/www.rioki.org/htdocs/ && chown -R www-data:www-data *"
