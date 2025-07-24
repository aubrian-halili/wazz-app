#!/bin/bash

# Wazz App Deployment Script
# This script deploys the infrastructure using CloudFormation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="wazz-app-infrastructure"
TEMPLATE_FILE="infrastructure.yaml"
PARAMETERS_FILE="parameters.json"
REGION="us-east-1"

echo -e "${GREEN} Starting Wazz App Infrastructure Deployment${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED} AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if parameters file exists
if [ ! -f "$PARAMETERS_FILE" ]; then
    echo -e "${YELLOW} Parameters file not found. Creating from template...${NC}"
    cp parameters.json.example "$PARAMETERS_FILE"
    echo -e "${RED} Please update $PARAMETERS_FILE with your values and run again.${NC}"
    exit 1
fi

# Validate CloudFormation template
echo -e "${YELLOW} Validating CloudFormation template...${NC}"
aws cloudformation validate-template \
    --template-body file://$TEMPLATE_FILE \
    --region $REGION

# Deploy the stack
echo -e "${YELLOW} Deploying infrastructure stack...${NC}"
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --parameter-overrides file://$PARAMETERS_FILE \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --region $REGION \
    --no-fail-on-empty-changeset

# Get stack outputs
echo -e "${YELLOW} Getting stack outputs...${NC}"
aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table

echo -e "${GREEN} Infrastructure deployment completed successfully!${NC}"

# Get important values
APP_RUNNER_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`AppRunnerServiceUrl`].OutputValue' \
    --output text \
    --region $REGION)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionDomain`].OutputValue' \
    --output text \
    --region $REGION)

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text \
    --region $REGION)

ECR_REPOSITORY=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ECRRepository`].OutputValue' \
    --output text \
    --region $REGION)

echo -e "${GREEN}"
echo "App Runner URL: $APP_RUNNER_URL"
echo "CloudFront Domain: https://$CLOUDFRONT_DOMAIN"
echo "S3 Bucket: $S3_BUCKET"
echo "ECR Repository: $ECR_REPOSITORY"
echo -e "${NC}"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Push your backend Docker image to: $ECR_REPOSITORY"
echo "2. Build and deploy your frontend to: $S3_BUCKET"
echo "3. Your app will be available at: https://$CLOUDFRONT_DOMAIN"
