import { expect, Page } from "@playwright/test"
import test from "../src/fixtures/loginFixtures"
import { PayeeInfo, UsersType } from "../src/constant/constant"
import { LoginPage } from "../src/pages/LogInPage";
import { AccountPage } from "../src/pages/AccountPage";
import { DataGenerator } from "../src/utilities/DataGenerator";


let bankPage: Page;
let testPage : Page
let user: UsersType;
let firstAccountNumber: string;


test.describe.serial("Para bank test", ()=>{

    
    let newAccountNumber: string;
    let payee: PayeeInfo = DataGenerator.getRandomPayeeDetails();
    let transferAmount = 15;
    let amountStr = transferAmount.toFixed(2);

    test.beforeAll(async({browser, loggedInUser})=>{
        bankPage = loggedInUser.page;
        user = loggedInUser.user;
        firstAccountNumber = loggedInUser.firstAccountNumber;
        console.log(user.userName);
        let browserContext = await browser.newContext();
        testPage = await browserContext.newPage();
        let loginPageObj = new LoginPage(testPage);
        await loginPageObj.loginAsUser(user.userName, "Welcome123")
    })

    // test.afterAll(async()=>{
    //     if(testPage){
    //         testPage.close();
    //     }
    // })

    test("Global links check", async()=>{   
        let accountPagePbj = new AccountPage(bankPage)
        await accountPagePbj.verifyNewAccountLink();
        await accountPagePbj.verifyAccountsOverviewLink();
        await accountPagePbj.verifyTransferFundsLink();
    })

    test("Create savings account and transfer from that account", async()=>{
        let accountPagePbj = new AccountPage(testPage)
        newAccountNumber = await accountPagePbj.openNewAccount("CHECKING", firstAccountNumber)
        await accountPagePbj.validateAccountOverview(newAccountNumber, "100.00", "100.00")
        await accountPagePbj.transferfromAccount(newAccountNumber, firstAccountNumber, 15);
        await accountPagePbj.validateAccountOverview(newAccountNumber, "85.00", "85.00")
    })

    test("pay bill to another account ", async()=>{
        let accountPagePbj = new AccountPage(testPage);
        let toAccountNumber = "12345"
        await accountPagePbj.payBillToAnotherAccount(newAccountNumber,toAccountNumber, payee, amountStr);
    })

    test("validate transactions via api", async()=>{
        let accountPagePbj = new AccountPage(testPage)
        let transactionId = await accountPagePbj.getTransactionId(newAccountNumber, "15.00", payee.payeeName)
        expect(transactionId).not.toBe(null);
        await accountPagePbj.validateTransactionFromAccount(transactionId, transferAmount)
    })

})

    