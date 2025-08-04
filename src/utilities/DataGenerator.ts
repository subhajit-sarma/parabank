import { faker } from "@faker-js/faker";
import { Cities } from "../constant/constant";

export class DataGenerator {

    public static getRandomElementFromArray(array: any[]){
        return array[Math.floor(Math.random()*array.length)]
    }
    


    public static getRandomUserDetails(){
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();
        let address = faker.location.streetAddress();
        let city_state = this.getRandomElementFromArray(Cities);
        let state = city_state.state;
        let city = city_state.city
        let zipCode = city_state.postalCode
        let ssn = faker.number.int({min: 10000, max:99999}).toString()
        let phoneNumber = faker.phone.number({style: "international"})
        let userName = firstName+'_'+lastName;
        return {firstName, lastName, address, city, state, zipCode, ssn, phoneNumber, userName}
    }

    public static getRandomPayeeDetails(){
        let payeeName = faker.person.fullName();
        let address = faker.location.streetAddress();
        let city_state = this.getRandomElementFromArray(Cities)
        let city = city_state.city;
        let state = city_state.state;
        let zipCode = city_state.postalCode;
        let phoneNumber = faker.phone.number({style: "international"})
        return {payeeName, address, city, state, zipCode, phoneNumber}
    }

}

// console.log(RandomDataGenerator.getRandomUserDetails())