import { DefaultAzureCredential } from "@azure/identity";
import { AzureIdentityAuthenticationProvider } from "@microsoft/kiota-authentication-azure";
import {
  createGraphServiceClient,
  GraphRequestAdapter,
} from "@microsoft/msgraph-sdk";
import "@microsoft/msgraph-sdk-groups";
import "@microsoft/msgraph-sdk-directoryobjects";

const credential = new DefaultAzureCredential();
const authProvider = new AzureIdentityAuthenticationProvider(credential);
const requestAdapter = new GraphRequestAdapter(authProvider);
const client = createGraphServiceClient(requestAdapter);
const groupId = process.argv[2];

(async () => {
  try {
    let nextlink;

    while (true) {
      let res;

      if (nextlink) {
        res = await client.withUrl(nextlink).directoryObjects.get();
      } else {
        res = await client.groups.byGroupId(groupId).members.get();
      }

      if (res?.value) {
        for (const member of res.value) {
          console.log(
            JSON.stringify(
              {
                id: member.id,
              },
              null,
              2
            )
          );
        }
      }

      if (res?.odataNextLink) {
        nextlink = res?.odataNextLink;
      } else {
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
