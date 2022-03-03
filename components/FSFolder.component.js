import { FSNode } from '/components/FSNode.component.js';
import { FSFile } from '/components/FSFile.component.js';

export class FSFolder extends FSNode {
  constructor(reference, store) {
    console.log('reference', reference)
    super(reference);
    this.store = store;
    // this.getChildren()
    this.nodeList = null;
    this.files = new Map();
    // this.folders = []
    this.loadedChildren = []

    this.model = reference

    this.children = this.model.children
    this.title = this.name;
    this.classList('a', 'fs-node--folder-node')
    this.createNodeListElement();
    this.show = false;

    this.node.addEventListener('click', this.handleSelect.bind(this))

    setTimeout(() => {
      console.log('THISS', this);
      if (this.isRoot) console.log('FOLDER THTHIS', this);
    }, 1000)


  }
  async getChildren() {

    this.children = await this.model.children
  }

  createNode(model, refFunction) {
    let node;
    if (model.nodeType === 'folder') {
      node = new FSFolder(model, this.store)
    } else if (model.nodeType === 'file') {
      node = new FSFile(model, refFunction)
    }
    return node;
  }

  append(target, node) {
    target.appendChild(node);
  }

  async loadChildNodes() {
    if (this.name === 'file-system') return
    // console.log('[... this.children.folders.values()]', [... this.children.folders.values()])
    const folders = await this.children.folders.values()
    const files = await this.children.files.values()

    for (const child of folders) {
      const childComp = new FSFolder(child, this.store)

      this.loadedChildren.push(childComp)
      this.append(this.nodeList, childComp.node)
    }
    
    for (const child of files) {
      const childComp = new FSFile(child, this.store)

      this.loadedChildren.push(childComp)
      this.append(this.nodeList, childComp.node)
    }
    console.log('loadChildNodes this ', this)
  }

  handleSelect(e) {
    if (this.isEventTarget(e, 'body')) this.toggleNodeList();
  }

  isEventTarget(event, elementName = '') {
    return [...event.path].includes(this.el(elementName))
  }

  toggleNodeList() {
    this.show = !this.show;
  }

  queryFiles() {
    this.children.files.forEach((ref, key) => {
      ref.data = ref.referenceFunction();
    });
  }

  createNodeListElement() {
    this.nodeList = document.createElement('ul');
    this.nodeList.classList.add('fs-node--nodeList')
    this.loadChildNodes()
    // this.node.appendChild(this.nodeList)
  }

  get show() { return this._show };
  set show(val) {
    if (this.name === 'file-system') return

    this._show = val;
    // console.log('[...this.children.folders]', [...this.children.folders])
    if (val === true) {
      this.node.appendChild(this.nodeList)
      // console.log('this.childCount', this.childCount)
    } else if (val === false) {
      this.nodeList.remove()
      console.log('this', this)
    }

    this.nodeList.classList[val === true ? 'add' : 'remove']('show')
  }

  // get  children() { return  this._children}
  // get childCount() { return this.children.files.size + this.children.folders.size };
}
