# Project Name

## Overview
**Project Overview**

This project is a TypeScript-based React web application for creating and taking interactive quizzes. It features a user-friendly interface with customizable questions, multiple-choice options, and real-time feedback. The application has been configured using Vite, a modern build tool that provides fast development and hot module reloading.

**Project Requirements**

To run the project, basic knowledge of TypeScript and React is required. The only other dependencies are Node.js and Vite, which can be easily installed using npm. The project structure follows best practices for code organization and testing, making it easy to extend and maintain.

## Getting Started
## Installation Instructions for Quiz Web App

### 1. Cloning the Repository

```bash
git clone https://github.com/nishit-27/quizwebapp2.git
```

### 2. Dependency Installation

Install Node.js and npm if not already installed.

```bash
# Install Node.js and npm globally
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install --lts

# Install project dependencies
cd quizwebapp2-2a4cce0
npm install
```

### 3. Configuration Setup

#### a. Tailwind CSS Configuration

If not already set up globally, install Tailwind CLI:

```bash
npm install -g @tailwindcss/cli
```

Update the `tailwind.config.js` file with your preferred configuration options.

#### b. ESLint Configuration

Install ESLint locally:

```bash
npm install --save-dev eslint
```

Update the `.eslintrc.js` file to customize linting rules.

### 4. Running the Project Locally

```bash
# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser to view the running application.
