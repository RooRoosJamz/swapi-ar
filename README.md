# Starship Management - AR

A React + .NET 8 application to manage Starships from the SWAPI API.

## Project Overview

- **Dynamic Table:** Sortable and filterable table of starships.
- **CRUD Operations:** Add/Edit/Delete starships.
- **Multi-select Filters:** Manufacturer and class filters.
- **Global Search:** Search across name, model, manufacturer, class, pilots, and films.
- **Seed Database:** Populate database with SWAPI starships.
- **Authentication:** Protected actions via authenticated role login.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/RooRoosJamz/swapi-ar.git
```

### 2. Navigate to directory
```bash
cd SWAPI_AR
```

### 3. Backend setup
Install necessary dependencies
```bash
dotnet restore
```
Configure database connections
- Open appsettings.json in the backend folder.
- Update the connection string to point to your local SQL Server instance.
Apply database migrations:
```bash
dotnet ef database update
```
Run the backend server:
```bash
dotnet run
```
- The backend  will be accessible at `https://localhost:7241/swagger`

### 4. Backend usage
- Navigate to `https://localhost:7241/swagger` to access API
Authorize Usage
- Create auth token to authorize usage of APIs
  1. Use the login API at `/api/Auth/login`
  2. Find login credentials included in `appsettings.json`
  > **Note:** Admin credentials will authorize usage of seeding, adding and deleting. Also these are for demo purposes only and not to be used in a production environment
  3. Copy the token from the response and click the **Authorize** button at the top right of the Swagger page.
- Seed data in database
  1. Utilize seeding API at `/api/StarshipSeeder/seed` to seed data or re-seed data from SWAPI starships
 
### 5. Frontend setup
- Navigate to frontend
```bash
cd ../frontend
```
- Install dependencies
```bash
npm install
```
- Start the frontend development server
```bash
npm start
```
- The frontend will be accessible at `http://localhost:3000`

### 6. Frontend usage
- Login with the same credentials found at `appsettings.json`
- If needed, seed data by clicking `Seed Data` on frontpage
- Add/Edit/Delete starship utilizing buttons located on table
- Sort column by clicking on column header

### Main page for reference

![Description of image](assets/starship-table.JPG)

