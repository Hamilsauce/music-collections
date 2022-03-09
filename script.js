import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import homedb from '/data/homedb.mapper.js'
// import { FileTree } from '/FileTree.js'
import { FSFileSystemModel } from '/fs-models/index.js'
import { FSFileSystemComponent } from '/components/FSFileSystem.component.js'
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

    this.fs = new FSFileSystemComponent(this.store);
    const files = this.store.collection('files')
    // console.log('fileSystem', fileSystem.currentFolder.content)
    // console.log('fileSystem',this.fs)
    // console.log('this.fs content', [...this.fs.content])
    // this.fs.createFile('_MY SWEET NEW FILE')
    // this.fs.createFolder('new folder 1')
    // this.fs.createFolder('461esyoqeygqy4puk66')
    // this.fs.openFolder('Sound and Frequency Targeting')
    // console.log('this.fs.currentFolder', this.fs.currentFolder)

    // setTimeout(() => {
    //   console.log('opening 461esyoqeygqy4puk66' );
    // this.fs.openFolder('461esyoqeygqy4puk66')
    // this.fs.printCurrentFolder()
    // }, 2500)

    // this.fs.createFolder('new folder 2')
    // this.fs.openFolder('new folder 2')
    // this.fs.printCurrentFolder()
    // this.fs.createFolder('new folder 3')
    // this.fs.openFolder('new folder 3')
    // const folder4 = this.fs.createFolder('new folder 4')
    // this.fs.openFolder('new folder 4')
    // // console.log('folder4', folder4)
    // this.fs.createFile('new File 1')
    // this.fs.createFile('new File 2')
    // this.fs.createFile('new File 3')
    // this.fs.createFile('new File 3')
    // this.fs.createFile('new File 4')
    // this.fs.createFile('new File 3')
    // this.fs.createFile('new File 4')
    // this.fs.createFile('new File 4')
    // this.fs.createFile('new File 5')

    // console.log('this.fs.goBack() 1');
    // this.fs.goBack()
    // console.log('this.fs.currentFolder', this.fs.currentFolder)
    // console.log('this.fs.goBack() 2');
    // this.fs.goBack()
    // console.log('this.fs.goBack() 3');
    // this.fs.goBack()
    // console.log('this.fs.goBack() 4');
    // this.fs.goBack()

    // this.fs.openFolder(folder4.path)
    // this.fs.goBack()

    // this.fs.printCurrentFolder();
    // console.log('this.fs.content', this.fs.content)

    // this.fileTree = new ,FileTree(fileTreeConfig, db)
    // console.log('this.fileTree', this.fileTree)
  };

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}


const app = new App(await store) //, homedb)
