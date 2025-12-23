locals {
  mime_types = {
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
  }
}

module "frontend_website" {
  source  = "registry.terraform.io/joshuamkite/static-website-s3-cloudfront-acm/aws"
  version = "2.4.0"

  domain_name           = var.frontend_domain_name
  parent_zone_name      = var.frontend_parent_zone_name != "" ? var.frontend_parent_zone_name : var.hosted_zone_name
  s3_bucket_custom_name = "${var.frontend_domain_name}-${var.aws_region}-${local.account_id}"

  cloudfront_custom_error_responses = [
    {
      error_code            = 403
      response_code         = 200
      response_page_path    = "/index.html"
      error_caching_min_ttl = 10
    },
    {
      error_code            = 404
      response_code         = 200
      response_page_path    = "/index.html"
      error_caching_min_ttl = 10
    }
  ]

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws           = aws
  }
}

resource "null_resource" "build_frontend" {
  # Rebuild when API URL changes
  triggers = {
    api_url = "https://${var.domain_name}"
    # Also rebuild if frontend source files change
    frontend_hash = sha256(join("", [for f in fileset("${path.module}/../frontend/src", "**") : filesha256("${path.module}/../frontend/src/${f}")]))
    # Force re-evaluation of dist files by including timestamp
    always_run = timestamp()
  }

  provisioner "local-exec" {
    working_dir = "${path.module}/../frontend"
    command     = "npm install && VITE_API_URL=https://${var.domain_name} npm run build"
  }
}

# Use a separate null_resource to sync files to avoid the fileset timing issue
resource "null_resource" "sync_frontend_to_s3" {
  triggers = {
    build_id = null_resource.build_frontend.id
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws s3 sync ${path.module}/../frontend/dist s3://${module.frontend_website.s3_bucket_id}/ \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "index.html" \
        --exclude "*.html"
      
      # Upload HTML files separately with different cache settings
      aws s3 sync ${path.module}/../frontend/dist s3://${module.frontend_website.s3_bucket_id}/ \
        --cache-control "public, max-age=0, must-revalidate" \
        --exclude "*" \
        --include "*.html"
    EOT
  }

  depends_on = [null_resource.build_frontend]
}

# Invalidate CloudFront cache after uploading new files
resource "null_resource" "invalidate_cloudfront" {
  triggers = {
    sync_id = null_resource.sync_frontend_to_s3.id
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${module.frontend_website.cloudfront_distribution_id} --paths '/*'"
  }

  depends_on = [null_resource.sync_frontend_to_s3]
}
