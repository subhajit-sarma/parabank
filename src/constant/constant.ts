export const Cities = [
  { city: "Melbourne", state: "VIC", postalCode: "3000" },
  { city: "Sydney", state: "NSW", postalCode: "4000" },
  { city: "Brisbane", state: "QLD", postalCode:"5000"},
];

export type UsersType = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string;
  phoneNumber: string;
  userName: string;
};

export type PayeeInfo= {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}
