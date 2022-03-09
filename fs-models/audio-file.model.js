import {FileModel} from './file.model.js';

export class Type {
  constructor(name = '', ...typing) {
    this.name = name;
    this.type = typing;
  };
  static set(name, definition) {
    if (!Object.hasOwnProperty(name)) {
      this[name] = definition;
    } else {
      console.error(`Type ${name} already exists.`)
    }
  }
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

export const Types = {
  File: 'File',
  ContentType: 'audio/wav',
}

const TypeValidator = (data = {}, dataModel) => {
  const predicate = Object.entries(dataModel)
    .every(([key, { type, optional }], i) => {
      const hasProperty = data.hasOwnProperty(key)
      if (!(optional || hasProperty)) {
        console.error(`Object is missing required property ${key}.`)
        return false;
      } else if (hasProperty && (typeof data[key] !== type || !Types.hasOwnProperty(type))) {
        return false;
      } else return true;
    });
};




export class AudioFileModel extends FileModel {
  constructor(fileData){
   super(fileData);
    this.Interace = AudioFileInterface;
    if (TypeValidator(fileModel, this.Interace)) {
      Object.entries(fileModel).forEach(([k, v], i) => this[k] = v);
    }
    
    this.open = () => {}
  }

  get filePath() { return `${this.folderPath}${ this.name}` };
}

