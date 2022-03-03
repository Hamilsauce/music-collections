export class DataAccessor {
  constructor() {}

  static setHandle(data) { return this.return(data) }

  static return(data) { return (action) => this[action](data) }

  static subcollections(rawDataObject = {}, ...topLevelPropKey) {
    return [...topLevelPropKey]
      .reduce((output, key, i, arr) => rawDataObject
        .hasOwnProperty(key) ? [
          ...output,
          { name: key, data: rawDataObject[key] }
        ] : [...output], []);
  }
}
