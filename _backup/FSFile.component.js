import { FSNode } from '/components/FSNode.component.js';

export class FSFileComponent extends FSNode {
  constructor(model, messages$) {
    super(model);
  // console.log('this file', this)
    this.classList('a','file-node')
    this.data = {};
     
     Object.entries(model).forEach(([k, v], i) => {
       const isDate = ['dateCreated', 'dateModified', 'dateAccessed', 'changeTime'].includes(k)
       this[k] = (isDate ? new Date(Date.parse(v)) : v)
     })
  }

  // init(model) {
  //   // Object.entries(model).forEach(([k, v], i) => {
  //   //   const isDate = ['dateCreated', 'dateModified', 'dateAccessed', 'changeTime'].includes(k)
  //   //   this[k] = (isDate ? new Date(Date.parse(v)) : v)
  //   // })
  // }
// 
  getProperties() {
    // request file data object from file system
  }

}
