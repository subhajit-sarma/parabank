import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { PayeeInfo } from "../constant/constant";
import { ApiUtilities } from "../utilities/ApiUtilities";
import { truncateSync } from "fs";
import { JsonUtilities } from "../utilities/JsonUtilities";


export class AccountPage extends BasePage{

    private apiClient: ApiUtilities;

    constructor(public page : Page){
        super(page)
        this.apiClient = new ApiUtilities("https://parabank.parasoft.com/parabank/services/bank/")
    }


    private async navigateToLoggedInOverviewPage(){
        await this.navigateToUrl("https://parabank.parasoft.com/parabank/overview.htm")
    }

    async verifyNewAccountLink(){
        await this.navigateToLoggedInOverviewPage()
        await expect(this.page.locator("//a[@href='openaccount.htm']")).toBeVisible();
        await this.page.locator("//a[@href='openaccount.htm']").click()
        await expect(this.page.locator("//h1[(@class='title') and contains(text(), 'Open New Account')]")).toBeVisible();
    }

    async verifyAccountsOverviewLink(){
        await this.navigateToLoggedInOverviewPage()
        await expect(this.page.locator("//a[@href='overview.htm']")).toBeVisible();
        await this.page.locator("//a[@href='overview.htm']").click()
        await expect(this.page.locator("//h1[(@class='title') and contains(text(), 'Accounts Overview')]")).toBeVisible();
    }

    async verifyTransferFundsLink(){
        await this.navigateToLoggedInOverviewPage()
        await expect(this.page.locator("//a[@href='transfer.htm']")).toBeVisible();
        await this.page.locator("//a[@href='transfer.htm']").click()
        await expect(this.page.locator("//h1[(@class='title') and contains(text(), 'Transfer Funds')]")).toBeVisible();
    }

    async openNewAccount(accountType: string, accountNumber: string){
        await this.navigateToLoggedInOverviewPage();
        await this.page.locator("//a[@href='openaccount.htm']").click()
        await expect(this.page.locator("//h1[(@class='title') and contains(text(), 'Open New Account')]")).toBeVisible();
        await this.page.locator("#type").selectOption(accountType)
        await this.page.locator("#fromAccountId").selectOption(accountNumber);
        await this.page.getByRole("button", {name: "Open New Account"}).click()
        await expect(this.page.getByText("Account Opened!")).toBeVisible();
        let newAccountId = await this.page.locator("#newAccountId").textContent();
        expect(newAccountId).not.toBeNull();
        console.log(newAccountId)
        return newAccountId ? newAccountId : "";
    }

    async validateAccountOverview(accountNumber: string, balance: string, availableBalance: string){
        await this.navigateToLoggedInOverviewPage();
        let actualBalance = await this.page.locator("//a[contains(.,'"+accountNumber+"')]/parent::td/following-sibling::td[1]").textContent();
        let actualAvailableBalance = await this.page.locator("//a[contains(.,'"+accountNumber+"')]/parent::td/following-sibling::td[2]").textContent();
        expect(actualBalance?.replace("$","")).toEqual(balance)
        expect(actualAvailableBalance?.replace("$","")).toEqual(availableBalance)
    }

    async transferfromAccount(fromAccountNumber: string, toAccountNumber: string, amount: number){
        await this.verifyTransferFundsLink();
        await this.page.locator("#amount").fill(amount.toString());
        await this.page.selectOption("#fromAccountId", {value: fromAccountNumber})
        await this.page.selectOption("#toAccountId", {value: toAccountNumber})
        await this.page.getByRole("button", {name: "transfer"}).click()
        await this.page.locator("//p[contains(.,' has been transferred from account #')]").isVisible();
    }

    async payBillToAnotherAccount(fromAccountNumber: string, payeeAccountNumber: string, payee: PayeeInfo, amount: string ){
        await this.verifyAccountsOverviewLink();
        await this.page.locator("//a[@href='billpay.htm']").click()
        await this.page.locator("//h1[contains(., 'Bill Payment Service')]").isVisible();
        await this.page.locator("input[name='payee.name']").fill(payee.payeeName);
        await this.page.locator("input[name=payee\\.address\\.street]").fill(payee.address);
        await this.page.locator("input[name=payee\\.address\\.city]").fill(payee.city);
        await this.page.locator("input[name=payee\\.address\\.state]").fill(payee.state);
        await this.page.locator("input[name=payee\\.address\\.zipCode]").fill(payee.zipCode);
        await this.page.locator("input[name=payee\\.phoneNumber]").fill(payee.phoneNumber);
        await this.page.locator("input[name=payee\\.accountNumber]").fill(payeeAccountNumber);
        await this.page.locator("input[name=verifyAccount]").fill(payeeAccountNumber);
        await this.page.locator("select[name='fromAccountId']").selectOption(fromAccountNumber);
        await this.page.locator("input[name='amount']").fill(amount.toString());
        const sendPaymentBtn =this.page.getByRole('button', { name: 'SEND PAYMENT' });
        console.log("enable", await sendPaymentBtn.isEnabled())
        console.log("visible", await sendPaymentBtn.isVisible())
        await this.page.waitForLoadState();
        await this.page.getByRole('button', {name: 'SEND PAYMENT'}).click({force: true})
        await this.validateBillPaymentScreen(payee.payeeName, fromAccountNumber, amount)
    }

    async validateBillPaymentScreen(payeeAccountName: string, fromAccountName: string, amount: string){
        await expect(this.page.locator("//p[contains(.,' Bill Payment to "+payeeAccountName+" in the amount of $"+amount+" from account "+fromAccountName+" was successful')]")).toBeVisible();
    }

    async validateTransactionFromAccount(transactionId: string, amount: number){
        let apiResponse = await this.apiClient.get("transactions/"+transactionId)
        let actualAmount = (JsonUtilities.getProperty(apiResponse, "$.amount")).toString().replace("[","").replace("]","").replace(" ","");
        expect(actualAmount).toEqual(amount.toString())
    }

    async getTransactionId(accountNumber: string, amount: string, payeeName: string){
       await this.navigateToUrl("https://parabank.parasoft.com/parabank/activity.htm?id="+accountNumber);
       await this.page.locator("//a[contains(text(), 'Bill Payment to "+payeeName+"')]").click()
       let transactionId = await this.page.locator("//td[contains(., 'Transaction ID')]/following-sibling::td").textContent()
       return transactionId? transactionId: "";
    }
}