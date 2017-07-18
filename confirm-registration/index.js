var AWS = require('aws-sdk');
var AWSCognito = require('./amazon-cognito-identity.min.js');

/**
 * This function is used with API Gateway to pass username and code through the URL..
 * URL Example: https://.../confirm-registration?username=example&code=580664
*/

exports.handler = function(event, context, callback) {

  var poolData = {
        UserPoolId : 'your_user_pool_Id', // Your user pool id here
        ClientId : 'your_client_Id' // Your client id here
    };

    var username = event.username;
    var code = event.code;

    var userPool = new AWSCognito.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };

    var cognitoUser = new AWSCognito.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(null, 'call result: ' + result);
        console.log('call result: ' + result);
    });
}
