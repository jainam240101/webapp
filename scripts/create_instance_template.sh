gcloud compute instance-templates create $1 \
  --project=$2 \
  --machine-type=e2-medium \
  --network-interface=network-tier=PREMIUM,subnet=$3 \
  --instance-template-region=$4 \
  --metadata=startup-script='#!/bin/bash
    echo "user='"$6"'" > /tmp/.env
    echo "password='"$7"'" >> /tmp/.env
    echo "host='"$8"'" >> /tmp/.env
    echo "database='"$6"'" >> /tmp/.env
    echo "projectId='"$2"'" >> /tmp/.env
    echo "pubSub='"$9"'" >> /tmp/.env
    chown csye6225:csye6225 /tmp/.env
    mv /tmp/.env /home/csye6225/webapp/
    sudo systemctl start node.service' \
  --maintenance-policy=MIGRATE \
  --provisioning-model=STANDARD \
  --service-account=my-service-account-1@$2.iam.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/cloud-platform \
  --region=$4 \
  --tags=$5 \
  --create-disk=auto-delete=yes,boot=yes,device-name=persistent-disk-0,image=projects/$2/global/images/${10},kms-key=projects/dev-csye-6225/locations/us-east1/keyRings/${12}/cryptoKeys/${11},mode=rw,size=20,type=pd-balanced \
  --no-shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --reservation-affinity=any


# 1- instance_template_name
# 2 - project_name
# 3 - subnet_name
# 4 - region
# 5 - allow-lb-ip,deny-ssh-0,http-server (tags)
# sh scripts/create_instance_template.sh instance-template-36 dev-csye-6225 webapp-0 us-east1 "allow-lb-ip,deny-ssh-0,http-server" webapp 'f!P>6B5<By(%_O)7' 10.216.0.2 verify_email