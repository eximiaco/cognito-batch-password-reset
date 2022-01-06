// ES5 example
const {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminResetUserPasswordCommand
} = require("@aws-sdk/client-cognito-identity-provider");


const region = '<Region>';
const userPoolId = '<UserPoolId>'

const client = new CognitoIdentityProviderClient({
    region
});

const getUsers = async () => {

    const command = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: "cognito:user_status = \"RESET_REQUIRED\""
    });

    const response = await client.send(command);
    return response.Users;
};

const resetUserPassword = async (username) => {
    const command = new AdminResetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: username
    });

    const response = await client.send(command);
    if(response['$metadata'].httpStatusCode == 200) console.log(`User ${username} notified`);
    else console.log(`Error notifying user ${username}`)
};

const resetUsersPassword = async () => {
    const users = await getUsers();
    if (!users) {
        console.log("No users found");
        return;
    }

    for(const user of users){       
        await resetUserPassword(user.Username);        
    }
};

resetUsersPassword();