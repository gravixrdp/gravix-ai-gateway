import urllib.request
import urllib.error
import json
import ssl
import unittest

SUPABASE_URL = "https://bwnynwyoojfdjkvuibdp.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bnlud3lvb2pmZGprdnVpYmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTQyMDYsImV4cCI6MjEwMjYzMDIwNn0.HXYahk4phAkmiu3pJQ9bzGB2JNnN3rgRTK4xiG8Sa7Y"

class TestDatabaseIntegration(unittest.TestCase):
    def setUp(self):
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def test_plans_table(self):
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/plans?select=*&order=price_cents.asc",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            }
        )
        with urllib.request.urlopen(req, context=self.ctx) as resp:
            data = json.loads(resp.read().decode())
            self.assertEqual(resp.status, 200)
            self.assertGreaterEqual(len(data), 4)
            plan_ids = [p["id"] for p in data]
            self.assertIn("free", plan_ids)
            self.assertIn("pro", plan_ids)

    def test_api_keys_table_exists(self):
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/api_keys?select=id&limit=1",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            }
        )
        with urllib.request.urlopen(req, context=self.ctx) as resp:
            self.assertEqual(resp.status, 200)

if __name__ == "__main__":
    unittest.main()
