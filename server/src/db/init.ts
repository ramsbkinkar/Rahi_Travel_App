import fs from 'fs';
import path from 'path';
import { dbAsync } from '../config/db';

const initializeDatabase = async () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Read and execute the SQL initialization script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await dbAsync.exec(sqlScript);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run initialization if this file is run directly
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase; 