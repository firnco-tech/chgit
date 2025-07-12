# Workload Identity Federation Setup for GitHub Actions

This document provides step-by-step instructions to set up Workload Identity Federation for secure GitHub Actions authentication with Google Cloud, eliminating the need for service account keys.

## Why Workload Identity Federation?

- **No Static Keys**: Eliminates the risk of key exposure and automatic deactivation
- **Short-lived Tokens**: Uses temporary credentials that expire automatically
- **Better Security**: No long-lived credentials stored in GitHub
- **Zero Maintenance**: No key rotation required

## Setup Steps

### 1. Create Workload Identity Pool

```bash
# Set variables
PROJECT_ID="blissful-bonsai-465714-k8"
POOL_ID="github-actions-pool"
PROVIDER_ID="github-actions-provider"
REPO="firnco-tech/chgit"  # Your GitHub repository
SERVICE_ACCOUNT_EMAIL="replit-holacupidmedia@blissful-bonsai-465714-k8.iam.gserviceaccount.com"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create $POOL_ID \
    --project=$PROJECT_ID \
    --location="global" \
    --display-name="GitHub Actions Pool"
```

### 2. Create Workload Identity Provider

```bash
# Create the provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_ID \
    --project=$PROJECT_ID \
    --location="global" \
    --workload-identity-pool=$POOL_ID \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"
```

### 3. Grant Service Account Access

```bash
# Allow the GitHub repository to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT_EMAIL \
    --project=$PROJECT_ID \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/$POOL_ID/attribute.repository/$REPO"
```

### 4. Get Required Values for GitHub Secrets

```bash
# Get the Workload Identity Provider resource name
gcloud iam workload-identity-pools providers describe $PROVIDER_ID \
    --project=$PROJECT_ID \
    --location="global" \
    --workload-identity-pool=$POOL_ID \
    --format="value(name)"
```

### 5. Configure GitHub Repository Secrets

Add these secrets to your GitHub repository settings:

1. **WIF_PROVIDER**: The full resource name from step 4
   - Format: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID`

2. **WIF_SERVICE_ACCOUNT**: Your service account email
   - Value: `replit-holacupidmedia@blissful-bonsai-465714-k8.iam.gserviceaccount.com`

3. **GOOGLE_CLOUD_BUCKET_NAME**: Your storage bucket name
   - Value: `replit-holacupidmedia`

## Benefits After Setup

✅ **No More Key Deactivation**: Google Cloud won't deactivate credentials because there are no static keys
✅ **Automatic Security**: Temporary tokens expire automatically
✅ **Zero Maintenance**: No key rotation or management required
✅ **Audit Trail**: All access is logged and traceable
✅ **Secure Pushes**: GitHub pushes won't trigger security warnings

## Testing the Setup

After configuration, test with:

```bash
# In GitHub Actions, this will now work without any static credentials:
gsutil ls gs://replit-holacupidmedia
```

## Migration from Service Account Keys

Once Workload Identity Federation is set up:

1. Update your deployment scripts to use the GitHub Actions workflow
2. Remove all service account JSON files from your repository
3. Delete the old service account keys from Google Cloud Console
4. Your existing Replit environment can continue using the service account key via environment variables

This approach provides the best of both worlds:
- **Development**: Continue using service account keys in Replit (secure environment)
- **CI/CD**: Use Workload Identity Federation in GitHub Actions (no keys needed)