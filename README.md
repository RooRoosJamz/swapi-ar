# Starship Management - AR

A React + .NET 8 application to manage Starships from the SWAPI API.

## Project Overview

This project allows users to:

- View all starships in a **sortable, filterable table**
- Add, edit, and delete starships via a modal form
- Filter starships using multi-select for **manufacturer** and **class**
- Search globally across starship properties
- Seed the database with SWAPI data

---

## Features

- **Dynamic Table:** Sortable and filterable table of starships.
- **CRUD Operations:** Add/Edit/Delete starships.
- **Multi-select Filters:** Manufacturer and class filters.
- **Global Search:** Search across name, model, manufacturer, class, pilots, and films.
- **Seed Database:** Populate database with SWAPI starships.
- **Authentication:** Protected actions via `useAuth` context.
- **Responsive Design:** Works on desktop and mobile.

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

### 3. Backend Setup
- Install necessary dependecies
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
Run the backedn server:
```bash
dotnet run
```
- The backend API will be accessbile at https://localhost:7241/swagger