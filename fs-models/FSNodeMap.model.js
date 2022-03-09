export class FSNamedMap extends Map {
  constructor({name, entries}) {
    super(entries);
    // console.log('super', super);
    if (Array.isArray(entries)) {}
    this.name = name
  }
  // set(key, value) {
  //   super.set(key, value);
  //   return this;
  // }
  get(key) {
    return super.get(key);
  }
  
  // get name() {
  //   return this._name 
  // }


}

export class FSNodeMap extends FSNamedMap {
  constructor(entries, name = null, parentName = null) {
    super({entries, name});
    this.parentNode = parentNode;
    this.parentId = parentId;
  };
  get(key) {
    //...Return References that only query data wgen called
  }
}
