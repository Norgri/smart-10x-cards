# Smart 10x Cards

## Table of Contents
- [Project Name](#project-name)
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Name

Smart 10x Cards

## Project Description

Smart 10x Cards is a web application designed to automate and simplify the process of creating educational flashcards. It leverages artificial intelligence to generate flashcards from textbook images and offers manual editing features. Key functionalities include user registration, image uploads, AI-driven flashcard generation (including text extraction, translation, and optional phonetics), tag suggestions, as well as manual flashcard management and search capabilities.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
- **Backend:** Supabase (utilizing PostgreSQL and integrated user authentication)
- **AI Integration:** OpenRouter for accessing various AI models
- **CI/CD & Hosting:** GitHub Actions for continuous integration and DigitalOcean for deployment

## Getting Started Locally

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Norgri/smart-10x-cards.git
   cd smart-10x-cards
   ```
2. **Use the correct Node version:**
   The required Node version is specified in the `.nvmrc` file.
   ```bash
   fnm use
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

The following scripts are defined in the `package.json`:

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production deployment.
- **`npm run preview`**: Serves the production build locally.
- *(Additional scripts, such as testing or linting, may be available.)*

## Project Scope

This project focuses on delivering a minimum viable product (MVP) with the following features:

- User registration and authentication
- Uploading a textbook page image to generate flashcards
- AI-powered flashcard generation (including text extraction, translation, and optional phonetics)
- Automatic tag suggestions based on provided prompts
- Manual creation, editing, and deletion of flashcards
- Advanced flashcard search and filtering
- Logging of user interactions and AI actions for analytics

Future improvements may include additional features and refinements based on user feedback and performance metrics.

## Project Status

The project is currently in the MVP stage and is under active development. Ongoing enhancements and feature additions are planned as the project evolves.

## License

This project is licensed under the MIT License.
