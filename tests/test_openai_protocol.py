import json
import unittest

def mock_openai_request_transformer(payload):
    model = payload.get("model", "gpt-4o")
    messages = payload.get("messages", [])
    stream = payload.get("stream", False)
    
    if not messages:
        return {"error": "messages required", "status": 400}
        
    prompt_tokens = sum(len(str(m.get("content", ""))) // 4 for m in messages)
    estimated_completion_tokens = 120
    
    response = {
        "id": "chatcmpl_mock_grx_12345",
        "object": "chat.completion",
        "created": 1789474946,
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "Gravix AI Gateway response successfully routed to edge."
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": prompt_tokens,
            "completion_tokens": estimated_completion_tokens,
            "total_tokens": prompt_tokens + estimated_completion_tokens
        }
    }
    return response

class TestOpenAIProtocol(unittest.TestCase):
    def test_valid_request(self):
        payload = {
            "model": "claude-3-7-sonnet",
            "messages": [{"role": "user", "content": "Hello Gravix Gateway"}]
        }
        res = mock_openai_request_transformer(payload)
        self.assertEqual(res["model"], "claude-3-7-sonnet")
        self.assertIn("usage", res)
        self.assertGreater(res["usage"]["total_tokens"], 0)
        self.assertEqual(res["choices"][0]["message"]["role"], "assistant")

    def test_missing_messages(self):
        payload = {"model": "gpt-4o"}
        res = mock_openai_request_transformer(payload)
        self.assertEqual(res.get("status"), 400)

if __name__ == "__main__":
    unittest.main()
