npm run build
rsync -av --delete dist/ /var/www/voluntors.org/
sudo nginx -s reload