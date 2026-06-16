$SOURCE = "D:\@menuka\@Learn\machine learning\@Projects\customer-churn-predictor"
$DEST = "D:\@menuka\@Learn\machine learning\@Projects\@huggingface-spaces\churn-predictor-deployment\customer-churn-predictor"

# Sync backend
Copy-Item -Path "$SOURCE\backend" -Destination "$DEST\backend" -Recurse -Force
Copy-Item -Path "$SOURCE\requirements.txt" -Destination "$DEST\requirements.txt" -Force
Copy-Item -Path "$SOURCE\Dockerfile" -Destination "$DEST\Dockerfile" -Force
Copy-Item -Path "$SOURCE\.dockerignore" -Destination "$DEST\.dockerignore" -Force

# Push to HF
Set-Location $DEST
git add .
git commit -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push

Write-Host "Deployed to HuggingFace Spaces successfully"