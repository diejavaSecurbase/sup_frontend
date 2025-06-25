#FROM docker-spv.artifactory.gscorp.ad/angular-cli-spv
#FROM nginx:alpine
FROM docker-spv.artifactory.gscorp.ad/nginx-spv:1.17.8

# RUN ng build --configuration production --output-path=/dist
# COPY --from=build /dist /usr/share/nginx/html



COPY ./dist/spa-portal-clientes /usr/share/nginx/html

COPY ./nginx /etc/nginx
# COPY ./nginxcfg/default.conf /etc/nginx/conf.d/default.conf


# Expose ports
EXPOSE 80

#vCMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
CMD ["nginx", "-g", "daemon off;"]


