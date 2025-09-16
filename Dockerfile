FROM alpine
WORKDIR /app
COPY . /app

RUN apk add docker bash socat websocat nodejs npm 
EXPOSE 80
EXPOSE 8080
RUN npm i
RUN chmod +x run.sh
CMD [ "bash", "run.sh" ]