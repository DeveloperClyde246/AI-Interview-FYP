# AI-Interview-FYP-Fullstack

## Setup Web App:
### Download Node.js
```
# Download and install fnm:
winget install Schniz.fnm

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.15.0".

# Verify npm version:
npm -v # Should print "10.9.2".
```

### Extract compressed folder into folder under C: drive
Open folder in Visual Studio Code
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd AI-Interview-FYP-Backend
```
### Install the packages
```
npm install
```

### Start Backend
Open new terminal
``` 
npm run devStart 
```

### Start Frontend
Open another terminal

```
cd client
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```
### Navigate to login page
In any browser, open link http://localhost:5173/login


mainAdmin -- Email: mainAdmin@gmail.com         Psw: test

recruiter1 -- Email: recruiter1@gmail.com       Psw: test

candidate1 -- Email: candidate1@gmail.com       Psw: test

## Setup Analysis API
### Installation
1. Install ffmpeg, can refer to this video "https://www.youtube.com/watch?v=JR36oH35Fgg"
2. Install newest python version

### Extract compressed folder into folder under C: drive
Open folder in Visual Studio Code
```
pip install -r requirements.txt
python analysis_api.py
```
