FROM alpine
WORKDIR /app
COPY . /app
RUN npm i
RUN apk add docker bash socat websocat nodejs npm 
EXPOSE 80
RUN chmod +x run.sh
CMD [ "bash", "run.sh" ]