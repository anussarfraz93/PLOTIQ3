# Starts the PLOTIQ backend (Express + SQLite) on port 4000.
# Registered to run automatically at login — see scripts/README.md.
$env:Path += ";C:\Program Files\nodejs"
Set-Location "C:\Users\Anas Sarfaraz\OneDrive\Desktop\PLOTIQ\backend"
node src\server.js *>> "C:\Users\Anas Sarfaraz\OneDrive\Desktop\PLOTIQ\backend\backend.log" 2>&1
