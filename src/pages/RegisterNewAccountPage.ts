import { Page } from "playwright";
import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegisterNewAccount extends BasePage{

    constructor(page: Page){
        super(page)
    }
    
    async enterFirstName(firstName : string){
        await this.page.locator('#customer\\.firstName').fill(firstName)
    }

    async enterLastName(lastName : string){
        await this.page.locator('#customer\\.lastName').fill(lastName)
    }

    async enterAddressDetails(street: string, city: string, state: string, zipCode: string){
        await this.page.locator('#customer\\.address\\.street').fill(street)
        await this.page.locator('#customer\\.address\\.city').fill(city)
        await this.page.locator('#customer\\.address\\.state').fill(state)
        await this.page.locator('#customer\\.address\\.zipCode').fill(zipCode)
    }

    async enterPhoneNumber(phone: string){
        await this.page.locator('#customer\\.phoneNumber').fill(phone)
    }

    async enterUserName(userName : string){
        await this.page.locator('#customer\\.username').fill(userName)
    }

    async enterPassword(password : string){
        await this.page.locator('#customer\\.password').fill(password)
        await this.page.locator('#repeatedPassword').fill(password)
    }

    async enterSSN(ssn: string){
        await this.page.locator('#customer\\.ssn').fill(ssn)
    }
    async clickOnRegister(){
        await this.page.getByRole("button", {name: "Register"}).click();
        await expect(this.page.getByText("Your account was created successfully. You are now logged in.")).toBeVisible();
    }

    async getFirstAccountNumber(){
        await this.navigateToUrl("https://parabank.parasoft.com/parabank/overview.htm")
        let firstAccountNumber = await this.page.locator("(//a[contains(@href,'activity.htm')])[1]").textContent()
        return firstAccountNumber ? firstAccountNumber : "";
    }

}