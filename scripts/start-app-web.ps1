# Starts the PLOTIQ app's web preview (Expo/Metro) on port 8090.
# Registered to run automatically at login — see scripts/README.md.
$env:Path += ";C:\Program Files\nodejs"
Set-Location "C:\Users\Anas Sarfaraz\OneDrive\Desktop\PLOTIQ\app"
npx expo start --web --port 8090 *>> "C:\Users\Anas Sarfaraz\OneDrive\Desktop\PLOTIQ\app\app.log" 2>&1
