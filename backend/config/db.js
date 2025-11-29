const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB Connected Successfully');
    
    // Seed initial data if database is empty
    await seedInitialData();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed initial data
const seedInitialData = async () => {
  const User = require('../models/User');
  const Location = require('../models/Location');
  const Event = require('../models/Event');
  
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      // Create admin user
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@culturalvenues.hk'
      });
      await admin.save();
      console.log('✓ Admin user created');
      
      // Create test user
      const testUser = new User({
        username: 'testuser',
        password: 'testuser123',
        role: 'user',
        email: 'user@culturalvenues.hk'
      });
      await testUser.save();
      console.log('✓ Test user created');
      
      // Load venues and events
      const venues = require('../data/processedVenues.json');
      
      for (const venue of venues) {
        const locationExists = await Location.findOne({ venueId: venue.venueId });
        
        if (!locationExists) {
          const location = new Location({
            venueId: venue.venueId,
            name: venue.name,
            latitude: venue.latitude,
            longitude: venue.longitude,
            lastUpdated: new Date(),
            eventCount: venue.eventCount
          });
          const savedLocation = await location.save();
          
          // Add events
          for (const event of venue.events) {
            const newEvent = new Event({
              locationId: savedLocation._id,
              title: event.title,
              date: event.date,
              description: event.description,
              presenter: event.presenter
            });
            await newEvent.save();
          }
        }
      }
      console.log('✓ Initial venues and events loaded');
    }
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
};

module.exports = connectDB;