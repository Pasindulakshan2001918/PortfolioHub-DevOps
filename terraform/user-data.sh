#!/bin/bash

# Update OS packages
apt update -y

# Install Docker Engine and Docker Compose plugin (v2)
apt install -y docker.io docker-compose-plugin

# Start and enable Docker service
systemctl start docker
systemctl enable docker

# No docker pull, run, or network creation here — Jenkins handles all deployments