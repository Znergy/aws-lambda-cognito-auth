var AWS = require('aws-sdk');
var AWSCognito = require('./amazon-cognito-identity.min.js');

exports.handler = function(event, context, callback) {
    var poolData = {
        UserPoolId : 'us-west-2_EHflgoaxg', // Your user pool id here
        ClientId : '43na3el4nrlr4a3nmu1cesmnfn' // Your client id here
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
