packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" {
  type    = string
  default = "dev-csye-6225"
}

variable "ssh_username" {
  type    = string
  default = "csye6225"
}

source "googlecompute" "centos" {
  project_id   = var.project_id
  source_image = "centos-stream-8-v20230509"
  image_name = "centos-image"
  network= "projects/dev-csye-6225/global/networks/default"
  zone         = "us-central1-a"
  ssh_username = var.ssh_username
}

build {
  sources = ["source.googlecompute.centos"]

  provisioner "shell" {
    inline = [
      "getent group csye6225 || sudo groupadd csye6225",
      "id -u csye6225 || sudo useradd -g csye6225 csye6225",
      "sudo usermod -s /usr/sbin/nologin csye6225",
      "echo 'csye6225:root' | sudo chpasswd",
    ]
  }

  provisioner "file" {
    source      = "webapp.tar.gz"
    destination = "/tmp/"
  }

  provisioner "shell" {
    inline = [
      # Setting Up Zip file and extracting code from it 
      "sudo mv /tmp/webapp.tar.gz /home/csye6225",
      "mkdir /home/csye6225/webapp",
      "chown csye6225:csye6225 /home/csye6225/webapp",
      "tar -xzvf /home/csye6225/webapp.tar.gz -C /home/csye6225/webapp",
      "rm /home/csye6225/webapp.tar.gz",
      
      # Setting up MySQL and NodeJS 

      "sudo yum install -y wget",
      "wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm",
      "sudo curl -fsSL https://rpm.nodesource.com/setup_19.x | sudo bash -",
      "sudo rpm -ivh mysql80-community-release-el8-1.noarch.rpm",
      "sudo yum install -y mysql-server",
      "sudo yum install -y nodejs",
      "sudo systemctl start mysqld",
      "sudo systemctl enable mysqld",
      "sudo mysql -u root --execute=\"ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; FLUSH PRIVILEGES;\"",
      "mysql -uroot -proot -e \"CREATE DATABASE cloud;\"",
      "mysql -uroot -proot -e \"SHOW DATABASES;\"",
      "cd /home/csye6225/webapp && npm install",

      "sudo mv /home/csye6225/webapp/packer/node.service /etc/systemd/system/",
      "chmod 744 /etc/systemd/system/node.service",
      "sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config",
      "sudo setenforce 0",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable node.service",
      "sudo systemctl start node.service",
    ]
  }
}

# tar -xzvf webapp.tar.gz
# gcloud compute images delete "centos-stream-image-test1" --quiet
# tar -czvf webapp.tar.gz --exclude="node_modules" .      