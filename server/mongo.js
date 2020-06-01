const { MongoClient } = require('mongodb');

module.exports = class Mongo {
  constructor(authflg, user, pass, address, authDatabase) {
    if (authflg) {
      this.mc = new MongoClient('mongodb://' + address, {
        authSource: authDatabase,
        auth: { user: user, password: pass },
        useUnifiedTopology: true
      });
    }
    else this.mc = new MongoClient('mongodb://' + address, { useUnifiedTopology: true });
    this.mc.connect();
    this.events = this.mc.db('calendar').collection('events');
  }

  async getEvents() {
    return await this.events.find().toArray()
  }

  async addEvent(event) {
    return await this.events.insertOne(event)
  }

}