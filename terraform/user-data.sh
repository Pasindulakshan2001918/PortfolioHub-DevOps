#!/bin/bash
apt update -y
apt install -y docker.io docker-compose

systemctl start docker
systemctl enable docker

docker pull lpasindu923/portfoliohub-backend1:latest
docker pull lpasindu923/portfoliohub-frontend1:latest
docker pull mongo:7.0

docker network create portfoliohub-net

docker run -d --name mongo \
  --network portfoliohub-net \
  -p 27017:27017 \
  mongo:7.0

docker run -d --name backend \
  --network portfoliohub-net \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo:27017/portfoliohub \
  -e JWT_SECRET=your_super_secret_key \
  lpasindu923/portfoliohub-backend1:latest

docker run -d --name frontend \
  --network portfoliohub-net \
  -p 80:80 \
  lpasindu923/portfoliohub-frontend1:latest
