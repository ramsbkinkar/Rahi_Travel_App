terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "key_name" {
  description = "AWS Key Pair name"
  type        = string
  default     = "my-key-pair"
}

# Security Group
resource "aws_security_group" "backend_sg" {
  name_prefix = "raahi-backend-"
  description = "Security group for Raahi backend server"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "raahi-backend-sg"
  }
}

# EC2 Instance
resource "aws_instance" "backend_server" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2023
  instance_type = "t3.micro"
  # key_name      = var.key_name  # Removed - not needed for this deployment
  
  vpc_security_group_ids = [aws_security_group.backend_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    
    # Install Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs git
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Create app directory
    mkdir -p /home/ec2-user/app
    cd /home/ec2-user/app
    
    # Clone your repository (you'll need to update this URL)
    git clone https://github.com/ramsbkinkar/Rahi_Travel_App.git .
    
    # Navigate to server directory
    cd server
    
    # Install dependencies
    npm install
    
    # Build the application
    npm run build
    
    # Create data directory with proper permissions
    mkdir -p data
    chmod 755 data
    
    # Set environment variables
    export NODE_ENV=production
    export PORT=3000
    
    # Start the application with PM2
    pm2 start dist/index.js --name "raahi-backend"
    pm2 startup
    pm2 save
    
    # Change ownership to ec2-user
    chown -R ec2-user:ec2-user /home/ec2-user/app
  EOF

  tags = {
    Name = "raahi-backend-server"
  }
}

# Outputs
output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.backend_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.backend_server.public_dns
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${aws_instance.backend_server.public_ip}:3000/api"
} 