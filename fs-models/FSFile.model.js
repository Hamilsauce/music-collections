import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { FSNodeModel } from '/fs-models/FSNode.model.js'

const { date, array, utils, text } = ham;


export const createFile = (data) => {
  const file = new FSFileModel(data);
  return file
}

export class FSFileModel extends FSNodeModel {
  constructor(model) {
    super(model);
    this._contentType = model.contentType;
    this._extension = model.extension;
    this._fileSize = model.size || 0;
  }

  create() {}
  open(viewing, playing, editing, printing) {}
  rename() {}
  copy() {}
  move() {}
  modify(attributes, properties, permissions) {}

  get filePath() { return `${this.FolderPath}${ this.name}` };

  get fileSize() { return this._fileSize };
  get contentType() { return this._contentType };
}
