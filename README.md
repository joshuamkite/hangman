# Hangman Game

Full-stack hangman game with React TypeScript frontend and Python Lambda backend. Various player options and content filtering.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat&logo=python)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)
![OpenTofu](https://img.shields.io/badge/OpenTofu-1.10+-FFDA18?style=flat&logo=opentofu&logoColor=000000)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?style=flat&logo=awslambda)

- [Hangman Game](#hangman-game)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Local Development](#local-development)
    - [Prerequisites](#prerequisites)
    - [Quick Start](#quick-start)
    - [Running Backend and Frontend Separately](#running-backend-and-frontend-separately)
  - [Game Rules](#game-rules)
  - [API Specification](#api-specification)
  - [Content Safety](#content-safety)
  - [AWS Deployment](#aws-deployment)
    - [Prerequisites](#prerequisites-1)
    - [Deployment Architecture](#deployment-architecture)
    - [Build Process](#build-process)
    - [Updating the Deployment](#updating-the-deployment)
  - [Requirements](#requirements)
  - [Providers](#providers)
  - [Modules](#modules)
  - [Resources](#resources)
  - [Inputs](#inputs)
  - [Outputs](#outputs)

## Features

- **Multiple Figure Types**: Classic hangman person or spider
- **Difficulty Levels**: Easy (10 guesses) or Hard (6 guesses)
- **Customizable Word Length**: 3 to 15 letters
- **Keyboard Support**: Physical keyboard or on-screen buttons
- **Word Definitions**: WordNet definitions from NLTK
- **Content Filtering**: Profanity and distressing content filtered
- **Responsive Design**: Desktop and mobile support

## Architecture

```
hangman/
├── api/                       # Python Lambda backend
│   ├── lambda/
│   │   ├── handler.py        # Lambda function handler
│   │   ├── pyproject.toml    # Lambda dependencies
│   │   └── nltk_data/        # NLTK corpus (downloaded, not in git)
│   ├── tests/
│   │   ├── test_handler.py   # Test suite
│   │   └── conftest.py       # pytest configuration
│   ├── download_nltk_data.py # Script to download NLTK corpus
│   ├── local_server.py       # FastAPI dev server with Swagger UI
│   ├── openapi.yaml          # OpenAPI specification
│   └── pyproject.toml        # Development dependencies (uv)
│
├── frontend/                  # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameSettings.tsx    # Configuration controls
│   │   │   ├── Keyboard.tsx        # On-screen keyboard
│   │   │   ├── PersonFigure.tsx    # SVG person hangman
│   │   │   ├── SpiderFigure.tsx    # SVG spider hangman
│   │   │   └── WordDisplay.tsx     # Word with blanks/letters
│   │   ├── api.ts                  # API client
│   │   ├── types.ts                # TypeScript types
│   │   ├── App.tsx                 # Main game logic
│   │   └── main.tsx                # React entry point
│   ├── .env.example                # Environment template
│   └── vite.config.ts              # Vite configuration
│
├── terraform/                 # AWS infrastructure
│   ├── lambda.tf             # Lambda function
│   ├── api_gateway.tf        # API Gateway
│   ├── frontend.tf           # S3 + CloudFront
│   └── main.tf              # Core configuration
│
└── run-local.sh              # Start both services
```

**Stack:**
- **Backend**: Python 3.13, NLTK WordNet, better-profanity, FastAPI (local), AWS Lambda (production)
- **Frontend**: React 18, TypeScript, Vite
- **Infrastructure**: OpenTofu/Terraform, API Gateway, S3, CloudFront, ACM, Route53

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- uv (Python package manager)

### Quick Start

Run both backend and frontend together:

```bash
./run-local.sh
```

This starts:
- API server: http://localhost:8000
- Frontend: http://localhost:5173

Press Ctrl+C to stop both services.

### Running Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd api
uv sync
uv run python download_nltk_data.py
uv run python local_server.py  # Starts FastAPI server with Swagger UI at http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev  # Start dev server at http://localhost:5173
```

**Available Scripts:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

**Test Suite and API Testing:**
```bash
# Run automated test suite
cd api
uv run pytest

# Interactive API documentation (Swagger UI)
# Visit http://localhost:8000 in browser

# Manual API test
curl "http://localhost:8000/word?length=5"
```

**Environment Variables:**
- Frontend: `VITE_API_URL` (default: http://localhost:8000)
- Backend: None required for local development

## Game Rules

1. Select your preferences (figure type, difficulty, word length)
2. Click "New Game" to fetch a random word
3. Guess letters using keyboard or on-screen buttons
4. Win by guessing all letters before running out of attempts
5. View the word definition when you win or lose

**Figure Parts:**

Both person and spider have the same number of parts:

**Easy Mode (10 parts)**:
- Person: head, body, left arm, right arm, left leg, right leg, left hand, right hand, left foot, right foot
- Spider: body, head, 4 pairs of legs, eyes, silk thread

**Hard Mode (6 parts)**:
- Person: head, body, left arm, right arm, left leg, right leg
- Spider: body, head, 2 pairs of front legs, 2 pairs of middle legs

## API Specification

The backend includes [`api/local_server.py`](api/local_server.py) - a FastAPI development server with interactive Swagger UI at http://localhost:8000 for testing and exploring the API. Full OpenAPI specification: [`api/openapi.yaml`](api/openapi.yaml)

**Endpoint:** `GET /word`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `length` | integer | 5 | Exact word length (minimum: 3) |

**Response:**
```json
{
  "word": "ELEPHANT",
  "length": 8,
  "definition": "five-toed pachyderm",
  "attempts": 3
}
```

**Error Responses:**

`400 Bad Request` - Invalid parameters:
```json
{
  "error": "length must be at least 3"
}
```

`500 Internal Server Error` - Word generation failed:
```json
{
  "error": "Failed to generate word",
  "message": "Could not find a valid word after 1000 attempts"
}
```

## Content Safety

The API filters:

1. **Profanity** - Using better-profanity library
2. **Distressing Terms** - Violence, death, medical conditions, body fluids, injuries
3. **Distressing Domains** - Medicine, pathology, military, warfare, slang, vulgar, offensive
4. **Invalid Characters** - Underscores, hyphens

**Implementation Notes:**
- NLTK data pre-downloaded to avoid Lambda cold start delays
- Function attempts up to 1000 iterations to find valid words
- Filter statistics logged for debugging
- CORS enabled for frontend integration

## AWS Deployment

### Prerequisites

- OpenTofu/Terraform 1.10+
- AWS CLI configured
- Python 3.13
- Node.js
- Docker
- Route53 hosted zone for your domain

### Deployment Architecture

- **Lambda Function**: Python 3.13 on ARM64 with NLTK
- **API Gateway**: HTTP API with custom domain and CORS
- **Frontend**: S3 + CloudFront with ACM certificate
- **Logging**: CloudWatch logs for API Gateway and Lambda

### Build Process

**Lambda Build** (`null_resource` with `local-exec`):
1. Install Python dependencies for ARM64
2. Download NLTK data (wordnet, omw-1.4)
3. Package handler code with dependencies
4. Create deployment zip

Triggers on changes to [`api/lambda/handler.py`](api/lambda/handler.py) or [`api/lambda/pyproject.toml`](api/lambda/pyproject.toml).

**Frontend Build**:
1. Install npm dependencies
2. Build React app with `VITE_API_URL`
3. Sync to S3 with cache headers
4. Invalidate CloudFront cache

Triggers on API URL changes or frontend source changes.

### Updating the Deployment

Terraform detects changes, rebuilds, syncs to S3, and invalidates CloudFront.

**Manual CloudFront invalidation:**
```bash
aws cloudfront create-invalidation \
  --distribution-id $(tofu output -raw frontend_cloudfront_distribution_id) \
  --paths "/*"
```

**Testing:**
```bash
# Custom domain
curl "https://api.hangman.example.com/word?length=5"

# API Gateway URL
curl "https://xxxx.execute-api.eu-west-2.amazonaws.com/word?length=5"
```

---

 <!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.10.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >=6.26.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 6.27.0 |
| <a name="provider_null"></a> [null](#provider\_null) | 3.2.4 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_api_gateway"></a> [api\_gateway](#module\_api\_gateway) | terraform-aws-modules/apigateway-v2/aws | >= 6.0 |
| <a name="module_frontend_website"></a> [frontend\_website](#module\_frontend\_website) | registry.terraform.io/joshuamkite/static-website-s3-cloudfront-acm/aws | 2.4.0 |
| <a name="module_lambda_function"></a> [lambda\_function](#module\_lambda\_function) | terraform-aws-modules/lambda/aws | ~> 8.1 |

## Resources

| Name | Type |
|------|------|
| [aws_apigatewayv2_integration.lambda_integration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_integration) | resource |
| [aws_apigatewayv2_route.word_route](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_route) | resource |
| [aws_cloudwatch_log_group.api_gateway_logs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_iam_policy.lambda_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy) | resource |
| [aws_iam_role.lambda_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.lambda_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_permission.api_gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [null_resource.build_frontend](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [null_resource.download_nltk_data](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [null_resource.invalidate_cloudfront](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [null_resource.sync_frontend_to_s3](https://registry.terraform.io/providers/hashicorp/null/latest/docs/resources/resource) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.lambda_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.lambda_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region for deployment | `string` | `"eu-west-2"` | no |
| <a name="input_backend_bucket"></a> [backend\_bucket](#input\_backend\_bucket) | n/a | `any` | n/a | yes |
| <a name="input_backend_key"></a> [backend\_key](#input\_backend\_key) | n/a | `any` | n/a | yes |
| <a name="input_backend_region"></a> [backend\_region](#input\_backend\_region) | n/a | `any` | n/a | yes |
| <a name="input_default_tags"></a> [default\_tags](#input\_default\_tags) | Default tags to apply to all resources | `map(string)` | `{}` | no |
| <a name="input_default_throttling_burst_limit"></a> [default\_throttling\_burst\_limit](#input\_default\_throttling\_burst\_limit) | Default API Gateway throttling burst limit | `number` | `200` | no |
| <a name="input_default_throttling_rate_limit"></a> [default\_throttling\_rate\_limit](#input\_default\_throttling\_rate\_limit) | Default API Gateway throttling rate limit | `number` | `100` | no |
| <a name="input_domain_name"></a> [domain\_name](#input\_domain\_name) | Domain name for the API Gateway | `string` | n/a | yes |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment name (dev, staging, prod) | `string` | `"dev"` | no |
| <a name="input_frontend_domain_name"></a> [frontend\_domain\_name](#input\_frontend\_domain\_name) | Domain name for the React frontend | `string` | n/a | yes |
| <a name="input_frontend_parent_zone_name"></a> [frontend\_parent\_zone\_name](#input\_frontend\_parent\_zone\_name) | Parent hosted zone name for frontend (for subdomains). If not set, uses frontend\_domain\_name | `string` | `""` | no |
| <a name="input_hosted_zone_name"></a> [hosted\_zone\_name](#input\_hosted\_zone\_name) | Route53 hosted zone name for DNS | `string` | n/a | yes |
| <a name="input_lambda_memory_size"></a> [lambda\_memory\_size](#input\_lambda\_memory\_size) | Lambda function memory size in MB | `number` | `512` | no |
| <a name="input_lambda_timeout"></a> [lambda\_timeout](#input\_lambda\_timeout) | Lambda function timeout in seconds | `number` | `30` | no |
| <a name="input_log_retention_days"></a> [log\_retention\_days](#input\_log\_retention\_days) | CloudWatch log retention in days | `number` | `7` | no |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Name of the project | `string` | `"hangman"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_account_id"></a> [account\_id](#output\_account\_id) | AWS Account ID |
| <a name="output_api_domain_url"></a> [api\_domain\_url](#output\_api\_domain\_url) | Custom domain URL for the API |
| <a name="output_api_gateway_invoke_url"></a> [api\_gateway\_invoke\_url](#output\_api\_gateway\_invoke\_url) | The invocation URL for the API Gateway |
| <a name="output_frontend_acm_certificate_id"></a> [frontend\_acm\_certificate\_id](#output\_frontend\_acm\_certificate\_id) | Frontend ACM certificate ID |
| <a name="output_frontend_cloudfront_distribution_id"></a> [frontend\_cloudfront\_distribution\_id](#output\_frontend\_cloudfront\_distribution\_id) | Frontend CloudFront distribution ID (for cache invalidation) |
| <a name="output_frontend_cloudfront_domain_name"></a> [frontend\_cloudfront\_domain\_name](#output\_frontend\_cloudfront\_domain\_name) | Frontend CloudFront distribution domain name |
| <a name="output_frontend_s3_bucket_id"></a> [frontend\_s3\_bucket\_id](#output\_frontend\_s3\_bucket\_id) | Frontend S3 bucket ID (name) |
| <a name="output_frontend_website_url"></a> [frontend\_website\_url](#output\_frontend\_website\_url) | Frontend website URL |
| <a name="output_lambda_function_arn"></a> [lambda\_function\_arn](#output\_lambda\_function\_arn) | Lambda function ARN |
| <a name="output_lambda_function_name"></a> [lambda\_function\_name](#output\_lambda\_function\_name) | Lambda function name |
<!-- END_TF_DOCS -->
