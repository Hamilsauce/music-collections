export class CollapsibleNode {
  constructor(model, parent) {
    this._template = document.querySelector(`#fs-node-template`).content.cloneNode(true);
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

    this.childClickListener = this.handleChildButtonClick.bind(this);
    this.content.addEventListener('child-clicked', this.childClickListener);
    this.clickListener = this.handleButtonClick.bind(this);
    this.button.addEventListener('click', this.clickListener);
  };

  createNode(model = {}, parent, callback = (n, p) => {}) {
    const n = new CollapsibleNode(model, parent);
    n.parent = this;
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
  }

  handleChildButtonClick(e) {
    this.adjustToChildHeight.bind(this)(e.detail.childMaxHeight)
  }

  adjustToChildHeight(childMaxHeight = '') {
    const childHeight = childMaxHeight;
    this.content.style.maxHeight = `${parseInt(this.content.scrollHeight) + parseInt(childHeight)}px`;
  }

  get id() { return this.self.id }
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
    this.toggleActiveState.bind(this)(this.active);

    if (!this.active) {
      this.nodes.forEach((ch) => {
        ch.active = false;
        ch.content.style.maxHeight = null
      });
    }
  }
};





// const fs = document.querySelector('#file-system');


// /fs.innerHTML = ''
// const rootNode = new CollapsibleRootNode({
// const rootNode = new CollapsibleNode({
//   isRoot: true,
//   id: 'id1',
//   nodeType: 'folder',
//   name: 'root',
// });

// const n1 = rootNode.createNode(
// {
//   isRoot: false,
//   id: 'id2',
//   nodeType: 'folder',
//   name: 'folder 5',

// }, rootNode)

// const n2 = n1.createNode(
// {
//   isRoot: false,
//   id: 'id3',
//   nodeType: 'folder',
//   name: 'FUCKINF 2',

// }, n1)
