import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import homedb from '/data/homedb.mapper.js'
// import { FileTree } from '/FileTree.js'
// import { FSFileSystemModel } from '/fs-models/index.js'
// import { FSFileSystemComponent } from '/components/FSFileSystem.component.js'
import store from '/db/store.db.js';
// import homeDbForkJoin$ from '/data/connectors/homedb-local.connector.js'
const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
const { download, date, array, utils, text } = ham


const appEl = document.querySelector('#app');
const appBody = document.querySelector('#appBody')
const jsonOut = document.querySelector('#json-out')
const fileViewTree = document.querySelector('#fileView_tree')
const containers = document.querySelectorAll('.container')
const selectors = [
  ['#app'],
  ['#appHeader'],
  ['#appHeader-title'],
  ['#appBody'],
  ['.fileView'],
  ['.fileView-top'],
  ['#fileView-tree'],
  ['.treeNode'],
  ['#folder-node-template'],
  ['#fs-node-template'],
  ['.svg-container'],
  ['.svg-content-responsive']
]

class ExpandingList extends HTMLUListElement {
  constructor(name) {
    super();
    this.name = name
  }
  myKids() {
    // console.log('ExpandingList', 
    return this.children
  }
}

const myDiv = Object.assign(
  document.createElement('script'),
  document.createElement('script'),
);

const fileTreeConfig = {
  selector: 'file-tree',
  parentElement: document.querySelector('#file-tree-container')
}
// c/onsole.log('store', store)

const soundTargetFolder = {
  '461esyoqeygqy4puk66': {
    childrenRefs: {
      files: ['c7gkf49sknyojyq1ucp', 'k0qg2y09q1qpyk7sok9', 'kygypkpy5slqq1iqec9']
    },
    id: '461esyoqeygqy4puk66',
    name: 'Sound and Frequency Targeting',
    nodeType: 'Folder',
    parentId: '8y17ynkbytusbghytq',
    size: 3
  }
}

export class App {
  constructor(store) { //, db) {
    this.store = store;

    // this.fs = new FSFileSystemComponent(this.store);
    const files = this.store.collection('files')
    // console.log('fileSystem', fileSystem.currentFolder.content)

    // this.fileTree = new ,FileTree(fileTreeConfig, db)
    // console.log('this.fileTree', this.fileTree)
  };

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}


const app = new App(await store) //, homedb)
