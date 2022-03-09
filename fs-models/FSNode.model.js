export class FSNodeModel {
  constructor(model, parent) {
    // console.log('FSNodeModel', model)
    this._dateAccessed = model.dateAccessed || null;
    this._dateCreated = model.dateCreated || null;
    this._dateModified = model.dateModified || null;

    this._name = model.name || 'unnamed file';

    this._parent = parent || null;
    this._id = model.id || null;
    this._index = model.index || null;
    this._nodeType = model.nodeType || null;
    this._depth = model.depth || null;
    this._folderPath = model.folderPath || null;
    this._folderPathAsIds = model.folderPathAsIds || null;
  
    console.log('dir.parent', this.parent)
  }

  nameContains(keyword = '') {
    if (!keyword) return;
    return this.name.includes(keyword);
  }

  get copy() {
    return new FSNodeModel()
  }

  get name() { return this._name }
  set name(val) {
    if (!val || typeof val !== 'string' || !val.trim().length) {
      throw new Error(`Name of ${this.nodeType} must not be empty.`)
    }
    return this._name
  }


  get path() {
    return this.parent ? `${this.parent.path}/${this.name}` : this.name
    // if (this.parent) {

    // }
    // return ``
  }


  get parent() { return this._parent }
  set parent(newParent) {
    if (!(this.parent === newParent || newParent === null)) {
      const prevParent = this.parent;
      this._parent = newParent;

      if (prevParent) { prevParent.remove(this.name); }
      if (newParent) { newParent.insert(this); }
    }
  }

  get dateAccessed() { return this._dateAccessed }
  get dateCreated() { return this._dateCreated }
  get dateModified() { return this._dateModified }
  get folderPath() { return this._folderPath }
  get folderPathAsIds() { return this._folderPathAsIds }
  get id() { return this._id }
  get depth() { return this._depth }
  get index() { return this._index }
  get nodeType() { return this._nodeType }
}
