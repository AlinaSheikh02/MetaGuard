$ErrorActionPreference = "Stop"

Write-Host "Initializing Backend..."
New-Item -ItemType Directory -Force -Path "e:\mdata\backend"
Set-Location "e:\mdata\backend"
python -m venv venv
& ".\venv\Scripts\pip.exe" install flask flask-cors pillow piexif
& ".\venv\Scripts\pip.exe" freeze | Out-File -FilePath requirements.txt -Encoding utf8

Write-Host "Initializing Frontend..."
Set-Location "e:\mdata"
npx -y create-vite@latest frontend --template react
Set-Location "e:\mdata\frontend"
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react react-router-dom axios framer-motion clsx tailwind-merge

Write-Host "Setup Complete!"
