class FormWrapper extends HTMLElement {
  constructor() {
    super()
  }
  getInputs() {
    const inputs = this.parse().inputs
    const ret = []
    for (let elm of inputs) {
      const input = {}
      for (let attr of ["type", "name", "value"])
        if (elm[attr] !== undefined) input[attr] = elm[attr]
      if (elm.type == "checkbox") input.value = elm.checked
      if (elm.type == "datetime-local") input.value = new Date(Date.parse(elm.value))
      ret.push(input)
    }
    return ret
  }
  submitClick(func) {
    const submit = this.parse().submit
    submit.addEventListener('click', e => {
      e.preventDefault()
      func(e)
    })
  }
  send(url, method, object, log) {
    if (log == "all") console.log(`== send function of FormWrapper class ==`)
    if (log == "all") console.log(`method:${method}, url:${url}`)
    if (log == "all") console.log(`send object: ${JSON.stringify(object)}`)
    let promise;
    if (method == "GET") primise = fetch(url)
    else if (method == "POST") promise = fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(object)
    })
    else throw "UNKNOWN_METHOD"
    return promise.then(res => {
      if (res.ok) return res.json()
      if (res.status == 404) throw "NOT_FOUND"
      throw `UNKNOWN_NETWORK_ERROR:${res.status}:${res.statusText}`
    }).catch(e => console.log(e))
  }
  parse() {
    const inputs = [];
    let submit;
    for (let elm of this.children) {
      if (elm.type == "submit") submit = elm
      else inputs.push(elm)
    }
    if (submit === undefined) throw "SUBMIT_IS_UNDEFINED"
    return { submit, inputs }
  }
}

window.customElements.define('form-wrapper', FormWrapper);