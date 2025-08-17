# Gemini Project Context: AutoSocial

This document provides a comprehensive overview of the AutoSocial project, its architecture, and development practices to be used as instructional context for future interactions.

## Project Overview

AutoSocial is a multi-platform application designed to automate and schedule Twitter posts. It consists of three main components:

*   **Mobile App (`/app`):** A React Native application built with Expo that allows users to create, schedule, and manage their Twitter posts.
*   **Backend (`/aws`):** A serverless backend powered by AWS services, including Cognito for authentication, API Gateway for API endpoints, Lambda for serverless functions, DynamoDB for data storage, and S3 for media storage. The infrastructure is managed using the AWS CDK.
*   **Web App (`/web`):** A web interface built with Astro and React for managing the application.

## Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Mobile App** | React Native, Expo, TypeScript, Zustand (State Management), TanStack Query (Data Fetching), React Navigation |
| **Backend** | AWS CDK, AWS Lambda (Python), AWS DynamoDB, AWS S3, AWS Cognito, AWS API Gateway, Boto3, AWS Lambda Powertools |
| **Web App** | Astro, React, Tailwind CSS, Nanostores (State Management), TanStack Query (Data Fetching) |

## Building and Running

The project uses a `Makefile` to streamline common development tasks.

### Mobile App

*   **Start development server:** `make mobile-dev`
*   **Build for iOS:** `make mobile-ios`
*   **Build for Android:** `make mobile-android`

### Backend

*   **Deploy a stack:** `make deploy STACK=<stack-name>` (e.g., `make deploy STACK=Api`)
*   **Hotswap a stack (for faster development):** `make hotswap STACK=<stack-name>`
*   **Destroy a stack:** `make destroy STACK=<stack-name>`
*   **List all stacks:** `make list-stacks`

### Web App

*   **Start development server:** `cd web && npm run dev`
*   **Build for production:** `cd web && npm run build`

## Development Conventions

*   **Infrastructure as Code:** The backend infrastructure is defined as code using the AWS CDK in the `/aws` directory.
*   **Serverless Functions:** Backend logic is implemented as Python Lambda functions located in `/aws/src/fn`.
*   **Component-Based UI:** The mobile and web apps are built using a component-based architecture. Reusable components can be found in `/app/src/components` and `/web/src/components` respectively.
*   **State Management:** The mobile app uses Zustand for global state management, while the web app uses Nanostores. Both applications use TanStack Query for managing server state.
*   **Styling:** The web app uses Tailwind CSS for styling. The mobile app uses React Native Paper for UI components.
*   **Linting and Formatting:** The project uses Prettier and ESLint for code formatting and linting. Configuration files can be found at the root of the project and in the `app` directory.
