# List App Role Assignments

Retrieve all App Role Assignments for in a Group and output them as JSON.

## Execution Example

The first argument is a Group ID.

```
$ npx tsx main.ts 587a48e3-2505-4956-a1e3-fccd59923d88
{
  "id": "40h6WAUlVkmh4_zNWZI9iG_HUSlEdw1Bidwx3Hma8Z4",
  "appRoleId": "00000000-0000-0000-0000-000000000000",
  "principalType": "Group",
  "principalId": "587a48e3-2505-4956-a1e3-fccd59923d88",
  "principalDisplayName": "Admin",
  "resourceId": "d348e9c1-6e39-4608-b0de-40d172a01807",
  "resourceDisplayName": "microsoft-entra-id-oidc-practice",
  "createdDateTime": "2024-06-23T16:24:27.461Z",
  "deletedDateTime": null
}
{
  "id": "40h6WAUlVkmh4_zNWZI9iJ4ugNRTlUdMsiuADt7qlvo",
  "appRoleId": "8774f594-1d59-4279-b9d9-59ef09a23530",
  "principalType": "Group",
  "principalId": "587a48e3-2505-4956-a1e3-fccd59923d88",
  "principalDisplayName": "Admin",
  "resourceId": "e39175ec-be0c-4a7f-883c-5ef731a81a21",
  "resourceDisplayName": "AWS IAM Identity Center (successor to AWS Single Sign-On)",
  "createdDateTime": "2023-12-09T15:52:12.708Z",
  "deletedDateTime": null
}
```

## References

- [List appRoleAssignments granted to a group](https://learn.microsoft.com/en-us/graph/api/group-list-approleassignments?view=graph-rest-1.0&tabs=http)
- [appRoleAssignment resource type](https://learn.microsoft.com/en-us/graph/api/resources/approleassignment?view=graph-rest-1.0)
