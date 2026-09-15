import unittest
import sys
import os

# Import all test suites
from test_database import TestDatabaseIntegration
from test_gateway_auth import TestGatewayAuth
from test_openai_protocol import TestOpenAIProtocol
from test_anthropic_protocol import TestAnthropicProtocol
from test_load_balancer import TestLoadBalancer

def run_suite():
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    suite.addTests(loader.loadTestsFromTestCase(TestDatabaseIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestGatewayAuth))
    suite.addTests(loader.loadTestsFromTestCase(TestOpenAIProtocol))
    suite.addTests(loader.loadTestsFromTestCase(TestAnthropicProtocol))
    suite.addTests(loader.loadTestsFromTestCase(TestLoadBalancer))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "="*60)
    print("GRAVIX AI GATEWAY — CONTINUOUS AUTOMATED TEST REPORT")
    print("="*60)
    print(f"Total Tests Run : {result.testsRun}")
    print(f"Total Failures  : {len(result.failures)}")
    print(f"Total Errors    : {len(result.errors)}")
    print(f"Overall Status  : {'✓ ALL SYSTEMS PASSING' if result.wasSuccessful() else '✗ TEST FAILURE DETECTED'}")
    print("="*60)
    
    if not result.wasSuccessful():
        sys.exit(1)

if __name__ == "__main__":
    run_suite()
