from logging import getLogger, basicConfig, INFO
from os import environ
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.api_core import retry
import requests
import json
import time
from database import getUnclassifiedPostInformation, putExtractedInformation, insertData
from dotenv import load_dotenv

logger = getLogger(__name__)

load_dotenv()

LLM_API_KEY = environ.get("LLM_API_KEY", "No-Key")
genai.configure(api_key=LLM_API_KEY)

logger.info("Configured Google Generative AI with provided API key.")

ITEM_CLASSES = ["FOOD_AND_WATER", "EMERGENCY_LIGHTING_AND_COMMUNICATION", "HYGIENE", "TOOLS_AND_EQUIPMENT", "CLOTHING_AND_SHELTER", "SAFETY_AND_PROTECTION"]
POST_CATEGORIES = ["REQUEST_ITEM", "REQUEST_EVACUATION", "REQUEST_SEARCH", "OFFER", "INFORMATION"]
post_schema = glm.Schema(
    type=glm.Type.OBJECT,
    properties={
        "items": glm.Schema(
            type=glm.Type.ARRAY,
            items=glm.Schema(
                type=glm.Type.OBJECT,
                properties={
                    "itemName": glm.Schema(type=glm.Type.STRING),
                    "quantity": glm.Schema(type=glm.Type.INTEGER),
                    "class": glm.Schema(
                        type=glm.Type.STRING,
                        enum=ITEM_CLASSES,
                        format="enum"
                    )
                }
            )
        ),
        "category": glm.Schema(
            type=glm.Type.STRING,
            enum=POST_CATEGORIES,
            format="enum"
        ),
    },
    description="Information to be extracted from post"
)

get_info = glm.FunctionDeclaration(
    name="get_info",
    description="Get information from post",
    parameters=glm.Schema(
        type=glm.Type.OBJECT,
        properties={
            'post': post_schema,
        }
    )
)

model = genai.GenerativeModel(model_name='models/gemini-1.5-flash-latest')
logger.info("Initialized GenerativeModel with gemini-1.5-flash-latest.")

def flatten_post_contents_for_gemini(prompt, post):
    contents = [prompt]
    if "multimediaURL" in post:
        for image in post["multimediaURL"]:
            try:
                contents.append(
                    {
                        "data": requests.get(image["url"]).content,
                        "mime_type": image["mimetype"]
                    }
                )
                logger.info(f"Added image content from {image['url']}")
            except requests.RequestException as e:
                logger.error(f"Failed to fetch image from {image['url']}: {e}")
    return contents

def extract_event_data_from_post(post):
    text_image_describe_prompt = f"""
    You are an information extraction system. Your task is to extract information from a given post and categorize it accordingly. The possible categories for the post are:

{','.join(POST_CATEGORIES)}
For each item extracted from the post, assign it to one of the following classes:

{','.join(ITEM_CLASSES)}
The post details are given by {post}. Your task is to:

Identify the category of the post.
Extract the items required along with their quantities.
Assign the appropriate class to each identified item.
Ensure that all data is accurately recorded and categorized within the database."""
    
    contents = flatten_post_contents_for_gemini(text_image_describe_prompt, post)
    logger.debug(f"Flattened post contents: {contents}")

    try:
        fnresult = model.generate_content(
            contents=contents,
            request_options={'retry': retry.Retry()},
            tools=[get_info],
            tool_config={'function_calling_config': 'ANY'}
        )
        functioncalldata = fnresult.candidates[0].content.parts[0].function_call
        eventdata = type(functioncalldata).to_dict(functioncalldata)
        logger.info(f"Extracted event data: {eventdata}")
        if eventdata["args"]["post"] is None:
            logger.warning("No data extracted from post.")
            return None
        return eventdata["args"]["post"]
    except Exception as e:
        logger.error(f"Error during content generation: {e}")
        return None

if __name__ == "__main__":
    while True:
        post = getUnclassifiedPostInformation()
        if post:
            logger.info(f"Processing post: {post['id']}")
            extracted = extract_event_data_from_post(post)
            if extracted:
                logger.info(f"Extracted data: {extracted}")
                putExtractedInformation(extracted, post)
            else:
                logger.warning("No information extracted from post.")
        else:
            logger.info("No more unclassified posts. Waiting for more posts.")
        time.sleep(3)
