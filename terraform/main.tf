provider "aws" {
  region = "ap-south-1"
}

# 🔹 Read EXISTING Security Group (already created in AWS)
data "aws_security_group" "portfoliohub_sg" {
  name   = "portfoliohub-sg"
  vpc_id = "vpc-07e5875498eb3ffa1"
}

# 🔹 EC2 Instance
resource "aws_instance" "portfoliohub_ec2" {
  ami           = "ami-0f5ee92e2d63afc18" # Ubuntu 22.04 (ap-south-1)
  instance_type = "t3.micro"
  key_name      = "portfoliohub-key"

  vpc_security_group_ids = [
    data.aws_security_group.portfoliohub_sg.id
  ]

  user_data = file("user-data.sh")

  tags = {
    Name = "PortfolioHub-EC2"
  }
}

