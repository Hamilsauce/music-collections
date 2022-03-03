import { FSNode } from '/components/FSNode.component.js';

export class FSFile extends FSNode {
  constructor(file, refFunction) {
  console.log('file', file)
    super(file);
    this.classList('a','file-node')
    this.data = {};
    
  }

  init(model) {
    Object.entries(model).forEach(([k, v], i) => {
      const isDate = ['dateCreated', 'dateModified', 'dateAccessed', 'changeTime'].includes(k)
      this[k] = (isDate ? new Date(Date.parse(v)) : v)
    })
  }

  getProperties() {
    // request file data object from file system
  }

}
