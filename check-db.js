
import { MongoClient } from 'mongodb';

const uri = 'mongodb://admin:test@localhost:27017/six-cities?authSource=admin';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('six-cities');
    const offers = database.collection('offers');

    const count = await offers.countDocuments();
    console.log(`Total offers: ${count}`);

    if (count > 0) {
      const distinctCities = await offers.distinct('city.name');
      console.log('Cities with offers:', distinctCities);

      const sample = await offers.findOne();
      console.log('Sample offer:', JSON.stringify(sample, null, 2));
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
