export default class EventCard {
  constructor(event) {
    this.event = event

    this.root = document.createElement('div')
    this.root.style.float = "none"
    this.row = document.createElement('div')
    this.root.appendChild(this.row)
    this.buttons = document.createElement('div')
    this.root.appendChild(this.buttons)
    this.root.appendChild(document.createElement('br'))

    for (let [k, v] of Object.entries(event)) {
      if (k == "_id") continue
      const div = this.createCol(k, v)
      this.row.appendChild(div)
    }
    console.log(event)

    const addbtn = document.createElement('button')
    addbtn.addEventListener('click', () => {
      this.row.appendChild(this.createCol("test", ""))
    })
    addbtn.innerText = "add column"
    this.buttons.appendChild(addbtn)

  }

  createCol(key, value, type) {
    const div = document.createElement('div')
    div.style.float = "left"
    const label = document.createElement('label')
    label.for = key
    label.innerText = key
    div.appendChild(label)
    const input = document.createElement('input')
    input.name = key
    input.value = value
    if (type) input.type = type
    div.appendChild(input)
    return div
  }

}