export class FSObject {
  constructor(reference = { name: '', nodeType: 'file', id: '', parentId: '', childrenRefs: [] }) {
    this.model = reference;
    this.element;
  }
  init() {}
}
