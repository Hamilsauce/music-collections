import { FSObject } from './FSObject.js';

export class FSNode {
  constructor({ name = '', nodeType = 'file', id = '', parentId = '', isRoot = null }) {
    this._id;
    this._name;
    this._nodeType;

    this._node = document.querySelector('#fs-node-template').content.firstElementChild.cloneNode(true);
    console.log('this._node', this._node)
    this.id = id;
    this.name = name;
    this.nodeType = nodeType;

    this.parentId = parentId;
    this.isRoot = isRoot === true ? true : false;


  }

  init() {
    this.classList('a', 'fs-node')
  }

  classList(action = 'a', ...classes) {
    if (['a', 'add'].includes(action)) {
      this.node.classList.add(...classes)
    } else if (['r', 'remove'].includes(action)) {
      this.node.classList.remove(...classes)

    }
  }

  el(elementName = '') {
    return this.node.querySelector(`.fs-node--${elementName}`)
    return this.node.querySelector(`.fs-node--${elementName}`)
  }
  els(selector = '') {
    return this.node.querySelectorAll('[class*="fs-node--"]')
  }

  hide() {}
  show() {}
  nextSibling() {}
  trigger() {}
  select() {}
  isExpanded() {}

  handleClick() {}
  handleFocus() {}
  handleBlur() {}


  get node() { return this._node }

  get id() { return this._id }
  set id(val) {
    this._id = val;
    this.node.id = val
  }
  get name() { return this._name }
  set name(val) {
    this._name = this._name ? this._name : val;
    this.node.dataset.name = this.name;
    console.log('this.node.', this.node)
    this.el('name').textContent = this.name
  }
  get nodeType() { return this._nodeType }
  set nodeType(val) {
    this._nodeType = this._nodeType ? this._nodeType : val;
    this.node.dataset.nodeType = this.nodeType
  }
}
