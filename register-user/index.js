var AWS = require('aws-sdk');
var AWSCognito = require('./amazon-cognito-identity.min.js');

/**
 * This function is used with API Gateway to pass email, username, name, phoneNumber,
 * and password through the URL..
 * URL Example: https://.../register-user?email=example@gmail.com&username=example&name=John+Doe&phoneNumber=5037615053&password=Password_12345
 * The password must be 8 chars long, contain a number, uppercase letter, and special character
 * The phone number must be formatted as '+1_number' this is done once the phoneNumber is passed into the function below
*/

exports.handler = function(event, context, callback) {
    var poolData = {
        UserPoolId : 'your_user_pool_Id', // Your user pool id here
        ClientId : 'your_client_Id' // Your client id here
    };
    var userPool = new AWSCognito.CognitoUserPool(poolData);
    // console.log(userPool);

    var attributeList = [];

    var email = event.email;
    var username = event.username;
    var password = event.password;
    var name = event.name;
    var phoneNumber = event.phoneNumber;

    var dataEmail = {
        Name : 'email',
        Value : email
    };

    var dataPhoneNumber = {
        Name : 'phone_number',
        Value : '+1' + phoneNumber
    };

    var dataGivenName = {
        Name: 'given_name',
        Value: name
    };

    var attributeEmail = new AWSCognito.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AWSCognito.CognitoUserAttribute(dataPhoneNumber);
    var attributeGivenName = new AWSCognito.CognitoUserAttribute(dataGivenName);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributeGivenName);

    userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        callback(null, result.user);
    });
}
