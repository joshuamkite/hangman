module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = ">= 6.0"

  name          = "${local.name_prefix}-api"
  description   = "Hangman Word Generator HTTP API"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_credentials = false
    allow_headers     = ["content-type", "authorization"]
    allow_methods     = ["GET", "OPTIONS"]
    allow_origins     = ["https://${var.frontend_domain_name}"]
    expose_headers    = ["date"]
    max_age           = 86400
  }

  create_routes_and_integrations = false

  stage_access_log_settings = {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      userAgent      = "$context.identity.userAgent"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
    })
  }

  stage_default_route_settings = {
    throttling_burst_limit = var.default_throttling_burst_limit
    throttling_rate_limit  = var.default_throttling_rate_limit
  }

  hosted_zone_name = var.hosted_zone_name
  domain_name      = var.domain_name
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = module.api_gateway.api_id
  integration_type       = "AWS_PROXY"
  connection_type        = "INTERNET"
  description            = "Word generator Lambda integration"
  integration_method     = "POST"
  integration_uri        = module.lambda_function.lambda_function_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "word_route" {
  api_id    = module.api_gateway.api_id
  route_key = "GET /word"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}
