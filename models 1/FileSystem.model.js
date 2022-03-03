export class FSFileSystem {
  constructor(fileRefs, folderRefs, fileDataConnection, rootId) {
    this.root;
    this.fileRefs = fileRefs;
    this.folderRefs = folderRefs;
    this.fileDataConnection = fileDataConnection;
    this.rootId = rootId;

  }
  
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
