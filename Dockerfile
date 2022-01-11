FROM node:17-alpine3.14

COPY ./ ./

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]