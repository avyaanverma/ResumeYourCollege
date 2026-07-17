import mongoose from 'mongoose';

async function connectToDB(url) {
  try {
    await mongoose.connect(url);
    console.log('DB Connected.');
  } catch (e) {
    console.log('Error incoming: ', e);
  }
}

export default connectToDB;
