# Frontend Project for RooMatch

This project is the frontend for the RooMatch application, which integrates with the existing backend to manage tasks and user interactions.

## Project Structure

```
frontend
├── public
│   └── index.html          # Main HTML file for the application
├── src
│   ├── main.tsx           # Entry point for the React application
│   ├── App.tsx            # Main App component with routing
│   ├── api
│   │   └── api.ts         # API calls to the backend
│   ├── pages
│   │   ├── Home           # Home page component
│   │   │   ├── Home.tsx
│   │   │   └── Home.module.css
│   │   └── Tasks          # Tasks page component
│   │       ├── Tasks.tsx
│   │       └── Tasks.module.css
│   ├── components
│   │   ├── Header         # Header component for navigation
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   └── TaskCard       # TaskCard component for displaying tasks
│   │       ├── TaskCard.tsx
│   │       └── TaskCard.module.css
│   ├── hooks
│   │   └── useAuth.ts     # Custom hook for authentication
│   ├── styles
│   │   └── global.css     # Global CSS styles
│   └── types
│       └── index.d.ts     # TypeScript types and interfaces
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
├── vite.config.ts          # Vite configuration file
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Features

- User authentication and task management.
- Responsive design using CSS Modules for scoped styling.
- Integration with the backend API for dynamic data handling.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.