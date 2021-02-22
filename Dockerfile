FROM node:9-slim
WORDKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]