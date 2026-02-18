const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/localbiz';

console.log('Attempting to connect to MongoDB at:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Connection SUCCESSFUL!');
        console.log('MongoDB is running locally.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection FAILED.');
        console.error('Error:', err.message);
        console.error('\nPOSSIBLE CAUSES:');
        console.error('1. MongoDB service is not running.');
        console.error('2. MongoDB is running on a different port.');
        console.error('3. You do not have MongoDB installed locally.');
        process.exit(1);
    });
