"""
Local development server for Hangman Word Generator API
Runs the Lambda handler as a Flask API with Swagger UI for interactive testing
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import yaml
import sys
import os
import importlib.util

# Add lambda directory to path and import handler dynamically
lambda_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lambda')
sys.path.insert(0, lambda_dir)

# Import handler module
handler_path = os.path.join(lambda_dir, 'handler.py')
spec = importlib.util.spec_from_file_location("handler", handler_path)
handler_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(handler_module)
lambda_handler = handler_module.lambda_handler


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend testing

# Load OpenAPI spec
with open(os.path.join(os.path.dirname(__file__), 'openapi.yaml'), 'r') as f:
    openapi_spec = yaml.safe_load(f)
    # Update server URL to local
    openapi_spec['servers'] = [{'url': 'http://localhost:8000', 'description': 'Local development server'}]


@app.route('/')
def index():
    """Serve the Swagger UI interactive API documentation page.

    This endpoint returns a complete HTML page with embedded Swagger UI
    that loads the OpenAPI specification from /openapi.yaml.

    Returns:
        HTML string containing the Swagger UI interface
    """
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hangman Word Generator API</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <style>
            body { margin: 0; padding: 0; }
            .topbar { display: none; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
        <script>
            window.onload = function() {
                SwaggerUIBundle({
                    url: '/openapi.yaml',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                    ],
                    plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                    ],
                    layout: "StandaloneLayout"
                });
            };
        </script>
    </body>
    </html>
    '''


@app.route('/openapi.yaml')
def openapi():
    """Serve the OpenAPI 3.0 specification as JSON.

    The specification is loaded from openapi.yaml at startup and modified
    to point to the local development server (http://localhost:8000).

    Returns:
        JSON response containing the complete OpenAPI specification
    """
    return jsonify(openapi_spec)


@app.route('/word')
def get_word():
    """Generate a random filtered word for hangman games.

    This endpoint wraps the Lambda handler function to enable local testing
    with the same behavior as the deployed AWS Lambda. It converts Flask
    request arguments to Lambda event format and Lambda responses back to
    Flask responses.

    Query Parameters:
        length (int, optional): Exact word length (minimum: 3, default: 5)

    Returns:
        JSON response with word data (200) or error message (400/500)

    Example:
        GET /word?length=8

        Response:
        {
            "word": "ELEPHANT",
            "length": 8,
            "definition": "five-toed pachyderm",
            "attempts": 3
        }
    """
    # Convert Flask request to Lambda event format
    event = {
        'queryStringParameters': dict(request.args) if request.args else None
    }

    # Call Lambda handler
    response = lambda_handler(event, None)

    # Extract response
    status_code = response['statusCode']
    headers = response.get('headers', {})
    body = response['body']

    # Return Flask response
    flask_response = app.response_class(
        response=body,
        status=status_code,
        mimetype='application/json'
    )

    # Add headers
    for key, value in headers.items():
        flask_response.headers[key] = value

    return flask_response


@app.route('/health')
def health():
    """Health check endpoint for monitoring and load balancers.

    Returns a simple JSON response indicating the service is running.

    Returns:
        JSON object with status and service name

    Example:
        GET /health

        Response:
        {
            "status": "healthy",
            "service": "hangman-word-generator"
        }
    """
    return jsonify({'status': 'healthy', 'service': 'hangman-word-generator'})


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Hangman Word Generator API - Local Development Server")
    print("="*60)
    print("\nInteractive API Documentation:")
    print("   http://localhost:8000")
    print("\nAPI Endpoints:")
    print("   GET http://localhost:8000/word")
    print("   GET http://localhost:8000/word?length=8")
    print("\nHealth Check:")
    print("   GET http://localhost:8000/health")
    print("\n" + "="*60 + "\n")

    app.run(host='0.0.0.0', port=8000, debug=True)
