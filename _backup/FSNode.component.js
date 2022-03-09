const { iif, ReplaySubject,AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
import { FSObject } from './FSObject.js';

const FSNodeInterface = {
  name: '',
  id: '',
  nodeType: 'file',
  parentId: '',
  isRoot: null
}


export class FSNode {
  constructor(model, messages$){
    this._id;
    this._name;
    this._nodeType; // = nodeType.toLowerCase()
    this._node // = document.querySelector(`#fs-${this.nodeType}-template`).content.firstElementChild.cloneNode(true);
    this._isRoot;
    this._children=model.children

    this._id = model.id;
    this.messages$ = messages$
    this._name = model.name;
    this._nodeType = model.nodeType;
    
    this.parent;
    this.isRoot;
    this.init()
  }

  init() {
    this.node = this.template()
    
    // this.classList('a', 'fs-node')
  }

  template() {
    return new DOMParser().parseFromString(
      `<li 
        id="${this.id}" 
        data-is-root="${this.isRoot}"
        data-node-type="${this.nodeType}"
        class="fs-node" 
        data-selected="false"
        data-name="${this.name}" 
        data-attached="false" 
        data-open="false" 
      >
        <div class="fs-node-body">
          ${(this.nodeType === 'folder' ? 
            `<svg class="folder-icon-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 512 512">
              <g id="drop-down-icon">
                <polygon points="128,192 256,320 384,192 	" />
              </g>
            </svg>` :
          '').trim()}
        <div class="fs-node-body-content">${this.name}</div>
          <div class="fs-node-body-controls">+</div>
        </div>
        ${(this.nodeType === 'folder' ?
        `<ul data-open="false" class="fs-node-content ${this.nodeType === 'folder' ? 'node-list' : 'attribute-list'}"></ul>` :
        '').trim()}
      </li>`,
      'text/html').documentElement.querySelector('li')
  }

  classList(action = 'a', ...classes) {
    if (['a', 'add', ''].includes(action)) {
      this.node.classList.add(...classes)
    } else if (['r', 'remove'].includes(action)) {
      this.node.classList.remove(...classes)
    }
  }

  el(elementName = '') {
    return this.node.querySelector(`${elementName}`)
  }

  els(selector = '') {
    return this.node.querySelectorAll('[class*="fs-node-"]')
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
  set node(val) {
    this._node = val
    return this._node
  }

  get id() { return this._id }
  set id(val) {
    this._id = val;
    this.node.id = val
  }

  get name() { return this._name }
  set name(val) {
    this._name = val
    this.node.dataset.name = this.name;
    this.el('.fs-node-body-content').textContent = this.name
  }

  get nodeType() { return this._nodeType }
  set nodeType(val) {
    this._nodeType = this._nodeType ? this._nodeType : val;
    this.node.dataset.nodeType = this.nodeType
  }
}
