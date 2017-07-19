var AWS = require('aws-sdk');
var AWSCognito = require('./amazon-cognito-identity.min.js');

/**
 * This function is used with API Gateway to pass username and password through the URL..
 * URL Example: https://.../register-user?email=example@gmail.com&username=example&name=John+Doe&phoneNumber=5037615053&password=Password_12345
 * The password must be 8 chars long, contain a number, uppercase letter, and special character
*/

exports.handler = function(event, context, callback) {

  var username = event.username;
  var password = event.password;


  var authenticationData = {
    Username : username,
    Password : password,
  };
  var authenticationDetails = new AWSCognito.AuthenticationDetails(authenticationData);
  var poolData = {
    UserPoolId : 'your_user_pool_Id', // Your user pool id here
    ClientId : 'your_client_Id' // Your client id here
  };
  var userPool = new AWSCognito.CognitoUserPool(poolData);
  var userData = {
    Username : username,
    Pool : userPool
  };
  var cognitoUser = new AWSCognito.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log('access token + ' + result.getAccessToken().getJwtToken());

      //POTENTIAL: Region needs to be set if not already set previously elsewhere.
      AWS.config.region = '<region>'; // ex: us-west-2

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : 'your_identity_pool_id', // your identity pool id here
        Logins : {
          // Change the key below according to the specific region your user pool is in.
          'cognito-idp.<region>.amazonaws.com/your_pool_Id' : result.getIdToken().getJwtToken()
        }
      });

      console.log(result.getIdToken());
      console.log('Current User: ' + userPool.getCurrentUser());

      callback(null, 'Token: ' + result.getIdToken().getJwtToken());

      // Instantiate aws sdk service objects now that the credentials have been updated.
      // example: var s3 = new AWS.S3();

    },

    onFailure: function(err) {
      console.log(err);
    }
  });
}
