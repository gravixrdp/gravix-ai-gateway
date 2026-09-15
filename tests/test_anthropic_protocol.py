import json
import unittest

def mock_anthropic_message_transformer(payload, headers):
    anthropic_version = headers.get("anthropic-version")
    if not anthropic_version:
        anthropic_version = "2023-06-01"
        
    model = payload.get("model", "claude-3-7-sonnet")
    messages = payload.get("messages", [])
    
    if not messages:
        return {"error": {"type": "invalid_request_error", "message": "messages required"}, "status": 400}
        
    input_tokens = sum(len(str(m.get("content", ""))) // 4 for m in messages)
    output_tokens = 85
    
    response = {
        "id": "msg_mock_grx_98765",
        "type": "message",
        "role": "assistant",
        "model": model,
        "content": [
            {
                "type": "text",
                "text": "Gravix Anthropic message protocol validated for Claude Code CLI."
            }
        ],
        "stop_reason": "end_turn",
        "stop_sequence": None,
        "usage": {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens
        }
    }
    return response

class TestAnthropicProtocol(unittest.TestCase):
    def test_anthropic_messages_format(self):
        payload = {
            "model": "claude-3-7-sonnet",
            "messages": [{"role": "user", "content": "Write test cases for proxy"}]
        }
        headers = {"anthropic-version": "2023-06-01", "x-api-key": "grx_live_test"}
        res = mock_anthropic_message_transformer(payload, headers)
        self.assertEqual(res["type"], "message")
        self.assertEqual(res["role"], "assistant")
        self.assertIn("input_tokens", res["usage"])
        self.assertEqual(res["content"][0]["type"], "text")

    def test_empty_messages(self):
        res = mock_anthropic_message_transformer({}, {})
        self.assertEqual(res.get("status"), 400)

if __name__ == "__main__":
    unittest.main()
