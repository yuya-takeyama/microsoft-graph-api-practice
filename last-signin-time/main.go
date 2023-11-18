package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	graph "github.com/microsoftgraph/msgraph-sdk-go"
	graphcore "github.com/microsoftgraph/msgraph-sdk-go-core"
	"github.com/microsoftgraph/msgraph-sdk-go/models"
	"github.com/microsoftgraph/msgraph-sdk-go/users"
)

type UserStatus struct {
	UPN                  *string    `json:"upn"`
	AccountEnabled       *bool      `json:"accountEnabled"`
	LastSignInTime       *time.Time `json:"lastSignInTime"`
	DaysSinceLastdSignIn float64    `json:"daysSinceLastSignIn"`
	UserType             *string    `json:"userType"`
}

func main() {
	ctx := context.Background()

	cred, _ := azidentity.NewDefaultAzureCredential(nil)
	client, err := graph.NewGraphServiceClientWithCredentials(cred, []string{"https://graph.microsoft.com/.default"})
	if err != nil {
		log.Fatalf("failed to create Graph Service Client: %v", err)
	}

	res, err := client.Users().Get(ctx, &users.UsersRequestBuilderGetRequestConfiguration{
		QueryParameters: &users.UsersRequestBuilderGetQueryParameters{
			Select: []string{
				"id",
				"accountEnabled",
				"displayName",
				"userPrincipalName",
				"signInActivity",
				"userType",
			},
		},
	})
	if err != nil {
		log.Fatalf("failed to get the list of users: %v", err)
	}

	pageIterator, err := graphcore.NewPageIterator[*models.User](
		res,
		client.GetAdapter(),
		models.CreateUserCollectionResponseFromDiscriminatorValue)
	if err != nil {
		log.Fatalf("failed to create page iterator: %v\n", err)
	}

	now := time.Now()
	pageIterator.Iterate(ctx, func(user *models.User) bool {
		signInActivity := user.GetSignInActivity()

		var roundedDays float64
		var lastTime *time.Time
		if signInActivity != nil {
			lastTime = signInActivity.GetLastSignInDateTime()
			if lastTime != nil {
				days := now.Sub(*lastTime).Hours() / 24
				roundedDays = math.Round(days*10) / 10
			}
		} else {
			roundedDays = 0
		}

		userStatus := UserStatus{
			UPN:                  user.GetUserPrincipalName(),
			AccountEnabled:       user.GetAccountEnabled(),
			LastSignInTime:       lastTime,
			DaysSinceLastdSignIn: roundedDays,
			UserType:             user.GetUserType(),
		}

		jsonData, err := json.Marshal(userStatus)
		if err != nil {
			log.Fatalf("failed to marshall JSON: %v", err)
		}

		fmt.Println(string(jsonData))
		return true
	})
}
