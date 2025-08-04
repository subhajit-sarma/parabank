import { test as base, Page } from "@playwright/test";
import { DataGenerator } from "../utilities/DataGenerator";
import { RegisterNewAccount } from "../pages/RegisterNewAccountPage";
import { UsersType } from "../constant/constant";



type loginAsUser = {
  loggedInUser: {page: Page, user: UsersType, firstAccountNumber: string};
};

export const test = base.extend<loginAsUser>({
  loggedInUser: async ({ browser }, use) => {
    const context = await browser.newContext();
    console.log("Inside fixture");
      let user: UsersType = DataGenerator.getRandomUserDetails();
      const page = await context.newPage();
      let registerNewUser = new RegisterNewAccount(page);
      await registerNewUser.navigateToUrl(
        "https://parabank.parasoft.com/parabank/register.htm"
      );
      await registerNewUser.enterFirstName(user.firstName);
      await registerNewUser.enterLastName(user.lastName);
      await registerNewUser.enterAddressDetails(user.address, user.city, user.state, user.zipCode);
      await registerNewUser.enterSSN(user.ssn);
      await registerNewUser.enterPhoneNumber(user.phoneNumber);
      await registerNewUser.enterUserName(user.userName);
      await registerNewUser.enterPassword("Welcome123");
      await registerNewUser.clickOnRegister();
      let firstAccountNumber = await registerNewUser.getFirstAccountNumber()
      await use({page, user, firstAccountNumber})
  },
});

export default test;
