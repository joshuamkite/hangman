"""
Pytest configuration for hangman word generator tests
"""
import sys
import os

# Add lambda directory to path so tests can import handler
lambda_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'lambda')
sys.path.insert(0, lambda_dir)
