import { Page } from "playwright";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage{

    constructor(public page : Page){
        super(page)
    }

    async enterUserName(name : string){
        await this.page.locator('input[name="username"]').fill(name);
    }

    async enterPassword(password : string){
        await this.page.locator('input[name="password"]').fill(password);
    }

    async clickLogIn(){
        await this.page.getByRole("button", {name: "Log In"}).click();
    }

    async loginAsUser(userName: string, password: string){
        await this.navigateToUrl("https://parabank.parasoft.com/parabank/index.htm")
        await this.enterUserName(userName);
        await this.enterPassword(password)
        await this.clickLogIn();
    }
    
}