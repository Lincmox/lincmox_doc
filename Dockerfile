FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files
COPY index.html /usr/share/nginx/html/
COPY config.json /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY doc/ /usr/share/nginx/html/doc/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
