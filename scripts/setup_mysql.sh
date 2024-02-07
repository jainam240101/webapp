docker run -d \
  --name mysql_cloud \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=cloud \
  -e MYSQL_USER=jainam \
  -e MYSQL_PASSWORD=root \
  -v mysql_data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:latest
