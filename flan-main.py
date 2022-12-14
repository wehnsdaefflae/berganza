# pip install accelerate
from transformers import T5Tokenizer, T5ForConditionalGeneration


#https://github.com/huggingface/transformers/tree/main/examples/flax/language-modeling
#https://huggingface.co/docs/transformers/model_doc/t5
#https://github.com/google-research/t5x
#https://huggingface.co/google/flan-t5-xxl?text=Answer+the+following+yes%2Fno+question.+Can+you+write+a+whole+Haiku+in+a+single+tweet%3F#TL;DR
#https://github.com/google-research/t5x/blob/main/docs/models.md#flan-t5-checkpoints

tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-xxl")
model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-xxl", device_map="auto")

input_text = "translate English to German: How old are you?"
input_ids = tokenizer(input_text, return_tensors="pt").input_ids.to("cuda")

outputs = model.generate(input_ids)
print(tokenizer.decode(outputs[0]))
