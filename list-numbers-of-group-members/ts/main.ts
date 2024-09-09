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

const getNumberOfMembers = async (groupId: string) => {
  let nextlink;
  let count = 0;

  while (true) {
    let res;

    if (nextlink) {
      res = await client.withUrl(nextlink).directoryObjects.get();
    } else {
      res = await client.groups.byGroupId(groupId).members.get();
    }

    if (res?.value) {
      count += res.value.length;
    }

    if (res?.odataNextLink) {
      nextlink = res?.odataNextLink;
    } else {
      break;
    }
  }

  return count;
};

(async () => {
  try {
    let groupNextLink;
    let groupRes;

    while (true) {
      if (groupNextLink) {
        groupRes = await client.withUrl(groupNextLink).groups.get();
      } else {
        groupRes = await client.groups.get();
      }

      const groups = groupRes?.value || [];
      const groupsAndNumbersOfMembers = await Promise.all(
        groups.map(async (group) => {
          return {
            id: group.id,
            displayName: group.displayName,
            numberOfMembers: group?.id ? await getNumberOfMembers(group.id) : 0,
          };
        })
      );

      for (const group of groupsAndNumbersOfMembers) {
        console.log(
          JSON.stringify({
            id: group.id,
            displayName: group.displayName,
            numberOfMembers: group.numberOfMembers,
          })
        );
      }

      if (groupRes?.odataNextLink) {
        groupNextLink = groupRes?.odataNextLink;
      } else {
        break;
      }
    }

    /*
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
      */
  } catch (err) {
    console.error(err);
  }
})();
