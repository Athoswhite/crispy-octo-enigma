FROM nginx:latest


COPY ./index.html /usr/share/nginx/html/
COPY ./main.js /usr/share/nginx/html/
COPY ./config.js /usr/share/nginx/html/
COPY ./script.js /usr/share/nginx/html/
COPY ./style.css /usr/share/nginx/html/


EXPOSE 80


