import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
// console.log(date.isValidDateValue);
export const createFile = (data) => {
  // console.log('createFile data',data);
  const file = new FileModel(data);
  // console.log('createFile file',file);
  return file
}

export const FileInterface = {
  index: { type: 'number', optional: false },
  dateAccessed: { type: 'date', optional: true },
  dateCreated: { type: 'date', optional: true },
  dateModified: { type: 'date', optional: true },
  changeTime: { type: 'date', optional: true },
  archive: { type: 'boolean', optional: true },
  compressed: { type: 'boolean', optional: true },
  contentType: { type: 'string', optional: true },
  device: { type: 'boolean', optional: true },
  directory: { type: 'boolean', optional: true },
  extension: { type: 'string', optional: true },
  folderPath: { type: 'string', optional: false },
  hidden: { type: 'boolean', optional: true },
  index: { type: 'number', optional: true },
  kind: { type: 'string', optional: false },
  name: { type: 'string', optional: true },
  offline: { type: 'boolean', optional: false },
  size: { type: 'number', optional: true },
  system: { type: 'boolean', optional: true },
}

export class BaseModel {
  constructor(type = 'Base') {
    this.type = type;
  }

}

export class NodeModel {
  constructor(type = 'Node', name, parent) {
    this.type = type;
  }

}


// export class FileModel extends BaseModel {
export class FileModel {
  constructor(file = {}) {
    // super()
    // this.id = utils.uuid();
    // this.Interface = FileInterface;
    // if (TypeValidator(fileModel, this.Interface)) {}
    Object.entries(file).forEach(([k, v], i) => {
      const isDate = ['dateCreated', 'dateModified', 'dateAccessed', 'changeTime'].includes(k)
      this[k] = (isDate ? new Date(Date.parse(v)) : v)
    })
  };

  create() {}
  open(viewing, playing, editing, printing) {}
  rename() {}
  copy() {}
  move() {}
  // delete() {}
  modify(attributes, properties, permissions) {}
  get filePath() { return `${this.FolderPath}${ this.Name}` };
}
