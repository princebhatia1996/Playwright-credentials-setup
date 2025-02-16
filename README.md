# Playwright Encrypt and Decrypt Credentials Util

This project provides a set of utilities for encrypting and decrypting environment variables using TypeScript. It is designed to work seamlessly with Playwright for testing purposes.

//put the folder structure here

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/princebhatia1996/Playwright-credentials-setup
cd playwright-encryption-app
npm install
```

## Testing

To run the tests, use the following command:

```bash
npm test
```

This will execute the test cases defined in `src/tests/example.spec.ts`, ensuring that the encryption and decryption functions work as expected.

## Usage

### Example Usage

- In the config file, put your password as follows:
  ```json
  {
    "type": "Admin-user",
    "username": "standard_user",
    "password": "test_password"
  }
  ```
- Then run `yarn encrypt`. This will update the file and give you the output something like this:
  ```json
  {
    "type": "Admin-user",
    "username": "standard_user",
    "password": {
      "iv": "115827774b57bf5f0c15560029a2d39c",
      "content": "174650e719861dc72b9ddbf0"
    }
  }
  ```
- To see the original password, run the script `yarn decrypt` and it will display the original password decrypted in your console.
- Use the login util in `src/util/login.ts` which takes in a username/email ID you have defined in your `dev.config.json` file. It will find this user and then login with the decrypted password.
