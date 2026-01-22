provider "aws" {
  region = "ap-south-1"
}

resource "aws_security_group" "portfoliohub_sg" {
  name = "portfoliohub-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
resource "aws_instance" "portfoliohub_ec2" {
  ami           = "ami-0f5ee92e2d63afc18" # Ubuntu 22.04 (ap-south-1)
  instance_type = "t2.micro"
  key_name      = "portfoliohub-key"

  vpc_security_group_ids = [
    aws_security_group.portfoliohub_sg.id
  ]

  user_data = file("user-data.sh")

  tags = {
    Name = "PortfolioHub-EC2"
  }
}
