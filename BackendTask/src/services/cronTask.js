// Cron job to monitor an external link every 30 secounds
import axios from 'axios';
import cron from 'node-cron';

cron.schedule('*/30 * * * * *', async () => {
    try {
      const response = await axios.get('https://wasserstoff-mwr1.onrender.com');
      console.log(`External link is up. Status code: ${response.status}`);
    } catch (error) {
      console.error('Error accessing external link:', error.message);
    }
  });
  
  export default cron;