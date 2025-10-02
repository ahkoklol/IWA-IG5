#!/bin/bash

echo "Creating S3 bucket"
awslocal --endpoint-url=http://localstack:4566 s3 mb s3://rekognitor-bucket

echo "This is a test file for S3 upload" > /tmp/hello.txt

echo "Uploading test file to S3"
awslocal --endpoint-url=http://localstack:4566 s3 cp /tmp/hello.txt s3://rekognitor-bucket/hello.txt

# Upload existing file
echo "Uploading existing file to S3"
awslocal --endpoint-url=http://localstack:4566 s3 cp "src/main/resources/assets/weed.png" "s3://rekognitor-bucket/analyze/weed.png"
awslocal --endpoint-url=http://localstack:4566 s3 cp "src/main/resources/assets/tomatoplant.jpg" "s3://rekognitor-bucket/analyze/tomatoplant.jpg"

echo "Listing buckets"
awslocal --endpoint-url=http://localstack:4566 s3 ls

echo "Listing content of the buckets"
awslocal --endpoint-url=http://localstack:4566 s3 ls s3://rekognitor-bucket/ --recursive

echo "Get object"
awslocal --endpoint-url=http://localstack:4566 s3 cp \
  "s3://rekognitor-bucket/hello.txt" \
  /tmp/out.pdf.gz