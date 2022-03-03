class MyClass {
  constructor() {
    console.log('this.stuff', this.stuff)
  };
    static stuff = 'stuff'

  static do() {
    return
  }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}


export default new MyClass
