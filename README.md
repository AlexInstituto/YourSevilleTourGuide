---
lang: en
title: Document
viewport: width=device-width, initial-scale=1.0
---

# 📱 YourSevilleTourGuide {#yoursevilletourguide}

![](https://img.shields.io/badge/Expo-000000?logo=expo&logoColor=white)
![](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![](https://img.shields.io/badge/License-MIT-yellow.svg)

YourSevilleTourGuide is a mobile application built with **Expo**,
**React Native**, and **TypeScript**, designed to provide a guided and
personalized experience for users visiting Seville. It includes user
authentication powered by **Supabase** and follows a clean, scalable
architecture.

---

## 📑 Table of Contents {#table-of-contents}

1.  [Overview](#overview)
2.  [Features](#features)
3.  [Tech Stack](#tech-stack)
4.  [Project Structure](#project-structure)
5.  [Installation](#installation)
6.  [Available Scripts](#available-scripts)
7.  [Module Documentation](#module-documentation)
8.  [Future Improvements](#future-improvements)
9.  [License](#license)

---

## 🧾 Overview {#overview}

**YourSevilleTourGuide** enhances the travel experience of users
exploring Seville. The app features an authentication flow using
Supabase, reusable UI components, centralized styling, and a modular
architecture prepared for future features like maps, tourist routes, and
recommendations.

---

## ✨ Features {#features}

- 🔐 User authentication (login & registration) via Supabase
- 📱 Reusable UI components: Button & Input
- 🎨 Centralized color configuration
- 🧭 Authentication navigation flow
- 🟦 Fully typed with TypeScript
- ♻️ Clean and scalable folder structure

---

## 🛠 Tech Stack {#tech-stack}

- React Native (Expo)
- TypeScript
- Supabase
- React Navigation
- Context API

---

## 📂 Project Structure {#project-structure}

    /src
     ├── components
     │    ├── Button.tsx
     │    └── Input.tsx
     │
     ├── constants
     │    └── colors.ts
     │
     ├── contexts
     │    └── AuthContext.tsx
     │
     ├── navigation
     │    └── AuthStack.tsx
     │
     ├── screens
     │    ├── LoginScreen.tsx
     │    └── RegisterScreen.tsx
     │
     ├── services
     │    └── supabase.ts
     │
     └── types
          └── index.ts

---

## 🚀 Installation {#installation}

### 1️⃣ Clone the repository {#clone-the-repository}

    git clone https://github.com/youruser/YourSevilleTourGuide.git
    cd YourSevilleTourGuide

### 2️⃣ Install dependencies {#install-dependencies}

    npm install

or

    yarn install

### 3️⃣ Configure Supabase {#configure-supabase}

Edit `/src/services/supabase.ts`:

    const supabaseUrl = "YOUR_SUPABASE_URL";
    const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

### 4️⃣ Start the project {#start-the-project}

    npx expo start

---

## 📜 Available Scripts {#available-scripts}

| Script       | Description                     |
| ------------ | ------------------------------- |
| expo start   | Run the app in development mode |
| expo android | Launch Android emulator         |
| expo ios     | Launch iOS simulator            |
| expo build   | Create a production build       |

---

## 🧩 Module Documentation {#module-documentation}

### 🔹 Components {#components}

#### Button.tsx {#button.tsx}

Reusable button component styled with the app theme.

#### Input.tsx {#input.tsx}

Controlled input component used in login and registration forms.

### 🔹 Constants {#constants}

#### colors.ts {#colors.ts}

Centralized color palette for consistent styling.

### 🔹 Contexts {#contexts}

#### AuthContext.tsx {#authcontext.tsx}

Manages authentication state using Context API and Supabase (login,
logout, register).

### 🔹 Navigation {#navigation}

#### AuthStack.tsx {#authstack.tsx}

Defines the authentication flow:

- LoginScreen
- RegisterScreen

### 🔹 Screens {#screens}

#### LoginScreen.tsx {#loginscreen.tsx}

Login form connected to Supabase.

#### RegisterScreen.tsx {#registerscreen.tsx}

Screen for user registration.

### 🔹 Services {#services}

#### supabase.ts {#supabase.ts}

Initializes the Supabase client.

### 🔹 Types {#types}

#### index.ts {#index.ts}

Global TypeScript types shared across components and screens.

---

## 🧭 Future Improvements {#future-improvements}

- 🗺 Interactive tourist maps
- 📍 Guided routes
- 🎧 Audio guides
- ⭐ Favorites system
- 🌐 Multi-language support
- 🔔 Push notifications
- 📥 Offline mode

---

## 📄 License {#license}

This project is licensed under the **MIT License**. You may use, modify,
and distribute it freely.
