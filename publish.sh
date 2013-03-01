#!/bin/sh

set -x

cd _site
rsync -r --chmod=ug=rwX,o=rX -p * root@eris.rioki.org:/var/www/www.rioki.org/htdocs/
ssh root@eris.rioki.org "cd /var/www/www.rioki.org/htdocs/ && chown -R www-data:www-data *"
