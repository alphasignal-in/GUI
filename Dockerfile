FROM node
WORKDIR /app
COPY . /app
RUN npm i
RUN apt update && apt install docker.io bash socat -y
EXPOSE 3000
RUN chmod +x run.sh
CMD [ "sh", "run.sh" ]