from dotenv import load_dotenv
import requests
load_dotenv()
import os

def get_digilocker_flow_url():
    url = "https://dg-sandbox.setu.co/api/digilocker"
    payload = {"redirectUrl": "https://commonly-liberal-porpoise.ngrok-free.app/digilocker_request_result_webhook"}
    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("post", url, json=payload, headers=headers)
    return response.json()

def get_document(request_id,docType,format,consent):
    url = f"https://dg-sandbox.setu.co/api/digilocker/{request_id}/document"

    payload = {
        "docType": docType,
        "format": format,
        "consent": consent
    }
    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("post", url, json=payload, headers=headers)
    return response.json()

def list_documents_available():
    url = f"https://dg-sandbox.setu.co/api/digilocker/documents"

    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("get", url, headers=headers)

    return response.json()

def get_aadhaar(request_id):
    url = f"https://dg-sandbox.setu.co/api/digilocker/{request_id}/aadhaar"

    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("get", url, headers=headers)
    return response.json()

def get_status(request_id):
    url = f"https://dg-sandbox.setu.co/api/digilocker/{request_id}/status"

    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("get", url, headers=headers)
    return response.json()


if __name__=="__main__":
    print(get_digilocker_flow_url())
    pass