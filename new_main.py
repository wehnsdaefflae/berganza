# coding=utf-8
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


def main() -> None:
    # tokenizer = AutoTokenizer.from_pretrained("bigscience/bloom")
    # model = AutoModelForCausalLM.from_pretrained("bigscience/bloom", device_map="auto", torch_dtype="auto")
    tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-large")
    model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-large")

    initial_prompt = "Consider a conversation between Bob and Alice.\n"
    dialog = list()

    while True:
        question = input("Q: ")
        dialog.append("Bob: " + question)

        final_prompt = "How would Alice respond?\nAlice: "

        prompt = initial_prompt + "\n".join(dialog) + "\n" + final_prompt

        input_ids = tokenizer(prompt, return_tensors="pt").input_ids   # .to("cuda")
        outputs = model.generate(inputs=input_ids, max_new_tokens=100, num_beams=5, no_repeat_ngram_size=2, early_stopping=True)
        decoded = tokenizer.batch_decode(outputs, skip_special_tokens=True)
        answer = decoded[0]
        print(f"A: {answer:s}")
        dialog.append("Alice: " + answer)

        with open("resources/prompt.txt", mode="a") as file:
            print(f"{prompt:s}", file=file, end="")
            print(f"{answer:s}\n", file=file)


if __name__ == "__main__":
    main()
