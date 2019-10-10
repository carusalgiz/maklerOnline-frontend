server {
	listen 80;

	root /usr/share/nginx/www;
	index index.html index.htm;

	server_name dev.maklersoft.ru;

	location / {
                proxy_pass http://127.0.0.1:1234;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Forwarded-HTTPS 0;
                include proxy_params;
        }
}

