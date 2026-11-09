// Import the Express app
const app = require('./src/app');

// Choose the port for the server
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
