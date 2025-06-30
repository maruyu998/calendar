FROM node:20

WORKDIR /app

COPY package.json ./

CMD ["npm", "start"]
# CMD ["tail", "-f", "/dev/null"]