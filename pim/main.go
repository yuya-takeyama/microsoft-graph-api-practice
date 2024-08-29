package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	graph "github.com/microsoftgraph/msgraph-sdk-go"
)

func main() {
	ctx := context.Background()

	cred, _ := azidentity.NewClientSecretCredential(
		os.Getenv("ENTRA_TENANT_ID"),
		os.Getenv("ENTRA_CLIENT_ID"),
		os.Getenv("ENTRA_CLIENT_SECRET"),
		nil,
	)
	client, err := graph.NewGraphServiceClientWithCredentials(cred, []string{"https://graph.microsoft.com/.default"})
	if err != nil {
		log.Fatalf("failed to create Graph Service Client: %v", err)
	}

	res, err := client.IdentityGovernance().PrivilegedAccess().Group().EligibilityScheduleRequests().Get(ctx, nil)
	if err != nil {
		log.Fatalf("failed to get the list of privileged access: %v", err)
	}

	for _, req := range res.GetValue() {
		fmt.Printf("Request ID: %v\n", *req.GetId())
	}
}
