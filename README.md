
---
## MyFamilyAgenda
- Shared agenda app for android developed on react native  
![alt text](MyAgenda/images/meteo.png)  
![alt text](MyAgenda/images/character.png)

---

#### Prerequisites
- node v17.8.0 or higher
- npm v8.5.5 or higher

#### Environnement variables
- Visit https://home.openweathermap.org/
- Register copy and paste your api key into new .env file in project root

- This is the detail of all env variables:
```
OPENWEATHERMAP_API_KEY=OPENWEATHERMAP_API_KEY

TEST_FIREBASE_API_KEY=TEST_FIREBASE_API_KEY
TEST_FIREBASE_DATABASE_URL=TEST_FIREBASE_DATABASE_URL
TEST_FIREBASE_AUTH_DOMAIN=TEST_FIREBASE_AUTH_DOMAIN
TEST_FIREBASE_PROJECT_ID=TEST_FIREBASE_PROJECT_ID
TEST_FIREBASE_STORAGE_BUCKET=TEST_FIREBASE_STORAGE_BUCKET
TEST_FIREBASE_MESSAGING_SENDER_ID=TEST_FIREBASE_MESSAGING_SENDER_ID
TEST_FIREBASE_APP_ID=TEST_FIREBASE_APP_ID
TEST_FIREBASE_MEASUREMENT_ID=TEST_FIREBASE_MEASUREMENT_ID

DEV_FIREBASE_API_KEY=DEV_FIREBASE_API_KEY
DEV_FIREBASE_DATABASE_URL=DEV_FIREBASE_DATABASE_URL
DEV_FIREBASE_AUTH_DOMAIN=DEV_FIREBASE_AUTH_DOMAIN
DEV_FIREBASE_PROJECT_ID=DEV_FIREBASE_PROJECT_ID
DEV_FIREBASE_STORAGE_BUCKET=DEV_FIREBASE_STORAGE_BUCKET
DEV_FIREBASE_MESSAGING_SENDER_ID=DEV_FIREBASE_MESSAGING_SENDER_ID
DEV_FIREBASE_APP_ID=DEV_FIREBASE_APP_ID
DEV_FIREBASE_MEASUREMENT_ID=DEV_FIREBASE_MEASUREMENT_ID
``` 

## Typescript project generation
```
npx react-native init MyApp --template react-native-template-typescript
npm install -D typescript @types/jest @types/react @types/react-native @types/react-test-renderer
npm i react-native-eject
```

#### Install typescript types
```
npm install @types/react@~17.0.21
```

## Classic project generation
npx react-native init MyApp

## Setup
- Use android visual studio AVD manager (emulator manager) or use the Android emulator AVD installation vscode/linux section of the readme

### Install vscode cookies:
- Android iOS Emulator  v1.6.0 Run Android emulator and iOS simulator easily from VScode!
- React Native Tools

### Android emulator AVD installation vscode/linux
- https://developer.android.com/studio -> download linux zip plateform cli 
- https://developer.android.com/studio/releases/platform-tools -> download linux zip plateform tools 
- Create a folder android-sdk for installation
- Unzip the two zip folders and create a tools folder inside the cmdline-tools folder with the content of cmdline-tools folder.
- You should have this achitecture: 
```
android-sdk
|----platform-tools
| ----cmdline-tools |
| ----------------- ||tools
```

### Android - SDK Tools & Platform Tools
- Open .bashrc with nano
```
sudo nano ~/.bashrc
```
- Copy the next lines in .bashrc with nano:
```
export ANDROID_HOME=/path_android-sdk
export PATH=/path_android-sdk/platform-tools:/path_android-sdk/cmdline-tools/tools:/path_android-sdk/cmdline-tools/tools/bin:${PATH}
```  
- Refresh global environement:
  ```
  source ~/.bashrc
  ```

Installation Checking:
```
adb --version
sdkmanager --version
```
### Android 30 plateform installation
To get the list of the packages:
```
sdkmanager --list
```
To install android 30 plateform:
```
sdkmanager "platforms;android-30"
```
After installing the platforms, the architecture should be:
```
android-sdk
| ----cmdline-tools |
| ----------------- ||tools
|----license
|----platforms
|----platform-tools
```  

### Install default system image for platform android-30
```  
sdkmanager "system-images;android-30;default;x86_64"
```  
### Install Google Play Services system image
```  
sdkmanager "system-images;android-30;google_apis_playstore;x86_64"
```  
### Installation Checking
After installing the default system image, the directory structure should be:
```
android-sdk
| ----cmdline-tools |
| ----------------- ||tools
|----emulator
|----license
|----patcher
|----platforms
|----platform-tools
|----system-images
```

### Emulator and build tools installation
```
sdkmanager --channel=3 emulator
sdkmanager "build-tools;30.0.3" 
```
After installing the build tools, the directory structure should be:
```

android-sdk
|----build-tools
| ----cmdline-tools |
| ----------------- ||tools
|----emulator
|----license
|----patcher
|----platforms
|----platform-tools
|----system-images
|----tools
```
### AVD configuration
Now that all images, plateform,build tools and cli are installed you need to create a virtual device:
```
avdmanager create avd -n <avd name> -k "system-images;android-30;default;x86_64" -g "default"
```
Once it is create you can check the list of virtual devices:
```
avdmanager list avd
```
### AVD launch
You can now use the virtual device.
Locate yourself in the android-sdk/tools folder and launch it with the emulator executable:
```
./emulator -avd <avd name>
```
You can also launch the emulator thanks to the icon at the top right of the screen in vscode :
![alt text](/setup/avd.png)
Put the path of the emulator executable in vscode android emulator cookie
![alt text](/setup/settings.png)
![alt text](/setup/settings2.png)

---  

### Developpement
Install node modules
```
npm i
```

Files type-check integrity:
```
yarn tsc
```

Open the emulator and run:
```
npm start
```

> **press a to open the emulator if necessary**  
> **press r to reload the emulator**

### Get list of android images
In emulator folder:
```
emulator -list-avds
```

### DEBUG PROJECT
#### Environnement variables
https://reactnative.dev/docs/environment-setup
```bash
export ANDROID_HOME=/home/alex/Documents/android-sdk
export PATH=/home/alex/Documents/android-sdk/platform-tools:/home/alex/Documents/android-sdk/cmdline-tools/tools:/home/alex/Documents/android-sdk/cmdline-tools/tools/bin:${PATH}
export ANDROID_SDK_ROOT=/home/alex/Documents/android-sdk
export ANDROID_AVD_HOME=/home/alex/Documents/android-sdk/system-images

```

#### Windows
```
set ANDROID_HOME=C:\ *installation location* \android-sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

#### Kill process
```bash
adb kill-server
```

#### Cold boot
```bash
emulator @avd_name -no-snapshot-load
```

#### Restart android project
```bash
rm -rf android
react-native eject
react-native link
install-expo-modules //if necessary
```
pod fails to install because it is a xcode dependency, useless for android developement

#### Run android project on your device through expo
```
react-native link {lib_name} //if necessary
npm run android //if necessary
expo start // for qrcode and internet connection
expo start --localhost --android // for usb connection // can also be used on an emulator image
```

#### Allow position sharing
To request access to location, you need to add the following line to your app's AndroidManifest.xml:
```
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

#### Fix issue with keyboard pushing up components
Write in AndroidManifest.xml:
```
android:windowSoftInputMode="adjustPan"
```