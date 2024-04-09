packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "zone" {
  type = string
}

source "googlecompute" "centos" {
  project_id   = var.project_id
  source_image = "centos-stream-8-v20230509"
  image_name   = "centos-image-{{timestamp}}"
  network      = "projects/dev-csye-6225/global/networks/default"
  zone         = var.zone
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
      "sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh",
      "sudo bash add-google-cloud-ops-agent-repo.sh --also-install",
      "sudo touch /var/log/error.log",
      "sudo touch /var/log/combined.log",
      "sudo chown csye6225:csye6225 /var/log/error.log",
      "sudo chown csye6225:csye6225 /var/log/combined.log",
    ]
  }

  provisioner "file" {
    source      = "webapp.tar.gz"
    destination = "/tmp/"
  }

  provisioner "file" {
    source ="./packer/config.yaml"
    destination = "/tmp/config.yaml"
  }

  provisioner "shell" {
    inline = [
      # Setting Up Zip file and extracting code from it 
      "sudo mv /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml",
      "sudo chown root:root /etc/google-cloud-ops-agent/config.yaml",
      "sudo chmod 644 /etc/google-cloud-ops-agent/config.yaml",
      "sudo mv /tmp/webapp.tar.gz /home/csye6225",
      "mkdir /home/csye6225/webapp",
      "chown csye6225:csye6225 /home/csye6225/webapp",
      "tar -xzvf /home/csye6225/webapp.tar.gz -C /home/csye6225/webapp",
      "rm /home/csye6225/webapp.tar.gz",

      # Setting up Ops Agent and  NodeJS 
      "sudo curl -fsSL https://rpm.nodesource.com/setup_19.x | sudo bash -",
      "sudo yum install -y nodejs",
      "cd /home/csye6225/webapp && npm install",

      #Ensure the Google Cloud Ops Agent is restarted to apply changes
      "sudo systemctl restart google-cloud-ops-agent",

      "sudo mv /home/csye6225/webapp/packer/node.service /etc/systemd/system/",
      "chmod 744 /etc/systemd/system/node.service",
      "sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config",
      "sudo setenforce 0",
      "sudo systemctl daemon-reload",
    ]
  }
}

# tar -xzvf webapp.tar.gz
# gcloud compute images delete "centos-stream-image-test1" --quiet
# tar -czvf webapp.tar.gz --exclude="node_modules" .  
# packer_output=$(packer build -var "project_id=${{ secrets.PROJECT_ID }}" -var "ssh_username=${{ secrets.SSH_USERNAME }}" -var "zone=${{ secrets.ZONE }}" ./packer/main.pkr.hcl)
