PACKER_LOG=1 packer build \
    -var "project_id=dev-csye-6225" \
    -var "ssh_username=csye6225" \
    -var "zone=us-east1-b" \
    ./packer/main.pkr.hcl