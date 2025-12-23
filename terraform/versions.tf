terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">=6.26.0"
      configuration_aliases = [aws.us-east-1]
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.default_tags
  }
}

# Second provider for ACM certificates (CloudFront requires certificates in us-east-1)
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"

  default_tags {
    tags = var.default_tags
  }
}
