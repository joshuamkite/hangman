output "account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "api_domain_url" {
  description = "Custom domain URL for the API"
  value       = "https://${var.domain_name}"
}

output "api_gateway_invoke_url" {
  description = "The invocation URL for the API Gateway"
  value       = module.api_gateway.api_endpoint
}

output "frontend_acm_certificate_id" {
  description = "Frontend ACM certificate ID"
  value       = module.frontend_website.acm_certificate_id
}

output "frontend_cloudfront_distribution_id" {
  description = "Frontend CloudFront distribution ID (for cache invalidation)"
  value       = module.frontend_website.cloudfront_distribution_id
}

output "frontend_cloudfront_domain_name" {
  description = "Frontend CloudFront distribution domain name"
  value       = module.frontend_website.cloudfront_domain_name
}

output "frontend_s3_bucket_id" {
  description = "Frontend S3 bucket ID (name)"
  value       = module.frontend_website.s3_bucket_id
}

output "frontend_website_url" {
  description = "Frontend website URL"
  value       = "https://${var.frontend_domain_name}"
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = module.lambda_function.lambda_function_arn
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.lambda_function.lambda_function_name
}
