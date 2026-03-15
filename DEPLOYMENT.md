# Deployment Guide

## Prerequisites

1. **AWS CLI** configured with profile `bbk-prod-admin`
2. **Node.js** and **npm** installed
3. **Serverless Framework** installed globally: `npm install -g serverless`
4. **SSL Certificate** created and validated in AWS Certificate Manager (ACM)
5. **Route53** nameservers configured in your domain registrar (Hostinger)

## Environment Setup

### Production Environment Variables

Edit `.env.prod` with your production values:

```env
MONGO_URI=mongodb+srv://...
JWT_KEY=your-production-jwt-secret
JWT_EXPIRE=48
FE_BASE_URL=https://bunnybabies.in
MULTIPART_THRESHOLD_MB=15
MULTIPART_PART_SIZE_MB=10
AWS_BUCKET_NAME=bbk-events-v1
AWS_REGION=ap-south-1
```

## One-Time Setup

### 1. Configure AWS Profile

```powershell
aws configure --profile bbk-prod-admin
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `ap-south-1`
- Default output format: `json`

### 2. Request SSL Certificate

```powershell
aws acm request-certificate \
  --domain-name api.bunnybabies.in \
  --validation-method DNS \
  --region ap-south-1 \
  --profile bbk-prod-admin
```

### 3. Add DNS Validation Record

Get the validation record:
```powershell
aws acm describe-certificate \
  --certificate-arn <certificate-arn> \
  --region ap-south-1 \
  --profile bbk-prod-admin \
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord'
```

Add the CNAME record to Route53 and wait for validation (5-30 minutes).

### 4. Check Certificate Status

```powershell
aws acm list-certificates \
  --region ap-south-1 \
  --profile bbk-prod-admin \
  --query "CertificateSummaryList[?DomainName=='api.bunnybabies.in']"
```

Status should be `ISSUED` before proceeding.

### 5. Create Custom Domain

```powershell
npm run domain:create:prod
```

This creates the API Gateway custom domain and Route53 DNS record.

## Deployment

### Option 1: Using PowerShell Script (Recommended)

```powershell
.\deploy-prod.ps1
```

This script will:
- ✓ Verify AWS credentials
- ✓ Load environment variables
- ✓ Check SSL certificate status
- ✓ Verify custom domain setup
- ✓ Deploy to production

### Option 2: Manual Steps

1. **Load environment variables:**
```powershell
Get-Content .env.prod | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}
```

2. **Deploy:**
```powershell
npm run deploy:prod
```

## Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run deploy:dev` | Deploy to development environment |
| `npm run deploy:prod` | Deploy to production environment |
| `npm run domain:create:prod` | Create custom domain for production |
| `npm run domain:delete:prod` | Delete custom domain for production |
| `npm run info:dev` | Get development deployment info |
| `npm run info:prod` | Get production deployment info |
| `npm run remove:dev` | Remove development deployment |
| `npm run remove:prod` | Remove production deployment |

## Post-Deployment

### Verify Deployment

```powershell
npm run info:prod
```

### Test API

```powershell
# Public endpoint
curl https://api.bunnybabies.in/health

# Admin endpoint
curl https://api.bunnybabies.in/admin/health
```

## Troubleshooting

### Certificate Not Found Error

If you get "Could not find an in-date certificate", ensure:
1. Certificate status is `ISSUED` in ACM
2. Certificate is in the same region as deployment (`ap-south-1`)
3. Certificate domain matches `api.bunnybabies.in`

### Domain Creation Failed

If custom domain creation fails:
1. Check Route53 hosted zone exists for `bunnybabies.in`
2. Verify nameservers are configured in Hostinger
3. Ensure certificate is validated and issued

### Environment Variables Not Loading

Make sure `.env.prod` exists and is not in `.gitignore` exceptions. Load them manually:
```powershell
Get-Content .env.prod | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
    }
}
```

## Rollback

To rollback to a previous version:

```powershell
serverless deploy --stage prod --aws-profile bbk-prod-admin
```

Or remove deployment entirely:

```powershell
npm run remove:prod
```

## CI/CD Integration

For automated deployments, add these secrets to your CI/CD:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- All environment variables from `.env.prod`

Example GitHub Actions:
```yaml
- name: Deploy to Production
  run: |
    serverless deploy --stage prod
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    MONGO_URI: ${{ secrets.MONGO_URI }}
    JWT_KEY: ${{ secrets.JWT_KEY }}
    # ... other env vars
```
