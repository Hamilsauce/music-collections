export class NamedMap extends Map {
  constructor(name = null, entries) {
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


}

export class NodeMap extends NamedMap {
  constructor(entries, name = null, parentName = null) {
    super(entries, name);
    this.parentName = parentName;
  };
  get(key) {
    //...Return References that only query data wgen called
  }
}
