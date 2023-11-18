# Retrieve Last Sign-in Dates

Retrieve all users registered on Entra ID and output their last sign-in dates, the number of days elapsed since then, and other additional information as JSON.

This example includes elements such as:

- Signing in using default credentials
  - Depending on the environment variables, the appropriate authentication method is selected and executed from Azure CLI, secret, Federated credentials, etc.
- Obtaining additional fields through the [`$select`](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#select-parameter)
- Retrieving all items using the [Page Iterator](https://learn.microsoft.com/en-us/graph/sdks/paging?tabs=go)

## Execution Example

Below is an example of logging in using Azure CLI.

Note that the outputted email addresses and other data are generated as sample data packs in Microsoft 365 developer subscriptions and are not associated with any real organizations or individuals.

The domain parts of the email addresses have been partially masked.

```
$ az login --allow-no-subscription
$ go run main.go
{"upn":"AdeleV@.onmicrosoft.com","accountEnabled":true,"lastSignInTime":"2023-11-03T18:34:15Z","daysSinceLastSignIn":16.2,"userType":"Member"}
{"upn":"AlexW@.onmicrosoft.com","accountEnabled":true,"lastSignInTime":"2023-11-03T18:34:21Z","daysSinceLastSignIn":16.2,"userType":"Member"}
{"upn":"yuya@***.onmicrosoft.com","accountEnabled":true,"lastSignInTime":"2023-11-19T09:09:30Z","daysSinceLastSignIn":0.6,"userType":"Member"}
...
```

## References

- [List users](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=go)
- [signInActivity resource type](https://learn.microsoft.com/en-us/graph/api/resources/signinactivity?view=graph-rest-1.0)
