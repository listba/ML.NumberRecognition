FROM node:18-alpine3.15

COPY ./ ./

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]