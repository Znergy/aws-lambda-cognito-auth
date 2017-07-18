# AWS Cognito Authentication with AWS Lambda

#### By: Ryan Jones
#### Version: 07/17/2017
#### LinkedIn: https://www.linkedin.com/in/ryanjonesirl/

## Quick Note
This is a brief overview, with undoubtedly some missing pieces, feel free to reach out if you get stuck and I will help you troubleshoot! I plan on writing a linkedIn article covering the entire process with images, code samples, and the final product in the coming weeks. You can contact me via LinkedIn or directly using my email below. Thank you.

## What is this repo and why does it matter?
This repository holds code that uses AWS Lambda, NodeJS, and AWS Cognito to authenticate users for your app. What you can do with this code, is create your own AWS Lambda function which will authenticate users using your own AWS Cognito User Pool. This is really powerful since you can pass data from your application through an API url using API Gateway. The hardest part of this process is the fact that AWS only supports client-side AWS Cognito authentication (ex: Android, IOS, and Javascript) so server-side is a bit more difficult (ex: Java or NodeJS). Thus, this code should jumpstart or at the least show a possible way to work with AWS Cognito using NodeJS + AWS Lambda. Which is actually pretty difficult to get started.


## How it works.
When you create an AWS Lambda function with the proper permissions to execute AWS Lambda, API Gateway, and AWS Cognito you will be able to pull data from a form on your app, pass it through an API Gateway URL, and run the AWS Lambda code in this repo to authenticate users with your app. To be safe and at least for testing purposes I use an IAM 'master_role' (name is irrelevant, just lots of permission access), which allows me to not worry about running into permission blocks so I can focus on working on the actual code.

## Uploading to AWS Lambda
To upload the code you need a couple of things..

### 1) Project setup
```
mkdir aws-cognito-auth
cd aws-cognito-auth
npm init
```

### 2) Dependencies
  * 'aws-sdk', 'jsbn', 'sjcl' (can all be installed with npm)
```
npm install aws-sdk jsbn sjcl --save
```
  * Copy 'amazon-cognito-identity.min.js' into your project (this will allow you to use 'AWSCognito' in your code)

### 3) Write some code
  * The code below is a quick check to make sure that your dependencies are setup correctly
  * You need to create an AWS Cognito User Pool and a User Pool application in AWS Cognito
    * Googling AWS Cognito setup, will help you create both the User Pool and the User Pool application
    * The User Pool ID and the Application ID (client ID) will be passed into the code below
    * Make sure to select given_name, email, and username in the attributes section of AWS Cognito User Pool as required attributes. This will allow you to not have to change any of the code in 'index.js' and immediately get to testing.

```
var AWS = require('aws-sdk');
var AWSCognito = require('./amazon-cognito-identity.min.js');

exports.handler = function(event, context, callback) {
    var poolData = {
        UserPoolId : 'your_user_pool_Id', // Your user pool id here
        ClientId : 'your_client_Id' // Your client id here
    };
    var userPool = new AWSCognito.CognitoUserPool(poolData);
    console.log(userPool);

    callback(null, 'Working');
}
```

### 4) Zip your project and upload to AWS Lambda
Inside the terminal, in your project directory (aws-cognito-auth)

Type..
```
zip function.zip index.js package.json amazon-cognito-identity.min.js node_modules
```
Navigate to the AWS Lambda Console and create a function called, userAuth. You want this function to have access to execute AWS Lambda and AWS Cognito permissions. Choose NodeJS as your runtime environment and create your function. Once created, open the function and instead of your current runtime language (which should be NodeJS), select 'upload with zip' from the drop down menu.
  * Click 'upload' and choose your 'function.zip' file

### 5) Test and continue
Click 'save and test', this will run your function and if you scroll down you should see a log. The log will say 'Working' if everything went okay, as well as a whole slew of information about your 'userPool'

Once you've confirmed everything is working, you can then come back to the 'index.js' file in this repo and copy the rest of the code into the AWS Lambda console or into your local 'index.js' file, then rezip using 'zip function.zip index.js package.json amazon-cognito-identity.min.js node_modules', and finally deploy to AWS Lambda

## Further exploration
Once you know how the pieces work together, you can now explore using API Gateway to pass in user form information via an API Gateway URL or expand the functionality of AWS Cognito to not only handle registration, but all AWS Cognito has to offer.
Example of API Gateway..
```
https://.../register-user?givenName=Ryan&username=ryan&password=Password_12345&email=ryan@example.com
```
Example of API Gateway request body..
```
{
  "givenName": "$input.params('givenName')",
  "username": "$input.params('username')",
  "password": "$input.params('password')",
  "email": "$input.params('email')"
}
```
Example of pulling URL params out in Lambda..
```
var given_name = event.givenName; // Ryan
var username = event.username; // ryan
var password = event.password; // Password_12345
var email = event.email; // ryan@example.com
```
You can then swap out the static fields for these dynamic variables and make 'real' authentication calls to AWS Cognito

## Important Notes
This is not the most secure way of handling a users password and there are plenty of ways to increase the security/handling of the users password. For this scenario, I'm keeping the code relatively simple and avoiding convoluting the core reason for this repository.

## Contact
* Name: Ryan Jones
* Email: ryanjonesirl@gmail.com
* Please feel free to reach out with any questions, concerns, or bugs. Thank you!
