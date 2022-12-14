# coding=utf-8
import json
from typing import Any

import requests
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


class TransformerModel:
    def __init__(self, model_name: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    def predict(self, prompt: str, **parameters: Any) -> str:
        input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
        outputs = self.model.generate(inputs=input_ids, **parameters)
        decoded = self.tokenizer.batch_decode(outputs, skip_special_tokens=True)
        return decoded[0]


class InferenceModel:
    def __init__(self, model_name: str):
        self.api_url = f"https://api-inference.huggingface.co/models/{model_name:s}"
        with open("resources/config.json", mode="r") as file:
            d = json.load(file)
            self.token = d["token"]

    def __query(self, payload: str, parameters: dict[str, Any]) -> list[str] | dict[str, str]:
        headers = {"Authorization": f"Bearer {self.token:s}"}
        response = requests.post(self.api_url, headers=headers, json={"inputs": payload, "parameters": parameters})
        return response.json()

    def predict(self, prompt: str, **parameters: Any) -> str:
        data = self.__query(prompt, parameters)
        first_element = data[0]
        response = first_element.get("generated_text")
        if response is None:
            raise RuntimeError(str(data))
        return response


def main() -> None:
    parameters = {
        # "max_length": None,
        # "max_new_tokens": 100,
        "num_beams": 5,
        "no_repeat_ngram_size": 2,
        "early_stopping": True
    }

    # tokenizer = AutoTokenizer.from_pretrained("bigscience/bloom")
    # model = AutoModelForCausalLM.from_pretrained("bigscience/bloom", device_map="auto", torch_dtype="auto")

    # model = TransformerModel("google/flan-t5-large")
    model = InferenceModel("google/flan-t5-xl")

    initial_prompt = "Consider a conversation between Bob and Alice.\n"
    dialog = list()

    while True:
        question = input("Q: ")
        dialog.append("Bob: " + question)

        final_prompt = "How would Alice respond?\nAlice: "

        prompt = initial_prompt + "\n".join(dialog) + "\n" + final_prompt

        answer = model.predict(prompt, **parameters)
        answer = answer.removeprefix("Bob:").removeprefix("Alice:").strip()
        print(f"A: {answer:s}")
        dialog.append("Alice: " + answer)

        with open("resources/prompt.txt", mode="a") as file:
            print(f"{prompt:s}", file=file, end="")
            print(f"{answer:s}\n", file=file)


if __name__ == "__main__":
    main()
