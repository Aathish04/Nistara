from os import environ
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.api_core import retry
import requests
import json
import time
from database import getUnclassifiedPostInformation, putExtractedInformation, insertData
# Or use `os.getenv('GOOGLE_API_KEY')` to fetch an environment variable.

from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = environ.get("GEMINI_API_KEY","No-Key")
genai.configure(api_key=GEMINI_API_KEY)

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
                    "class" :   glm.Schema(type=glm.Type.STRING,enum=["FOOD_AND_WATER","EMERGENCY_LIGHTING_AND_COMMUNICATION","HEALTH_AND_HYGIENE","TOOLS_AND_EQUIPMENT","ENTERTAINMENT","CLOTHING_AND_SHELTER","SAFETY_AND_PROTECTION"],format="enum")
                }
            )
        ),
        "category": glm.Schema(type=glm.Type.STRING,enum=["REQUEST_ITEM","REQUEST_EVACUATION","REQUEST_SEARCH","OFFER","INFORMATION"],format="enum"),
       
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


def flatten_post_contents_for_gemini(prompt, post):
    contents = [prompt]
    # Ensure the multimediaURL key exists before iterating
    if "multimediaURL" in post:
        for image in post["multimediaURL"]:
            contents.append(
                {
                    "data": requests.get(image["url"]).content,
                    "mime_type": image["mimetype"]
                }
            )
    return contents


def extract_event_data_from_post(post):
    text_image_describe_prompt = f"""
    You are an information extraction system. Your task is to extract information from a given post and categorize it accordingly. The possible categories for the post are:

REQUEST_ITEM
REQUEST_EVACUATION
REQUEST_SEARCH
OFFER
INFORMATION
For each item extracted from the post, assign it to one of the following classes:

FOOD_AND_WATER
EMERGENCY_LIGHTING_AND_COMMUNICATION
HYGIENE
MEDICINE
TOOLS_AND_EQUIPMENT
CLOTHING_AND_SHELTER
SAFETY_AND_PROTECTION
The post details are given by {post}. Your task is to:

Identify the category of the post.
Extract the items required along with their quantities.
Assign the appropriate class to each identified item.
Ensure that all data is accurately recorded and categorized within the database."""
    
    contents = flatten_post_contents_for_gemini(text_image_describe_prompt, post)
    #print(contents)
    fnresult = model.generate_content(
        contents=contents,
        request_options={'retry': retry.Retry()},
        tools=[get_info],
        tool_config={'function_calling_config': 'ANY'}
    )
    functioncalldata = fnresult.candidates[0].content.parts[0].function_call
    eventdata = type(functioncalldata).to_dict(functioncalldata)
    #return eventdata
    if eventdata["args"]["post"] is None:
        return None
    return eventdata["args"]["post"]

if __name__ == "__main__":

    while True:
        post = getUnclassifiedPostInformation()
        print(post)
        if post:
            
            extracted = extract_event_data_from_post(post)
            print(extracted)
            putExtractedInformation(extracted,post)
            time.sleep(3)
        else:
            print("DONE!")
            break

