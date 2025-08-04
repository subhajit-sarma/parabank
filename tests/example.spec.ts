import { test, expect } from '@playwright/test';
import { ApiUtilities } from '../src/utilities/ApiUtilities';
import { JsonUtilities } from '../src/utilities/JsonUtilities';


test("api validation", async()=>{
  let apiClient = new ApiUtilities("https://parabank.parasoft.com/parabank/services/bank/");
  apiClient.addHeader("test","123")
  let transactionId = "15475"
  let apiResponse = await apiClient.get("/transactions/"+transactionId)
  let id = JsonUtilities.getProperty(apiResponse, "$.id")
  console.log(id.toString().replace("[","").replace("]","").replace(" ",""))
})