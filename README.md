# Hierarchical Dropdown Project

A simple full-stack project with cascading dropdowns for Country → Division → District → City/Upazila selection, powered by MySQL database.

## Features

- 🌍 Hierarchical location selection with dependent dropdowns
- 🔒 Smart cascading: each dropdown unlocks only after selecting parent
- 🔄 Dynamic data loading from MySQL database
- 🛠️ Auto-creates database and tables in development mode
- 📦 Single project structure with frontend and backend

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express
- **Database**: MySQL

## Project Structure

```
dropdown_project/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── config/
│   │   └── db.js              # MySQL connection & auto-creation
│   ├── models/
│   │   └── schema.js          # Database schema & table creation
│   ├── controllers/
│   │   └── locationController.js  # Business logic
│   └── routes/
│       └── locationRoutes.js  # API endpoints
├── frontend/
│   ├── index.html             # Main HTML page
│   ├── css/
│   │   └── style.css          # Styling
│   └── js/
│       ├── app.js             # Main application logic
│       └── api.js             # API communication module
├── package.json
├── .env                       # Environment variables
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- MySQL Server installed and running

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Configuration

Edit `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=location_db
DB_PORT=3306
PORT=3000
```

### 4. Run the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## API Endpoints

- `GET /api/countries` - Get all countries
- `GET /api/divisions/:countryId` - Get divisions for a country
- `GET /api/districts/:divisionId` - Get districts for a division
- `GET /api/cities/:districtId` - Get cities for a district

## Database Schema

The application will automatically create these tables:

- **countries**: id, name
- **divisions**: id, name, country_id
- **districts**: id, name, division_id
- **cities**: id, name, district_id

## How It Works

1. **Page Load**: Country dropdown loads with all countries
2. **Country Selection**: Enables division dropdown, loads divisions for selected country
3. **Division Selection**: Enables district dropdown, loads districts for selected division
4. **District Selection**: Enables city dropdown, loads cities for selected district
5. **Reset Logic**: Changing parent selection resets all child dropdowns

## Development Notes

- Database and tables are auto-created on first run (development only)
- Sample data is inserted automatically if tables are empty
- Frontend is served as static files from the backend

## License

ISC
