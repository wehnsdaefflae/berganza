# coding=utf-8
import json

import requests

# API_URL = "https://api-inference.huggingface.co/models/gpt2"
API_URL = "https://api-inference.huggingface.co/EleutherAI/gpt-j-6B"


def query(payload: str, token: str) -> str:
    headers = {"Authorization": f"Bearer {token:s}"}
    data = json.dumps(payload)
    response = requests.request("POST", API_URL, headers=headers, data=data)
    return json.loads(response.content.decode("utf-8"))


def main():
    with open("resources/config.json", mode="r") as file:
        d = json.load(file)
    t = d["token"]
    data = query("Can you please let us know more details about your ", t)
    print(data)


if __name__ == "__main__":
    main()
