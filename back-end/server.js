import { app, PORT } from './app.js';

app.listen(PORT, () => {
    try {
        console.log(`✅ Server is running on port ${PORT}`);
    } catch (error) {
        console.error('❌ Error starting the server:', error);
    }

})