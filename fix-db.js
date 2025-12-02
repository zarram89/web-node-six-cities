
import { MongoClient } from 'mongodb';

const uri = 'mongodb://admin:test@localhost:27017/six-cities?authSource=admin';
const client = new MongoClient(uri);

const CITIES = {
  Paris: { latitude: 48.85661, longitude: 2.351499 },
  Cologne: { latitude: 50.938361, longitude: 6.959974 },
  Brussels: { latitude: 50.846557, longitude: 4.351697 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314 }
};

async function run() {
  try {
    await client.connect();
    const database = client.db('six-cities');
    const offers = database.collection('offers');

    const cursor = offers.find({});
    let count = 0;

    for await (const offer of cursor) {
      if (typeof offer.city === 'string') {
        const cityName = offer.city;
        const location = CITIES[cityName];

        if (location) {
          await offers.updateOne(
            { _id: offer._id },
            {
              $set: {
                city: {
                  name: cityName,
                  location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    zoom: 10
                  }
                }
              }
            }
          );
          count++;
        }
      }
    }
    console.log(`Updated ${count} offers`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
