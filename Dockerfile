ARG CI_REGISTRY="registry.gitlab.com/eduqc/gitlab-front"
FROM $CI_REGISTRY:quasar as base
ADD . /app
CMD ["./node_modules/quasar-cli/bin/quasar", "dev", "-m", "pwa"]

FROM $CI_REGISTRY:quasar as builder
COPY --from=base /app /app
WORKDIR /app
RUN ./node_modules/quasar-cli/bin/quasar build -m pwa

FROM nginx:alpine as server
COPY --from=builder /app/dist/pwa-mat /usr/share/nginx/html/
ADD ./nginx.conf  /etc/nginx/conf.d/default.conf
