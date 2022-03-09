import store from '/db/store.db.js'
import { FSNodeModel } from '/fs-models/FSNode.model.js'
import { FSNodeMap, FSNamedMap, FSFileModel } from './index.js';

export class FSFolderModel extends FSNodeModel {
  constructor(model, parent) {
    super(model);
    this._parent = parent
    this._children = new Map()
    this.childrenRefs = model.childrenRefs

    // let fileChildren = model.children = [
    //   ...model.childrenRefs.files.map(id => {
    //     const file = new FSFileModel(store.file(id));
    //     return [file.name, file]
    //   }) || [[]],
    //   ...(model.childrenRefs.folders || [[]]).map(id => {
    //     const folder = new FSFolderModel(store.folder(id));
    //     return [folder.name, folder]
    //   })
    // ]
    // let folderChildren = model.children = [
    //   ...model.childrenRefs.files.map(id => {
    //     const file = new FSFileModel(store.file(id));
    //     return [file.name, file]
    //   }) || [[]],
    //   ...(model.childrenRefs.folders || [[]]).map(id => {
    //     const folder = new FSFolderModel(store.folder(id));
    //     return [folder.name, folder]
    //   })
    // ]
    // console.log('model', model)
    // console.log('this._children ', [...this._children])
  }

  loadChildren() {
    if (this.loaded) return;
    const children = Object.entries(this.childrenRefs)
      .reduce((acc, [key, prop], i) => {
        return [
        ...acc,
         ...prop.map(id => {
            if (key === 'file') {}
            // try {

            const item = key === 'folders' ?
              new FSFolderModel(store.folder(id), this) :
              new FSFileModel(store.file(id), this)
            return [item.name, item]
            // } catch (e) {
            // return []
            // }
          })

        ]
      }, [])
      .forEach(([k, v], i) => {
        this._children.set(k, v)
      })
    return this._children
  }

  insert(node) { // ? SHOULD ID OR NAME BE USED AS KEY HERE?
    if (node === this) throw new Error('Cannot insert folder into itself')
    // console.log('node', node)
    node.parent = this;
    // console.log('node,this', node, this)
    return this.children.set(node.name, node)
  }

  get(nodeName) { // ? SHOULD ID OR NAME BE USED AS KEY HERE?
    return this.children.get(nodeName)
  }

  find(comparerFn) {
    let result = null;
    for (const value of this.content) {
      if (comparerFn(value)) {
        console.log({ value });
        result = value
        break;
      }
    }
    return result
  }

  findAll(comparerFn) {
    let result = [];
    for (const value of this.children.values()) {
      if (comparerFn(value)) { result = [...result, value] }
    }
    return result
  }


  has(nodeName) { // ? SHOULD ID OR NAME BE USED AS KEY HERE?
    return this.children.has(nodeName)
  }

  remove(nodeName) { // ? SHOULD ID OR NAME BE USED AS KEY HERE?
    return this.children.delete(nodeName)
  }

  get children() { return this._children }
  get loaded() { return this._children.length > 0 }

  get content() { return [...this.children.values()] }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}