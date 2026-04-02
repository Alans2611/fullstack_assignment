# Full Stack Assignment - Dynamic Content Manager

A full-stack application that demonstrates form handling, validation, API communication, and dynamic UI updates. Built with React (frontend) and Node.js/Express (backend).

## Features

- **Two-column layout** with form and preview sections
- **Rich text editor** for paragraph content
- **Client-side validation** with real-time error messages
- **Server-side validation** with comprehensive error handling
- **Dynamic preview updates** on successful form submission
- **Responsive design** that works on all devices
- **Image URL validation** to ensure accessibility

## Tech Stack

### Frontend
- React 18
- React Quill (rich text editor)
- Axios (HTTP client)
- CSS3 (responsive design)

### Backend
- Node.js
- Express.js
- CORS (cross-origin resource sharing)
- Axios (image validation)

## Project Structure

```
fullstack-assignment/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── index.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

## Usage

1. **Start both servers** (backend on port 5000, frontend on port 3000)
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Fill out the form** with your content:
   - **Heading**: Enter a title for your content
   - **Paragraph**: Use the rich text editor to create formatted content
   - **Background Image URL**: Provide a valid image URL
   - **Text Color**: Enter a HEX color code (e.g., #FF5733)
4. **Submit the form** to see your content displayed in the preview section

## API Endpoints

### POST /api/content
Submits content data to the server.

**Request Body:**
```json
{
  "heading": "string",
  "paragraph": "string",
  "backgroundImage": "string (URL)",
  "textColor": "string (HEX color)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Content submitted successfully",
  "data": {
    "heading": "string",
    "paragraph": "string",
    "backgroundImage": "string",
    "textColor": "string"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field": "Error message"
  }
}
```

### GET /api/health
Health check endpoint to verify server status.

## Validation Rules

### Client-side Validation
- All fields are required
- Text color must be valid HEX format (#RRGGBB or #RGB)
- Background image must be valid URL format

### Server-side Validation
- All client-side validations
- Additional image accessibility check (verifies URL returns an image)
- Comprehensive error handling with specific error messages

## Error Handling

- **Form validation errors** are displayed inline with specific messages
- **Network errors** show user-friendly error messages
- **Server errors** are logged and return appropriate HTTP status codes
- **Image URL validation** checks if the URL is accessible and returns an image

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1024px)
- Mobile (480px - 768px)
- Small mobile (< 480px)

## Development Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Testing the Application

1. **Valid submission test:**
   - Fill all fields with valid data
   - Submit and verify preview updates
   - Check success message

2. **Validation test:**
   - Try submitting empty fields
   - Try invalid HEX color (e.g., "red" instead of "#FF0000")
   - Try invalid URL format
   - Try inaccessible image URL

3. **Rich text editor test:**
   - Test formatting options (bold, italic, lists, etc.)
   - Verify HTML is properly rendered in preview

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend is running on port 5000
2. **Image not loading**: Verify the image URL is accessible and returns a valid image
3. **Rich text editor not working**: Check if react-quill is properly installed
4. **Port conflicts**: Change ports in package.json if needed

### Port Configuration

If you need to change ports:
- Backend: Modify `PORT` in `backend/server.js`
- Frontend: Modify `proxy` in `frontend/package.json` (if needed)

## License

This project is for educational/assignment purposes only.

## Contact

For questions or issues regarding this assignment, please contact the hiring team.
