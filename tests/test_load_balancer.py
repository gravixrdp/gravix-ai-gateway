import unittest
import time

class MockChannel:
    def __init__(self, name, fail_count=0):
        self.name = name
        self.fail_count = fail_count
        self.attempts = 0

    def call(self):
        self.attempts += 1
        if self.attempts <= self.fail_count:
            return {"error": "429 Rate Limit Exceeded", "status": 429}
        return {"data": f"Success from {self.name}", "status": 200}

def dispatch_with_failover(channels):
    errors = []
    for ch in channels:
        res = ch.call()
        if res.get("status") == 200:
            return res
        errors.append(res)
    return {"error": "All upstream channels exhausted", "details": errors, "status": 502}

class TestLoadBalancer(unittest.TestCase):
    def test_primary_channel_success(self):
        ch1 = MockChannel("Primary-Singapore", fail_count=0)
        ch2 = MockChannel("Backup-Tokyo", fail_count=0)
        res = dispatch_with_failover([ch1, ch2])
        self.assertEqual(res["status"], 200)
        self.assertEqual(res["data"], "Success from Primary-Singapore")
        self.assertEqual(ch1.attempts, 1)
        self.assertEqual(ch2.attempts, 0)

    def test_failover_to_backup_on_429(self):
        ch1 = MockChannel("Primary-Singapore", fail_count=1) # Fails with 429
        ch2 = MockChannel("Backup-Tokyo", fail_count=0)
        res = dispatch_with_failover([ch1, ch2])
        self.assertEqual(res["status"], 200)
        self.assertEqual(res["data"], "Success from Backup-Tokyo")
        self.assertEqual(ch1.attempts, 1)
        self.assertEqual(ch2.attempts, 1)

if __name__ == "__main__":
    unittest.main()
