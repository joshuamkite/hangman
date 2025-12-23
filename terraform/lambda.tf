resource "aws_iam_role" "lambda_role" {
  name               = "${local.name_prefix}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_role.json
}

data "aws_iam_policy_document" "lambda_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:*:*:log-group:/aws/lambda/${local.name_prefix}-*:*"
    ]
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "${local.name_prefix}-lambda-policy"
  policy = data.aws_iam_policy_document.lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# Download NLTK data before building Lambda
resource "null_resource" "download_nltk_data" {
  triggers = {
    # Re-download if download script or handler changes
    script_hash  = filesha256("${path.module}/../api/download_nltk_data.py")
    handler_hash = filesha256("${path.module}/../api/lambda/handler.py")
  }

  provisioner "local-exec" {
    working_dir = "${path.module}/../api"
    command     = <<-EOT
      # Download NLTK data using uv run (creates temp venv with nltk)
      uv run --with nltk==3.8.1 download_nltk_data.py
    EOT
  }
}

module "lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 8.1"

  function_name = "${local.name_prefix}-word-generator"
  description   = "Hangman word generator using NLTK"
  handler       = "handler.lambda_handler"
  runtime       = "python3.13"

  source_path = [{
    path             = "${path.module}/../api/lambda"
    pip_requirements = true
  }]

  build_in_docker = true
  architectures   = ["arm64"]
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  environment_variables = {
    PYTHONPATH = "/var/task"
    NLTK_DATA  = "/var/task/nltk_data"
  }

  create_role                       = false
  lambda_role                       = aws_iam_role.lambda_role.arn
  cloudwatch_logs_retention_in_days = var.log_retention_days
  include_default_tag               = false

  depends_on = [null_resource.download_nltk_data]
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.api_gateway.api_execution_arn}/*/*"
}
