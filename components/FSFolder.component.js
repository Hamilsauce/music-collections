const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
// const { download, date, array, utils, text } = ham

import { FSNode } from '/components/FSNode.component.js';
import { FSFileComponent } from '/components/FSFile.component.js';

export class FSFolderComponent extends FSNode {
  constructor(model, messages$) {
    super(model, messages$);
    this.model = model
    this._nodeContent = null;
    this.files = new Map();
    this.loadedChildren = []
    this.hasLoadedChildren = false

    this.children = this.model.children
    this._name; //  = this.name;
    this._id
   
    this.messages$.pipe(
      filter(_ => _ === this.id),
      // tap(x => console.log('foldèr messagw aftr filter', x)),
      tap(x => console.log('Heard Click on ID, NAME', this)),
      tap(x => this.toggleNodeContent()),
    ).subscribe()
    this.loadChildNodes()
    // console.log('FOLDER', this);
  }

  append(element, parent, position, callback = () => {}) {
    if (position) { parent.insertBefore(element, position); }
    else { parent.appendChild(element); }

    callback(element, parent);
    return element;
  }

  async getChildren() {
    this.children = await this.model.children
  }

  createNode(model, refFunction) {
    let node;
    if (model.nodeType === 'folder') {
      node = new FSFolder(model) //, this.store)
    } else if (model.nodeType === 'file') {
      node = new FSFile(model, refFunction)
    }
    return node;
  }

  // append(target, node) {
  //   target.appendChild(node);
  // }

  async loadChildNodes() {
    if (this.name === 'file-system') return
    if (this.hasLoadedChildren) return
    // console.log('[... this.children.folders.values()]', [... this.children.folders.values()])
    // const folders = await this.children.folders.values()
    // const files = await this.children.files.values()
    const nodes = await this.children.values()

    for (const child of nodes) {
      const messages$ = this.messages$
        .pipe(

          // filter((_) => _ === child.id),
          // map(_ => _.id),
        );

      let childComp;
      if (child.nodeType === 'folder') {
        childComp = new FSFolderComponent(child, messages$)

      } else {
        childComp = new FSFileComponent(child, messages$)

      }

      this.loadedChildren.push(childComp)
      this.append(childComp.node, this.nodeContent)
    }
this.hasLoadedChildren = true;
    // for (const child of files) {
    //   const childComp = new FSFolder(model) //, this.store)

    //   this.loadedChildren.push(childComp)
    //   this.append(childComp.node, this.nodeContent)
    // }
    // console.log('loadChildNodes this ', this)
 
  }

  handleSelect(e) {
    if (this.isEventTarget(e, 'body')) this.toggleNodeContent();
  }

  isEventTarget(event, elementName = '') {
    return [...event.path].includes(this.el(elementName))
  }

  toggleNodeContent() {
    this.show = !this.show;
  }

  queryFiles() {
    this.children.files.forEach((ref, key) => {
      ref.data = ref.modelFunction();
    });
  }

  createnodeContentElement() {
    this.nodeContent = document.createElement('ul');
    this.nodeContent.classList.add('fs-node-nodeContent')
    this.show = false;

    // this.loadChildNodes()
  }

  get nodeContent() { return this._nodeContent === null ? this.el('.fs-node-content') : this._nodeContent };

  set nodeContent(val) { this._nodeContent = val; }

  set children(val) {
    if (this.loadedChildren) return;
    this._children = val;
    // this.loadChildNodes()

  }
  get children() { return this._children }

  get show() { return this._show };
  set show(val) {
    if (this.name === 'file-system') return
    // console.log(' show val, dataset', val,this.nodeContent )

    this.nodeContent.dataset.open = val
    this.node.dataset.open = val
    this._show = val;
    if (val === true) {
      // this.node.appendChild(this.nodeContent)
    } else if (val === false) {
      // this.nodeContent.remove()
    }

    this.nodeContent.classList[val === true ? 'add' : 'remove']('show')
  }

  // get  children() { return  this._children}
  // get childCount() { return this.children.files.size + this.children.folders.size };
}
