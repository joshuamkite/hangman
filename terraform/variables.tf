variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "eu-west-2"
}

variable "backend_bucket" {}

variable "backend_key" {}

variable "backend_region" {}

variable "default_tags" {
  description = "Default tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "default_throttling_burst_limit" {
  description = "Default API Gateway throttling burst limit"
  type        = number
  default     = 200
}

variable "default_throttling_rate_limit" {
  description = "Default API Gateway throttling rate limit"
  type        = number
  default     = 100
}

variable "domain_name" {
  description = "Domain name for the API Gateway"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "frontend_domain_name" {
  description = "Domain name for the React frontend"
  type        = string
}

variable "frontend_parent_zone_name" {
  description = "Parent hosted zone name for frontend (for subdomains). If not set, uses frontend_domain_name"
  type        = string
  default     = ""
}

variable "hosted_zone_name" {
  description = "Route53 hosted zone name for DNS"
  type        = string
}

variable "lambda_memory_size" {
  description = "Lambda function memory size in MB"
  type        = number
  default     = 512
}

variable "lambda_timeout" {
  description = "Lambda function timeout in seconds"
  type        = number
  default     = 30
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "hangman"
}
