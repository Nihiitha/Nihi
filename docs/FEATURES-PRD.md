# Features Product Requirements Document (PRD)

## Overview

This document outlines the features for a tutorial-based professional networking app, designed to teach students full-stack development through hands-on implementation. The focus is on learning outcomes and practical application of concepts, not production-level features.

## 1. Core Features (Milestone 1)

### User Authentication & Profile Management

- **Learning Goal:** Understand basic authentication flow and data persistence
- **Features:**
  - Email/password registration and login
  - Basic profile creation and editing
  - Profile picture upload (optional)

### Content Management

- **Learning Goal:** Master CRUD operations and data relationships
- **Features:**
  - Create and view posts
  - Basic post interactions (like/comment)

## 2. Advanced Features (Milestone 2)

### Navigation System

- **Learning Goal:** Implement responsive design principles
- **Features:**
  - Mobile: Hamburger menu
  - Tablet: Key features visible
  - Desktop: Horizontal navigation

### Feed Interface

- **Learning Goal:** Build responsive layouts
- **Features:**
  - Mobile: Single-column layout
  - Tablet: Two-column layout
  - Desktop: Three-column layout

### Job Board

- **Learning Goal:** Create search and filter functionality
- **Features:**
  - Job search with filters

## 3. Final Features (Milestone 3)

### Messaging System

- **Learning Goal:** Implement basic communication features
- **Features:**
  - Send and view messages
  - Basic chat UI

## 4. Learning Outcomes

By completing this tutorial, students will be able to:

- Build responsive layouts that adapt to different screen sizes
- Implement device-specific navigation systems
- Create and manage user profiles with data persistence
- Build and interact with a dynamic content feed
- Implement job search and application features
- Create a basic messaging system
- Deploy a full-stack application
- Use Git for version control
- Handle basic errors gracefully

## 5. Technical Requirements

- **Frontend:**
  - React for UI components
  - Tailwind CSS for styling
- **Backend:**
  - Flask for API endpoints
  - MySQL for data storage
- **Version Control:**
  - Git for project management
- **Deployment:**
  - Frontend: Netlify or AWS
  - Backend: Python Anywhere

## 6. Out of Scope

The following features are intentionally excluded to maintain focus on core learning objectives:

- Advanced security features
- Real-time functionality
- Complex accessibility features
- Production-level optimizations
- Advanced analytics
- Admin dashboards
- Complex image processing
- Advanced deployment strategies

---

This PRD is designed for educational purposes, focusing on fundamental concepts and practical implementation rather than production-level features.

---

## What I did:
- I created a user with:
  - **Username:** `testuser`
  - **Password:** `TestPassword123!`
  - **Email:** `testuser@example.com`
- I tested the login endpoint and it returned a valid token and user info (no error).

---

## What you should do in Postman or your frontend:

**Use these credentials:**
```json
{
  "username": "testuser",
  "password": "TestPassword123!"
}
```
or
```json
<code_block_to_apply_changes_from>
```

- Make sure your backend is running.
- Make sure you are sending the request to: `http://localhost:5000/api/login`
- Make sure the body is set to `raw` and `JSON`.

---

**You will now get a 200 OK response with a token and user info.  
If you still see "Invalid credentials", double-check the username and password you are sending.**

Let me know if you want to create another user or need help with the frontend!
