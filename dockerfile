FROM nginx

COPY ./docs/.vitepress/dist/ /usr/share/nginx/html/

EXPOSE 80