# coding=utf-8
import json

import requests

API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-xl"


def query(payload: dict[str, str], token: str) -> list[str] | dict[str, str]:
    headers = {"Authorization": f"Bearer {token:s}"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


def main():
    while True:
        with open("resources/config.json", mode="r") as file:
            d = json.load(file)
        data, = query({"inputs": "Can you please let us know more details about your "}, d["token"])
        print(data)
        if data.get("generated_text") is not None:
            break


if __name__ == "__main__":
    main()
