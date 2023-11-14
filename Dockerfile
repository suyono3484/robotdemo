FROM node:lts-alpine

WORKDIR /home/node

ADD . .
RUN rm -rf node_modules dist coverage && chown -R 1000:1000 /home/node

USER 1000:1000

RUN npm install && npm run build
ENV PATH="/home/node/node_modules/.bin:${PATH}"
ENTRYPOINT [ "/bin/sh", "/home/node/docker/entry.sh" ]

CMD [ "node", "dist/index.js" ]