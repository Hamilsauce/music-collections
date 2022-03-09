import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { DOM } = ham;

export class UIObject {
  constructor(selector) {
    this.selector = selector;
    this.template;
    
    this.domParser = new DOMParser()
 
  }

  template() {}

  parseHTML(htmlString) {
    return this.domParser.parseFromString(htmlString, 'image/svg+xml').documentElement //.firstElementChild
  }

  render() {
    // this.clearEl(this.root)
    this.root.innerHTML = this.template();
    return this.root
  }

  createEl({ tag = 'div', attrs = {}, children = [], template = '' }) {
    const el = DOM.newElement(tag, attrs, children, template)
    if (typeof value === 'string') { el.innerHTML = value; }
    else { this.append(el, value) }
    return el;
  }

  getEl(selector) { return this.root.querySelector(selector) }

  getEls(selector) { return [...this.root.querySelectorAll(selector)] }

  setEl(el, value) {
    this.clearEl(el);
    if (typeof value === 'string') { el.innerHTML = value; }
    else { this.append(el, value) }
    return el;
  }

  clearEl(el) {
    el.innerHTML = '';
    return el;
  }

  swapOutEls(parent, newEl, currEl) {
    if (!parent.contains(currEl)) return this.append(newEl, parent);

    parent.insertBefore(newEl, currEl);
    parent.removeChild(currEl);
    return newEl;
  }

  append(child, el) {
    el = el ? el : this.root;
    el.appendChild(child);
    return child;
  }

  setText(el, text = '') {
    el.textContent = text
    return el;
  }

  getText(el) {
    return el.textContent;
  }

  classList(action = 'add', classes = []) {
    if (['add', 'a'].includes(action)) { el.classList.add(...classes) }
    else if (['remove', 'r'].includes(action)) { el.classList.remove(...classes) }
    return el;
  }
  // classList(action = 'add', classes = [], action = 'add') {
  //   if (['add', 'a'].includes(action)) { el.classList.add(...classes) }
  //   else if (['remove', 'r'].includes(action)) { el.classList.remove(...classes) }
  //   return el;
  // }

  get root() { return document.querySelector(this.selector) }

  get children() { return [...this.root.children] }

  get childCount() { return this.children.length }

  get innerHTML() { return this.root.innerHTML }
  set innerHTML(val) { this.root.innerHTML = val }
}
