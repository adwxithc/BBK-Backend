# Install Sharp for Lambda Layer

Write-Host "Installing Sharp for AWS Lambda..." -ForegroundColor Green

# Navigate to the layer directory
Set-Location layers/sharp/nodejs

# Install Sharp with Linux-compatible binaries
npm install --os=linux --cpu=x64 sharp

Write-Host "Sharp installed successfully!" -ForegroundColor Green
Write-Host "You can now run 'serverless deploy' from the root directory" -ForegroundColor Yellow

# Go back to root
Set-Location ../../..
