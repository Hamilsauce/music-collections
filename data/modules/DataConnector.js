export class Connection {
  constructor(source) {
    this.source;
  };

  push() { return (data) => d }
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

export class DataConnector {
  constructor(source) {
    this.connection = source ? new Connection(this.source) : null

  };

  push() { return (data) => d }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}