import { request } from "@playwright/test";



export class ApiUtilities{
    private baseUrl: string;
    private header: Record<string, string> = {}

    constructor(baseUrl: string){
        this.baseUrl = baseUrl
        this.header["Accept"] = "application/json"
    }

    public addHeader(key: string, value: string){
        this.header[key] = value;
    }

    async get(endPoint: string){
        console.log("performing Get call to :", this.baseUrl+endPoint)
        console.log(this.header)
        const  response = (await request.newContext()).get(this.baseUrl+endPoint, {headers: this.header})
        const jsonResponseBody = await (await response).json();
        console.log(jsonResponseBody)
        return jsonResponseBody;
    }
}