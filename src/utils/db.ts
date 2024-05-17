// export default pgSqlClient;
import mongoose from 'mongoose';

export async function connectToMongoDB() {
  const mongoUri = process.env['MONGO_URI'];

  try {
    if (mongoUri !== undefined) {
      await mongoose.connect(mongoUri);
    }
    console.log('MongoDB Connected!!!');
  } catch (error) {
    console.log('Error while connecting to MongoDB:', error);
  }
}
