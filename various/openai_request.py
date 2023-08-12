# coding=utf-8
from __future__ import annotations

import datetime
import json
from pathlib import Path
import unidecode

import openai


class Berganza:
    def __init__(self, config_path: str, log_path: str | None = "logs/") -> None:
        with open(config_path, mode="r") as file:
            config = json.load(file)

        self.log_path: Path | None = None
        if log_path is not None and len(log_path) >= 1:
            self.log_path = Path(log_path)
            print(f"logging conversations to {self.log_path.resolve()}.")
            self.log_path.mkdir(parents=True, exist_ok=True)

        openai.api_key = config["openai_secret"]
        openai.organization = config["organization_id"]

        self.model_id = config["model_id"]
        self.indicator_string = config["indicator_string"]

        self.parameters = config["parameters"]
        # After you’ve fine-tuned a model, remember that your prompt has to end with the indicator string `[END_P]` for the model to start generating completions,
        # rather than continuing with the prompt. Make sure to include `stop=["[END_C]"]` so that the generated texts ends at the expected place.

    def ask(self, question: str, user_id: str) -> str:
        # https://beta.openai.com/docs/api-reference/completions/create
        response = openai.Completion.create(
            **self.parameters,
            prompt=unidecode.unidecode(question) + self.indicator_string,
            user=user_id,
            model=self.model_id)

        choices = response["choices"]
        choice_first = choices[0]
        answer = choice_first["text"]

        now = datetime.datetime.now()
        with (self.log_path / f"{user_id:s}.log").open(mode="a", encoding="utf-8") as file:
            file.write(f"{now:%Y-%m-%d %H:%M:%S}:\n[prompt] {question:s}\n\n[reply] {answer:s}\n")

        return answer


def main():
    b = Berganza("../resources/config.json")
    question = "Du bist ein Hund mit dem Namen Berganza."
    response = b.ask(question, "test_user")
    print(response)


if __name__ == "__main__":
    main()
