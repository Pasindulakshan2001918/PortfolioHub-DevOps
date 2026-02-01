provider "aws" {
  region = "ap-south-1"
}

# 🔹 Read EXISTING Security Group
data "aws_security_group" "portfoliohub_sg" {
  name   = "portfoliohub-sg"
  vpc_id = "vpc-07e5875498eb3ffa1"
}

# 🔹 Add HTTP rule to existing Security Group (port 80)
resource "aws_security_group_rule" "allow_http" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = data.aws_security_group.portfoliohub_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
}

# 🔹 Add SSH rule if you want to connect manually (optional, port 22)
resource "aws_security_group_rule" "allow_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  security_group_id = data.aws_security_group.portfoliohub_sg.id
  cidr_blocks       = ["0.0.0.0/0"]
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

