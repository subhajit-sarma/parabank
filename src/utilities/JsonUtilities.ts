import { error } from "console";
import jp from "jsonpath"


export class JsonUtilities {

    public static getProperty(jsonBody: object, query: string){
        let result = jp.query(jsonBody, query);
        return result;
    }

}