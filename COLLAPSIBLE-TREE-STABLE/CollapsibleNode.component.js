export class CollapsibleNode {
  constructor(model, parent) {
    this._template = document.querySelector(`#fs-node-template`).content.cloneNode(true); // temp.firstElementChild.cloneNode(true);
    this.self = this._template.querySelector('.node');

    this.button = this._template.querySelector('.collapsible-button');
    this.content = this._template.querySelector('.collapsible-content');
    this.childNodes = [...this.content.children].filter(_ => _.classList.contains('node'))
    this.nodes = new Map(this.childNodes.map(_ => [_, this.createNode(_)]))
    this.parent = parent
    this.isRoot = model.isRoot || false;
    this.id = model.id;
    this.nodeType = model.nodeType;
    this.name = model.name || 'Unnamed'
    this.active = false;
    // this.childClickListener =;
    this.content.addEventListener('child-clicked', this.handleChildButtonClick.bind(this))
    // this.clickListener = this.handleButtonClick.bind(this);
    this.button.addEventListener('click', this.handleButtonClick.bind(this))
  };

  createNode(model = {}, callback = (a, b) => {}) {
    const n = new CollapsibleNode(model, this);
    this.nodes.set(n.self, n)
    this.append(n)
    if (callback) callback(n)
    return n;
  }

  detachNode(element, callback = (n, p) => {}) {
    let n = this.getTargetNode(element)
    let p = n.parent

    if (n) {
      callback(n, p);

      n.button.removeEventListener('click', this.clickListener);
      n.content.removeEventListener('child-clicked', this.childClickListener);
      this.nodes.delete(element)
      p.removeChild(node.self)

      return p
    }
  }

  append(element, position, callback = (n, p) => {}) {
    if (position) { this.content.insertBefore(element.self, position); }
    else { this.content.appendChild(element.self); }

    callback(element);
    this.adjustToChildHeight.bind(this)(element.self.style.maxHeight)
    return element;
  }

  toggleActiveState(state) {
    this.self.dataset.active = state
  }

  buttonClicked(e) {
    return e.target === this.button || e.target.closest('.collapsible-button') === this.button
  }

  getTargetNode(e) {
    let t = e instanceof Event ? e.target : e;
    t = t.classList.contains('node') ? t : t.closest('.node');

    if (this.nodes.has(t)) { return this.nodes.get(t) }
    else return this
    return null;
  }

  handleButtonClick(e) {
    if (!this.buttonClicked(e)) return;
    this.active = !this.active

    if (this.content.style.maxHeight) {
      this.content.style.maxHeight = null;
    } else {
      this.content.style.maxHeight = this.content.scrollHeight + "px";
    }

    const childClickEvent = new CustomEvent('child-clicked', { bubbles: true, detail: { childMaxHeight: this.content.style.maxHeight } })
    this.self.dispatchEvent(childClickEvent)
    // console.log(e.target);
    // console.log('targer nos', this.getTargetNode(e.target));
    // this.scrollTo(this.getTargetNode(e.target))
    this.scrollToContent(this.getTargetNode(e.target))

  }

  handleChildButtonClick(e) {

    this.adjustToChildHeight(e.detail.childMaxHeight)
  }

  adjustToChildHeight(childMaxHeight = '') {
    const childHeight = childMaxHeight;
    this.content.style.maxHeight = `${parseInt(this.content.scrollHeight) + parseInt(childHeight)}px`;
  }

  scrollToContent(node) {
    console.log(node);
    node.content.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    return node
  }
  scrollTo(node) {
    if (node.isRoot) {
      return
    }
    const fs = document.querySelector('#file-system')
  
  
    // fs.firstElementChild.querySelector('.collapsible-content-wrapper')
    node.self.scroll({
      top: node.scrollHeight, //scroll to the bottom of the element
      behavior: 'smooth' //auto, smooth, initial, inherit
    });

    // node.self.parentElement.scroll({
    //   top: node.content.scrollHeight, //scroll to the bottom of the element
    //   behavior: 'smooth' //auto, smooth, initial, inherit
    // });
    // node.content.scroll({
    //   top: node.content.scrollHeight, //scroll to the bottom of the element
    //   behavior: 'smooth' //auto, smooth, initial, inherit
    // });


    // console.log(node);
    // node.content.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    return node
  }

  get id() { return this.model.id }
  set id(val) {
    this._id = val
    this.self.id = val
  }
  get name() { return this._name }
  set name(val) { this.button.textContent = val }
  get nodeType() { return this.self.dataset.nodeType }
  set nodeType(val) { this.self.dataset.nodeType = val }
  get active() { return this._active };
  set active(newValue) {
    this._active = newValue
    this.toggleActiveState(this.active);

    if (!this.active) {
      this.nodes.forEach((ch) => {
        ch.active = false;
        ch.content.style.maxHeight = null
      });
    }
  }
};