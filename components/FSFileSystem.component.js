const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
// const { download, date, array, utils, text } = ham

import { FSFolderComponent } from '/components/FSFolder.component.js';
import { FSFileComponent } from '/components/FSFile.component.js';
import { CollapsibleNode } from '/components/CollapsibleNode.component.js'
import { FSFileSystemModel } from '/fs-models/index.js'


export class FSFileSystemComponent extends FSFileSystemModel {
  constructor(store) {
    super(store);
    this.ui = {
      root: document.querySelector('#file-system'),
      content: document.querySelector('#fs-content-display'),
      children: new Map()

    }

    this.clicks$ = new Subject()
    this.clicksEvents$ = fromEvent(this.ui.root, 'click')
      .pipe(
        tap(x => console.log('CLICK', x)),
        // GET NODE/FILE ID, BROADCAST
        // tap(e => e.preventDefault()),
        // tap(e => e.stopPropagation()),
        map(e => {
          const targetNode = e.target.closest('.fs-node')
          return targetNode;
          return targetNode.id
        }),
        tap(x => console.log('FILE SYSTEM AFTER CLICK', this)),
      )
      .subscribe(this.clicks$)

    // this.makeRequest$ = this.clicks$
    //   .pipe(
    //     filter(_ => _.dataset.nodeType === 'folder'),
    //   tap(_=> this.openFolder(`${_.dataset.name}`)),
    //   // tap(_=> this.openFolder(`./${_.closest('.fs-node').querySelector('.fs-node-content').textContent}`))
    // // tap(x => this.request$.next(this.current)),  
    //     tap(x => console.log('FILE SYSTEM AFTER OPEN FOLDER', this)),
    //   )
    //   .subscribe()
      

    // this.renderStream = this.response$
      // .pipe(
      //   map(response => {
      //     // const node = this.createNode(this.currentFolder)
      //     const clicks$ = this.clicks$
      //       .pipe(
      //         filter((_) => _ && _.id), // && _.id === this.currentFolder.id),
      //         map(_ => _.id),
      //       );
      //     const node = new FSFolderComponent(this.currentFolder, clicks$)
      //     console.log('node', node)
      //     this.append(node.node, this.ui.content)
      //     if (this.currentFolder.isRoot) {

      //     } else {
      //       // this.append(node.node, this.currentFolder.nodeContent)

      //     }
      //     return node
      //   }),
      // ).subscribe()
  }

  render(tree = {}, targetElement = document.createElement('div')) {
    const containerEl = createContainerElement();

    traverse(tree, function(node) {
      node.el = createNodeElement(node);
      containerEl.appendChild(node.el);
    });

    targetElement.appendChild(containerEl);
  }

  expand(node) {
    traverse(node, function(child) {
      child.el.classList.remove(classes.HIDDEN);
      child.isExpanded = true;
      setCaretIconDown(child);
    });
  }

  collapse(node) {
    traverse(node, function(child) {
      child.isExpanded = false;
      if (child.depth > node.depth) child.el.classList.add(classes.HIDDEN);
      setCaretIconRight(child);
    });
  }

  destroy(tree) {
    traverse(tree, (node) => {
      if (node.dispose) {
        node.dispose();
      }
    })
    detach(tree.el.parentNode);
  }
  get folders() { return this._data.folders }
  set folders(val) { this._data.folders = val }

  createNode(model) {
    let node;
    const clicks$ = this.clicks$
      .pipe(
        filter((_) => _ && _.id), // && _.id === this.currentFolder.id),
        map(_ => _.id),
      );

    if (model.nodeType === 'folder') node = new FSFolderComponent(model, clicks$.asObservable())
    else if (model.nodeType === 'file') node = new FSFileComponent(model, clicks$.asObservable())
    return node;
  }

  append(element, parent, position, callback = () => {}) {
    if (position) { parent.insertBefore(element, position); }
    else { parent.appendChild(element); }

    callback(element, parent);
    return element;
  }

  listen(node, event, handler) {
    node.addEventListener(event, handler);
    return () => node.removeEventListener(event, handler);
  }

  detach(node) { node.parentNode.removeChild(node) }

  getDataType(val) {
    if (Array.isArray(val)) return 'array';
    if (val === null) return 'null';
    return typeof val;
  }

  traverseObject(target, callback) {
    callback(target);
    if (typeof target === 'object') {
      for (let key in target) {
        traverseObject(target[key], callback);
      }
    }
  }

  hideNodeChildren(node) {
    node.children.forEach((child) => {
      child.el.classList.add(classes.HIDDEN);
      if (child.isExpanded) hideNodeChildren(child);
    });
  }

  showNodeChildren(node) {
    node.children.forEach((child) => {
      child.el.classList.remove(classes.HIDDEN);
      if (child.isExpanded) {
        showNodeChildren(child);
      }
    });
  }

  toggleNode(node) {
    if (node.isExpanded) {
      node.isExpanded = false;
      setCaretIconRight(node);
      hideNodeChildren(node);
    } else {
      node.isExpanded = true;
      setCaretIconDown(node);
      showNodeChildren(node);
    }
  }

  createNodeElement(node = {}) {
    let el = element('div');

    const getSizeString = (node) => {
      const len = node.children.length;
      if (node.type === 'array') return `[${len}]`;
      if (node.type === 'object') return `{${len}}`;
      return null;
    }

    if (node.children.length > 0) {
      el.innerHTML = expandedTemplate({
        key: node.key,
        size: getSizeString(node),
      });

      const caretEl = el.querySelector('.' + classes.CARET_ICON);
      node.dispose = listen(caretEl, 'click', () => toggleNode(node));
    } else {
      el.innerHTML = notExpandedTemplate({
        key: node.key,
        value: node.value,
        type: typeof node.value
      })
    }

    const lineEl = el.children[0];
    if (node.parent !== null) { lineEl.classList.add(classes.HIDDEN) }

    lineEl.style = `margin-left: ${node.depth * 18}px;`
    return lineEl;
  }

  traverse(node = {}, callback = (node) => callback(node)) {
    callback(node);
    if (node.children.length > 0) {
      node.children.forEach((child) => {
        traverse(child, callback);
      });
    }
  }

  createNode(opt = {}) {
    return {
      key: opt.key || null,
      parent: opt.parent || null,
      value: opt.hasOwnProperty('value') ? opt.value : null,
      isExpanded: opt.isExpanded || false,
      type: opt.type || null,
      children: opt.children || [],
      el: opt.el || null,
      depth: opt.depth || 0,
      dispose: null
    }
  }

  createSubnode(data = {}, node = {}) {
    if (typeof data === 'object') {
      for (let key in data) {
        const child = createNode({
          value: data[key],
          key: key,
          depth: node.depth + 1,
          type: getDataType(data[key]),
          parent: node,
        });
        node.children.push(child);
        createSubnode(data[key], child);
      }
    }
  }

}
