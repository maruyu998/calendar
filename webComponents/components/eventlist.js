import EventCard from './eventCard.js'

class EventList extends HTMLDivElement {
  constructor() {
    super()
    this.events = []
  }

  async connectedCallback() {
    const events = await fetch('/api/events').then(res => res.json()).catch(e => console.error(e))
    for (let event of events) {
      const e = new EventCard(event)
      this.events.push(e)
      this.appendChild(e.root)
    }
  }

}

window.customElements.define('event-list', EventList, { extends: "div" });