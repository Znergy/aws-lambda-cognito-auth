var AWS = require('aws-sdk');
var AWSCognito = require('./amazon-cognito-identity.min.js');

exports.handler = function(event, context, callback) {
    var poolData = {
        UserPoolId : 'your_user_pool_Id', // Your user pool id here
        ClientId : 'your_client_Id' // Your client id here
    };
    var userPool = new AWSCognito.CognitoUserPool(poolData);
    // console.log(userPool);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : 'example@gmail.com'
    };

    var dataPhoneNumber = {
        Name : 'phone_number',
        Value : '+15555555555'
    };

    var dataGivenName = {
        Name: 'given_name',
        Value: 'John Doe'
    };

    var attributeEmail = new AWSCognito.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AWSCognito.CognitoUserAttribute(dataPhoneNumber);
    var attributeGivenName = new AWSCognito.CognitoUserAttribute(dataGivenName);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributeGivenName);

    userPool.signUp('username', 'Password_12345', attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });


    callback(null, 'Working');
}
