const fs = require('fs');
const path = require('path');

const dotenv = () => {
    const envPath = path.join('.env');
    try {
      const envContent = fs.readFileSync(envPath, 'utf-8');
    
      envContent.split('\n').forEach((line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    
      console.log('env loaded successfully');
    } catch (error) {
      console.error('Error loading env:', error);
    }
}
module.exports = dotenv;