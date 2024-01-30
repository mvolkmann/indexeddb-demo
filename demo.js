import IDBEasy from './idb-easy.js';
import Dogs from './dogs.js';

async function getBodyText(body) {
  const reader = body.getReader();
  let result = '';
  while (true) {
    const {done, value} = await reader.read();
    const text = new TextDecoder().decode(value);
    result += text;
    if (done) break;
  }
  return result;
}

await IDBEasy.deleteDB('myDB');

const db = await IDBEasy.openDB('myDB', 1, (db, event) => {
  const store = db.createObjectStore('dogs', {
    autoIncrement: true,
    keyPath: 'id'
  });
  store.createIndex('name-index', 'name', {unique: false});
  store.createIndex('breed-index', 'breed', {unique: false});
});

const dogs = new Dogs(new IDBEasy(db));
await dogs.addDog({name: 'Comet', breed: 'Whippet'});
await dogs.addDog({name: 'Oscar', breed: 'German Shorthaired Pointer'});
await dogs.addDog({name: 'Snoopy', breed: 'Beagle'});
await dogs.updateSnoopy();
await dogs.deleteDog(2);
const response = await dogs.getDogs();
const tbody = document.querySelector('tbody');
tbody.innerHTML = await getBodyText(response.body);
