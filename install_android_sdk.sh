#!/bin/bash

# Install Java 17 (required for the latest Android SDK tools)
echo "Installing Java 17..."
sudo apt update
sudo apt install -y openjdk-17-jdk
echo "Java 17 installation complete"

# Set JAVA_HOME to Java 17
export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))' >> ~/.bashrc

# Remove existing Android SDK
rm -rf ~/Android/Sdk

# Install Android SDK in WSL
echo "Installing Android SDK..."
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip

# Set up the directory structure properly (fix the directory structure issue)
mkdir -p cmdline-tools
# First, move everything out of the way temporarily
mv cmdline-tools cmdline-tools-temp
# Create the proper structure
mkdir -p cmdline-tools/latest
# Move the files to the right place
mv cmdline-tools-temp/* cmdline-tools/latest/
rm -rf cmdline-tools-temp

# Update your environment variables to use the WSL SDK
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

# Install required packages
cd ~/Android/Sdk/cmdline-tools/latest/bin
./sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
./sdkmanager --licenses

# Verify installation
echo "Android SDK installation complete. You can now use Android Studio."
echo "To verify the installation, run: adb devices"

