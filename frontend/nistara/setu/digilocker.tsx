import axios from 'axios'
import { Credential } from './env';

const cred = new Credential;
const CLIENT_ID:string = cred.CLIENT_ID
const CLIENT_SECRET:string = cred.CLIENT_SECRET
const PRODUCT_INSTANCE_ID:string = cred.PRODUCT_INSTANCE_ID

export class setuClient {
    baseUrl: string;
    headers: object;

    constructor(){
        this.baseUrl = "https://dg-sandbox.setu.co"
        this.headers = {
            'Content-Type':'application/json',
            'x-client-id':CLIENT_ID,
            'x-client-secret':CLIENT_SECRET,
            'x-product-instance-id':PRODUCT_INSTANCE_ID
        }
    }

    async getDigilockerRequest(){
        try{
            const payload = {
                redirectUrl: "https://setu.co"
            }
            const response = await axios.post(`${this.baseUrl}/api/digilocker`, payload, { headers: this.headers });
            return response.data
        }catch(e){
            console.error(e)
            return {message: "Failed to retrieve Digilocker Request Id"}
        }
    }
}