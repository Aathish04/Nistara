import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.api_core import retry
import requests
import json
import time
from database import getUnclassifiedPostInformation, putExtractedInformation
# Or use `os.getenv('GOOGLE_API_KEY')` to fetch an environment variable.

genai.configure(api_key=GOOGLE_API_KEY)

with open("NistaraDB-token.json") as f:
    secrets = json.load(f)

GOOGLE_API_KEY = secrets["google_api_key"]


post_schema = glm.Schema(
    type=glm.Type.OBJECT,
    properties={
        "items": glm.Schema(
            type=glm.Type.ARRAY,
            items=glm.Schema(
                type=glm.Type.OBJECT,
                properties={
                    "itemName": glm.Schema(type=glm.Type.STRING),
                    "quantity": glm.Schema(type=glm.Type.INTEGER)
                }
            )
        ),
        "category": glm.Schema(type=glm.Type.STRING,enum=["REQUEST_ITEM","REQUEST_EVACUATION","REQUEST_SEARCH","REQUEST_FIRST_AID","OFFER","INFORMATION"],format="enum"),
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

model = genai.GenerativeModel(model_name='models/gemini-1.5-flash-latest')

def extract_event_data_from_post(post):
    details = "the items required, "
    text_image_describe_prompt = f"""Please Add to the Database {details} from the given post caption and media. post is {post}. Find the category based on the text content."""
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
#     post = {
#     "postID": "1",
#     "userID": "123456",
#     "textualInfo": '''
# Urgent help needed! 🚨 Please help us leave this place. 🙏 #CycloneRelief #HelpNeeded #Donate

#  ''',
 
#     "timestamp": "2024-01-01T10:00:00Z",
#     "geoLocation": "(40.712776, -74.005974)"
# }
    # print(extract_event_data_from_post(post))
    while True:
        post = getUnclassifiedPostInformation()
        print(post)
        if post:
            
            extracted = extract_event_data_from_post(post)
            print(extracted)
            putExtractedInformation(extracted,post)
            time.sleep(3)
    
