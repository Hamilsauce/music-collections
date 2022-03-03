import { FSFolder } from '/components/FSFolder.component.js';
import { FSFile } from '/components/FSFile.component.js';
export const treeBuilder = (store) => {
  const rootRef = store.reference('folder', store.collection('rootId'))
  const folderRefs = store.collection('folder')
  const fileRefs = store.collection('file')

  treeListEl.innerHTML = ''
  const root = new FSFolder(rootRef, store)
  treeListEl.appendChild(root.node)
}


export class FSFileSystem extends FSFolder {
  constructor(parentSelector = '.app-body', store) {
    super({ name: 'file-system', nodeType: 'file-system', id: 'treeView', parentId: null, isRoot: null }, store)
// this.get.childCount = null
    this._files = this.store.collection('file'),
    // this.children={
    //     files: this.store.collection('file'),
    //     folders: this.store.collection('folder'),
       
    // }
      this._data = {
        root: this.createNode(this.store.reference('folder', store.collection('rootId'), store)),
        folders: this.store.collection('folder'),
        files: this.store.collection('file'),
      }
    this.classList('a', 'treeView')
    this.node.id = 'treeView';

    this.nodeList.id = '#treeView--list';
    console.log('this.root', this.root)


    this.append(this.node, this.nodeList)
  }

  get root() { return this._data.root }
  set root(val) { this._data.root = val }
  get folders() { return this._data.folders }
  set folders(val) { this._data.folders = val }

  createNode(model, refFunction) {
    let node;
    if (model.nodeType === 'folder') node = new FSFolder(model, this.store)
    else if (model.nodeType === 'file') node = new FSFile(model, refFunction)
    return node;
  }

  append(target, node) { target.appendChild(node) }

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

  expandedTemplate(params = {}) {
    const { key, size } = params;
    return `
    <div class="line">
      <div class="caret-icon"><i class="fas fa-caret-right"></i></div>
      <div class="json-key">${key}</div>
      <div class="json-size">${size}</div>
    </div>
  `
  }

  notExpandedTemplate(params = {}) {
    const { key, value, type } = params;
    return `
    <div class="line">
      <div class="empty-icon"></div>
      <div class="json-key">${key}</div>
      <div class="json-separator">:</div>
      <div class="json-value json-${type}">${value}</div>
    </div>
  `
  }

  createContainerElement() {
    const el = element('div');
    el.className = 'json-container';
    return el;
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

  setCaretIconDown(node) {
    if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + classes.ICON);
      if (icon) {
        icon.classList.replace(classes.CARET_RIGHT, classes.CARET_DOWN);
      }
    }
  }

  setCaretIconRight(node) {
    if (node.children.length > 0) {
      const icon = node.el.querySelector('.' + classes.ICON);
      if (icon) icon.classList.replace(classes.CARET_DOWN, classes.CARET_RIGHT);
    }
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

  getJsonObject(data) {
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  create(jsonData = '' || {}) {
    const parsedData = getJsonObject(jsonData);
    const rootNode = createNode({
      value: parsedData,
      key: getDataType(parsedData),
      type: getDataType(parsedData),
    });
    createSubnode(parsedData, rootNode);
    return rootNode;
  }

  renderJSON(jsonData = '' || {}, targetElement = document.createElement('div')) {
    const parsedData = getJsonObject(jsonData);
    const tree = createTree(parsedData);
    render(tree, targetElement);
    return tree;
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
}
