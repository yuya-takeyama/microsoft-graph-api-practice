import { DefaultAzureCredential } from "@azure/identity";
import { AzureIdentityAuthenticationProvider } from "@microsoft/kiota-authentication-azure";
import {
  createGraphServiceClient,
  GraphRequestAdapter,
} from "@microsoft/msgraph-sdk";
import "@microsoft/msgraph-sdk-groups";

const credential = new DefaultAzureCredential();
const authProvider = new AzureIdentityAuthenticationProvider(credential);
const requestAdapter = new GraphRequestAdapter(authProvider);
const client = createGraphServiceClient(requestAdapter);
const groupId = process.argv[2];

(async () => {
  const res = await client.groups.byGroupId(groupId).appRoleAssignments.get();

  if (res?.value) {
    for (const assignment of res.value) {
      console.log(
        JSON.stringify(
          {
            id: assignment.id,
            appRoleId: assignment.appRoleId?.toString(),
            principalType: assignment.principalType,
            principalId: assignment.principalId?.toString(),
            principalDisplayName: assignment.principalDisplayName,
            resourceId: assignment.resourceId?.toString(),
            resourceDisplayName: assignment.resourceDisplayName,
            createdDateTime: assignment.createdDateTime?.toISOString(),
            deletedDateTime: assignment.deletedDateTime?.toISOString() || null,
          },
          null,
          2
        )
      );
    }
  }
})();
