const Mongo = require('./mongo');

const config = require('config');

const { authflg, user, pass, address, authDatabase } = config.mongo;

module.exports = class Parser {

  constructor() {
    this.Mongo = new Mongo(authflg, user, pass, address, authDatabase)
    this.parser = Object()
    this.parser['/api/events'] = this.getEvents.bind(this);
  }

  async getEvents(req, method) {
    if (method == "GET") {
      const res = await this.Mongo.getEvents();
      return res
    }
    if (method == "POST") {
      let { title, start, end, add_summary, daily } = req.body.events[0]
      start = new Date(start);
      end = new Date(end)
      if (daily) { start.setHours(0, 0, 0); end.setHours(0, 0, 0) }
      return await this.Mongo.addEvent({ title, start, end, add_summary, daily })
    }
  }


  async apiParser(req, method) {
    const url = req.url.replace(/\/$/g, '')
    console.log(method + " access to " + url)
    if (this.parser[url] === undefined) return { err: "url doesn't exist", detail: url }
    return await this.parser[url](req, method)
  }
}