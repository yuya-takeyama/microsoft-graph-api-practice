import { DefaultAzureCredential } from "@azure/identity";
import { AzureIdentityAuthenticationProvider } from "@microsoft/kiota-authentication-azure";
import {
  createGraphServiceClient,
  GraphRequestAdapter,
} from "@microsoft/msgraph-sdk";
import "@microsoft/msgraph-sdk-users";

const credential = new DefaultAzureCredential();
const authProvider = new AzureIdentityAuthenticationProvider(credential);
const requestAdapter = new GraphRequestAdapter(authProvider);
const client = createGraphServiceClient(requestAdapter);

(async () => {
  let nextlink;

  while (true) {
    let usersRes;
    if (nextlink) {
      usersRes = await client.withUrl(nextlink).users.get();
    } else {
      usersRes = await client.users.get({
        queryParameters: {
          select: ["signInActivity"],
        },
      });
    }

    if (usersRes?.value) {
      for (const user of usersRes.value) {
        console.log(
          JSON.stringify({
            upn: user.userPrincipalName,
            lastSignIn:
              user.signInActivity?.lastSignInDateTime?.toISOString() || null,
            lastSuccessfulSignIn:
              user.signInActivity?.lastSuccessfulSignInDateTime?.toISOString() ||
              null,
          })
        );
      }

      if (usersRes?.odataNextLink) {
        nextlink = usersRes?.odataNextLink;
      } else {
        break;
      }
    }
  }
})();
