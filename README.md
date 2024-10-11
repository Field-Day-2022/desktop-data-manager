# Group 26 Field Day Capstone Project
### Group Members: Ayesha Arif, Chase Molstad, Evan Hagood, Quinten Knowles, Timothy Weaver

# <img src="./public/logo.svg" alt="Field Day Logo" width="100">Field Day: Desktop Data Manager

Welcome to the Field Day: Desktop Data Manager (DDM) repository! This project is a desktop web application designed for managing wildlife data collected in the field.

![Device Mockup](./public/mockup.png)

## Quickstart for Users

To quickly get started with the Field Day: Desktop Data Manager application, follow these steps:

1. Visit the [Firebase hosting](https://asu-field-day-webui.web.app/) page to access the application.
2. Note that an ASU email address ending with `@asu.edu` is required to log in and use the application.

The application can be installed as a PWA (Progressive Web App) on your device for easy access. To install the application as a PWA, follow these steps:

1. Open the application in your browser.
2. Click on the install icon in the address bar to install the application.
3. That's it! You can now access the application from your device like any other app.

## Project Overview

DDM is an essential tool for viewing, managing, and exporting wildlife data collected by researchers using the Field Day mobile app. The application is optimized for use on larger screens, such as laptops, desktop computers, and tablets (width > 1200px).

### Development Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase) ![Google Cloud](https://img.shields.io/badge/google_cloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23007ACC.svg?style=for-the-badge&logo=vite&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)

### Key Features

-   **Data Management**: Efficiently view, search, edit, and sort collected data in a table view.
-   **Dynamic Data Loading**: Data is loaded dynamically from the database based on user activity to optimize performance and reduce costs.
-   **Google Authentication**: Enhanced authentication security with 2-factor Google authentication.
-   **Data Export**: Export data to CSV format for further analysis.
-   **Answer Sets Management**: Manage answer sets, which are templates for data input specifying permissible data types for given fields.

## Development Guide

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/)
-   [npm](https://www.npmjs.com/get-npm)
-   [Firebase Account](https://firebase.google.com/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Field-Day-2022/field-day-2022-webUI.git
    cd field-day-2022-webUI
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up Firebase:
   // TODO: Add instructions for setting up Firebase

4. Start the development server:
    ```bash
    npm run dev
    ```
5. Open the application in your browser at `http://localhost:3000`.
6. You're all set! 🎉

## Test Deployments

Test deployments are automatically created on PR into `main` and `dev` branches using the workflow: `firebase-hosting-pull-request.yml`. The URLs for the test deployment are provided in the PR checks.

In order to use Google Auth and access the test deployment, you will need to add it as an authorized domain in the Firebase Console. The domain is the URL provided in the PR checks. Removing the domain from the authorized domains when no longer needed is recommended.

## Sponsor

[Professor Heather Bateman](https://www.linkedin.com/in/heather-bateman-68341013/) - Professor and Researcher of Biology

## Contributors

### 2022

<a href="https://github.com/ilathem"><img src="https://github.com/ilathem.png" width="50" height="50" alt="Isaiah Lathem"></a>
<a href="https://github.com/jakBkwik"><img src="https://github.com/jakBkwik.png" width="50" height="50" alt="Jack Norman"></a>
<a href="https://github.com/realdgrassl"><img src="https://github.com/realdgrassl.png" width="50" height="50" alt="Dennis Grassl"></a>  
<a href="https://github.com/ianskelskey"><img src="https://github.com/ianskelskey.png" width="50" height="50" alt="Ian Skelskey"></a>
<a href="https://github.com/zacharyjacobson"><img src="https://github.com/zacharyjacobson.png" width="50" height="50" alt="Zachary Jacobson"></a>
