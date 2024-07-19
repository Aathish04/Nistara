import torch
from IndicTransTokenizer import IndicProcessor
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from logging import getLogger, basicConfig, INFO
from dotenv import load_dotenv
from logging import DEBUG
from os import environ


load_dotenv()
ip = IndicProcessor(inference=True)

basicConfig(level=DEBUG)
logger = getLogger(__name__)
INSTANCEID:int = int(environ.get('INSTANCEID', -2))

tokenizer = AutoTokenizer.from_pretrained("ai4bharat/indictrans2-indic-en-dist-200M", trust_remote_code=True, cache_dir=".")
model = AutoModelForSeq2SeqLM.from_pretrained("ai4bharat/indictrans2-indic-en-dist-200M", trust_remote_code=True, cache_dir=".")

logger.info("Downloaded IndicTrans2 Model")

# sentences = [
#     "यह एक परीक्षण वाक्य है।"
# ]

def translate(sentence, src_lang, tgt_lang):
    logger.info(f"Translating sentence: {sentence}")

    batch = ip.preprocess_batch([sentence], src_lang=src_lang, tgt_lang=tgt_lang, show_progress_bar=True)
    batch = tokenizer(batch, padding="longest", truncation=True, max_length=256, return_tensors="pt")

    logger.info("Tokenization done")

    with torch.inference_mode():
        outputs = model.generate(**batch, num_beams=5, num_return_sequences=1, max_length=256)
    
    logger.info("Text generation done")

    with tokenizer.as_target_tokenizer():
    # This scoping is absolutely necessary, as it will instruct the tokenizer to tokenize using the target vocabulary.
    # Failure to use this scoping will result in gibberish/unexpected predictions as the output will be de-tokenized with the source vocabulary instead.
        outputs = tokenizer.batch_decode(outputs, skip_special_tokens=True, clean_up_tokenization_spaces=True)

    logger.info("Batch decode done")
    outputs = ip.postprocess_batch(outputs, lang=tgt_lang)
    logger.info(f"Postprocess batch done by translator {INSTANCEID}")
    logger.info(f"Translated sentence: {outputs[0]}")
    return outputs[0]


if __name__ == "__main__":
    src = 'hin_Deva'
    trg = 'eng_Latn'
    translate("यह एक परीक्षण वाक्य है।",src,trg)