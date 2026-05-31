# WanderLog - Your Travel Bucket List, Powered by Real-World Data

A React application where authenticated users explore countries around the world, search and filter them, view rich details, and build a personal travel bucket list.

## Features

✅ **Authentication** - Login/Signup with mock authentication (Reqres.in API)  
✅ **Protected Routes** - Only authenticated users can access the explore dashboard  
✅ **Session Persistence** - User session and bucket lists saved in localStorage  
✅ **Country Exploration** - Browse 250+ countries with search and filter  
✅ **Region Filtering** - Filter countries by region  
✅ **Sorting Options** - Sort by name, population, or area  
✅ **Country Details** - Rich information including capital, population, languages, currencies, timezones  
✅ **Bucket List** - Add countries to "Want to Visit" list  
✅ **Visited Tracker** - Mark countries as visited  
✅ **World Coverage Stat** - View population of countries in your bucket list  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## Tech Stack

- **React 18** (JSX)
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **Plain CSS** - No frameworks, pure styling
- **REST Countries API** - Free country data
- **Reqres.in** - Mock authentication API

## Quick Start

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/srikanthathina/react-assignment.git
   cd react-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Test Credentials

Use these credentials to log in:
- **Email**: `eve.holt@reqres.in`
- **Password**: `any password` (any password works)

Or create a new account using the sign-up tab (only test emails work, others show graceful error).

## APIs Used

### REST Countries API
- **Endpoint**: `https://restcountries.com/v3.1/all`
- **No API key required**
- **Returns**: ~250 countries with details (name, capital, region, population, area, flags, languages, currencies, timezones)

### Reqres.in (Mock Authentication)
- **Login**: `POST https://reqres.in/api/login`
- **Register**: `POST https://reqres.in/api/register`
- **Body**: `{ email, password }`
- **Note**: Works with fixed test emails like eve.holt@reqres.in

## Project Structure

```
src/
├── main.jsx          # Main React app with all components
├── styles.css        # Responsive styling
index.html            # Entry point
package.json          # Dependencies & scripts
vite.config.mjs       # Vite configuration
```

## Key Components

- **App** - Auth flow and session management
- **AuthScreen** - Login/Signup forms
- **Dashboard** - Main app UI after authentication
- **CountryCard** - Country grid item with actions
- **CountryDetail** - Full country information page
- **StatCard** - Bucket list and visited stats
- **ListPreview** - Quick preview of saved countries

## Improvements with More Time

1. **Automated Testing** - Unit tests for auth flow and list persistence
2. **Drag-to-Reorder** - HTML5 drag events for bucket list reordering
3. **Data Caching** - Cache REST Countries data for faster repeat visits
4. **Dark Mode** - Persistent theme toggle
5. **Real Backend** - Replace mock auth with proper JWT authentication
6. **Trip Planning** - Group countries by trip, add dates and budgets
7. **Map Integration** - Embedded country maps and travel route visualization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
