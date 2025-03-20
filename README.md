# Auto Social - Twitter Post Scheduler

Auto Social is a React Native mobile application that allows users to schedule and automate their Twitter posts. The app provides a user-friendly interface for creating, scheduling, and managing Twitter posts.

## Features

-   **Authentication**: Secure user authentication using AWS Cognito
-   **Post Creation**: Create Twitter posts with text and media
-   **Scheduling**: Schedule posts for specific times or add them to predefined slots
-   **Schedule Management**: Create and manage posting schedules (e.g., every Monday at 9 AM)
-   **User Settings**: Manage profile and app preferences

## Tech Stack

### Frontend (Mobile App)

-   React Native with TypeScript
-   Expo Framework
-   React Navigation for routing
-   React Native Paper for UI components
-   AWS SDK for direct AWS service integration

### Backend

-   AWS Cognito for authentication
-   AWS API Gateway for API endpoints
-   AWS Lambda for serverless functions
-   AWS DynamoDB for database
-   AWS S3 for media storage

## Project Structure

The project is organized into two main directories:

-   `app/`: Contains all the React Native mobile app code
-   `api/`: Contains all the backend serverless code

### App Structure

-   `app/components/`: Reusable UI components
-   `app/screens/`: Screen components organized by feature
-   `app/context/`: React context providers
-   `app/hooks/`: Custom React hooks
-   `app/utils/`: Utility functions and services
-   `app/config/`: Configuration files
-   `app/types/`: TypeScript type definitions
-   `app/assets/`: Images and other static assets

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn
-   Expo CLI
-   AWS Account

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/yourusername/autosocial.git
    cd autosocial
    ```

2. Install dependencies for the mobile app:

    ```
    cd app
    npm install
    ```

3. Set up environment variables:

    - Create a `.env` file in the `app` directory based on the `.env.example` template
    - Fill in your AWS credentials and other configuration values

4. Start the Expo development server:

    ```
    npm start
    ```

5. Run on a device or emulator:
    - Press `a` to run on Android emulator
    - Press `i` to run on iOS simulator (requires macOS)
    - Scan the QR code with the Expo Go app on your physical device

## Backend Setup

1. Install AWS CLI and configure with your credentials

2. Deploy the backend resources:
    ```
    cd api
    npm install
    npm run deploy
    ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
