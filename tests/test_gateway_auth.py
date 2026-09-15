import urllib.request
import urllib.error
import json
import hashlib
import ssl
import unittest

SUPABASE_URL = "https://bwnynwyoojfdjkvuibdp.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnlud3lvb2pmZGprdnVpYmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTQyMDYsImV4cCI6MjEwMjYzMDIwNn0.HXYahk4phAkmiu3pJQ9bzGB2JNnN3rgRTK4xiG8Sa7Y"

class TestGatewayAuth(unittest.TestCase):
    def setUp(self):
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def test_invalid_key_rejection(self):
        dummy_hash = hashlib.sha256("grx_live_non_existent_key_12345".encode()).hexdigest()
        body = json.dumps({"p_key_hash": dummy_hash}).encode()
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/rpc/authenticate_and_check_quota",
            data=body,
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json"
            }
        )
        with urllib.request.urlopen(req, context=self.ctx) as resp:
            data = json.loads(resp.read().decode())
            self.assertEqual(resp.status, 200)
            self.assertFalse(data.get("valid"))
            self.assertEqual(data.get("code"), "INVALID_KEY")

if __name__ == "__main__":
    unittest.main()
