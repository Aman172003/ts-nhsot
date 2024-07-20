# ts-nHost

A sample App using Typescript and using nhost.io as Backend as a service

## Setup application

Clone the repository and move to ts-nhost folder
Create a .env file which should contain HASURA_ADMIN_SECRET and GRAPHQL_ENDPOINT

### Below are the steps to get HASURA_ADMIN_SECRET and GRAPHQL_ENDPOINT

-> Go to https://nhost.io/
-> Sign Up/Sign In and create new project
-> Go to Hasura Console and open Hasura
-> Get the x-hasura-admin-secret and GraphQL Endpoint and name them as HASURA_ADMIN_SECRET and GRAPHQL_ENDPOINT respectively in .env

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/ts-nhost

# Install the dependencies
npm install
```

# Installing Keploy

Let's get started by setting up the Keploy alias with this command:

```sh
curl -O https://raw.githubusercontent.com/keploy/keploy/main/keploy.sh && source keploy.sh
```

## Using Keploy :

There are 2 ways you can run this sample application.

1. [Natively on Linux/WSL](#natively-on-ubuntuwsl)
2. [Using Docker](#running-sample-app-using-docker)

# Natively on Ubuntu/WSL

## Let's install certificates

1. **Install required packages:**

   ```sh
   sudo apt-get install -y --no-install-recommends ca-certificates curl
   ```

   This command installs necessary packages without additional recommended packages.

2. **Download CA certificate:**

   ```sh
   curl -o ca.crt https://raw.githubusercontent.com/keploy/keploy/main/pkg/core/proxy/asset/ca.crt
   ```

   This command downloads the CA certificate to `ca.crt`.

3. **Download setup script:**

   ```sh
   curl -o setup_ca.sh https://raw.githubusercontent.com/keploy/keploy/main/pkg/core/proxy/asset/setup_ca.sh
   ```

   This command downloads the setup script to `setup_ca.sh`.

4. **Make the setup script executable:**

   ```sh
   chmod +x setup_ca.sh
   ```

   This command changes the permissions of `setup_ca.sh` to make it executable.

5. **Run the setup script:**
   ```sh
   source ./setup_ca.sh
   ```
   This command executes the setup script in the current shell.

## Capture the test cases

1. **Start recording tests:**
   ```bash
   sudo -E env "PATH=$PATH" keploybin record -c 'ts-node src/app.ts'
   ```

## Let's Generate the test cases

Make API Calls using Hoppscotch, Postman or cURL command. Keploy will capture those calls to generate test suites containing test cases and data mocks.

1. **Create User**

   ```bash
   curl --location 'http://localhost:3000/users' \
   --header 'Content-Type: application/json'
   ```

   You will get the following output:

   ```json
   { "message": "User was registered successfully!" }
   ```

2. **Observe terminal output:**
   Let's go ahead and create a few more test cases for different endpoints!

## Running the test cases

1. **Start the application:**

   ```bash
   ts-node src/app.ts
   ```

2. **Run the recorded tests:**

   ```bash
   sudo -E env "PATH=$PATH" keploybin test -c 'ts-node src/app.ts' --delay 10
   ```

3. **Observe test run results:**
   _Voila!! Our test cases have passed 🌟_

---

# Running the app using docker

Since we have to setup our app using docker

## Capture the testcases

We will run the keploy in record mode with docker-compose to start our application:-

```bash
keploy record -c "sudo docker-compose up" --containerName "ts-nhost"

```

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or curl command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

1. Create User

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"user",
    "email":"user@keploy.io",
    "password":"1234"
}'
```

we will get the output:

```json
{ "message": "User was registered successfully!" }
```

We will get the following output in our terminal

![Testcase](./img/record.png)

Let's go ahead create few more testcases for different endpoints!

2. Create Admin User

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"admin",
    "email":"admin@keploy.io",
    "password":"1234",
    "role":["admin"]
}'
```

we will get the output:

```json
{ "message": "User was registered successfully!" }
```

3. User Signin

```bash
curl --location 'http://localhost:8080/api/auth/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"user",
    "email":"user@keploy.io",
    "password":"1234"
}'
```

We will get access token once the user has signed in:

```json
{
  "id": 1,
  "username": "user",
  "email": "user@keploy.io",
  "roles": ["ROLE_USER"],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzNzY0ODY1LCJleHAiOjE3MTM3NjUwNDV9.5LSU1A1jxIbIQFS6Tq26ENNWZBinFt2cJQZ7swpipbc"
}
```

4. Access user Content

```sh
curl --location 'http://localhost:8080/api/test/all'
```

We will get:

```
Public Content
```

5. Access user Content

```sh
curl --location 'http://localhost:8080/api/test/user' \
--header 'x-access-token: <TOKEN>'
```

We will get

```
User Content
```

## Running the testcases

```bash
keploy test -c 'sudo docker-compose up'  --containerName "ts-nhost" --delay 10
```

_Voila!! Our testcases has passed 🌟_
