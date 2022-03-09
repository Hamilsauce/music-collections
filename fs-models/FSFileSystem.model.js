const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, throttleTime, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { FSNodeMap, FSNamedMap, FSFolderModel, FSFileModel } from './index.js';
import store from '/db/store.db.js'

const { date, array, utils, text } = ham;


export class FSFileSystemModel {
  constructor(store) {
    this.store = store;
    const rootId = this.store.findFolder(_ => _.isRoot).id
    console.warn('rootId', rootId)
    this.request$ = new BehaviorSubject([rootId])
      .pipe()

    this.connection$ = this.store.connect(this.request$);

    this.response$ = this.connection$.pipe(
      distinctUntilChanged((prev, curr) => {
        console.log(' prev[prev.length - 1] === curr[curr.length - 1]',  prev[prev.length - 1] === curr[curr.length - 1])
        return prev[prev.length - 1] === curr[curr.length - 1]
      }),
      map(resp => {
        return resp.map((item, i) => {
          if (item.isRoot) {
            this._rootFolder = new FSFolderModel(item) //this.store.findFolder(f => f.isRoot))
            return this._rootFolder
          } else {
            return item.nodeType === 'folder' ?
              new FSFolderModel(item) :
              new FSFileModel(item)
          }
        });
      }),
      tap((items) => {
        items[items.length - 1].loadChildren()
      }),
      tap(respArray => this.currentFolderPath = respArray),
    ) //.subscribe();
  }

  init() {
    // Original load of root
    // Create and render root (collapsed)
    // Then load and create children folder models
    // Create and stotr child elements
  }

  has(name) { return this.currentFolder.has(name) }

  remove(name) { return this.currentFolder.remove(name) }

  insert(node) { return this.currentFolder.insert(node) }

  get(name) { return this.currentFolder.get(name) }

  createFile(name, options = {}) {
    const model = {
      name: this.currentFolder.has(name) ? `${name} (${this.content.reduce((count, curr)=>curr.name===name? ++count : count),1})` : name,
      nodeType: 'file',
      id: options.id || 'fi' + utils.uuid(),
      ...options
    }

    const file = new FSFileModel(model)
    this.currentFolder.insert(file);
    return file
  }

  createFolder(name, options = {}) {
    const model = {
      name: this.currentFolder.has(name) ? `${name} (${this.content.reduce((count, curr)=> curr.name===name ? count++ : count), 1})` : name,
      nodeType: 'folder',
      id: 'fo' + utils.uuid(),
      id: options.id || 'fi' + utils.uuid(),
      ...options,
      childrenRefs: { folders: [], files: [] }
    }

    const folder = new FSFolderModel(model)
    this.currentFolder.insert(folder);
    return folder
  }

  goBack() {
    if (this._currentFolder === this.root) return;
    const newPath = this._currentFolderPath.slice(0, this._currentFolderPath.length - 1)
    this.currentFolderPath = newPath;
  }

  openFolder(path) {
    if (!path) return;
    const dir = this.gotoFolderFromPath(path);
  if (!dir ||dir.isRoot) return;
    const pathArray = [dir];
    console.log('path,pathArray', path, pathArray)
    let parent = dir.parent ? dir.parent : undefined;

    while (parent) {
      pathArray.unshift(parent)
      parent = parent.parent;
    }

    if (dir && dir instanceof FSFolderModel) {
      this.currentFolderPath = pathArray;
    }

    return this.currentFolder;
  }

  gotoFolderFromPath(path) {
    if (path.match(/^(root\/?|\/)$/g)) { return this.root; }
    if (path.match(/^\.\/?$/g)) { return this.currentFolder; }

    let dir = path.match(/^(root\/?|\/)/g) ? this.root : this.currentFolder;
    const paths = path.replace(/^(root\/|\.\/|\/)/g, '').split('/');

    while (paths.length) {
      dir = dir.get(paths.shift());
      if (!dir || !(dir instanceof FSFolderModel)) { return null }
    }

    if (paths.length === 0) { return dir; }

    return null;
  }

  printCurrentFolder() {
    console.log(
      `\n${this.currentFolderPath.join('/')}:` +
      (this.currentFolder.content.map(item =>
        `\n[${item.nodeType}] -> ${item.name}`).join('') || '[empty]')
    );
  }

  get rootFolder() { return this._rootFolder }
  get currentFolder() {
    // return this._currentFolderPath[this._currentFolderPath.length - 1]
    return this._currentFolder
  }

  get currentFolderPath() { return this._currentFolderPath.map(_ => _.name) }
  set currentFolderPath(val) {
    console.log('set currentFolderPath', val)
    this._currentFolderPath = val
    this._currentFolder = this._currentFolderPath[this._currentFolderPath.length - 1]
    console.log('this._currentFolderPath', this._currentFolderPath)
    this.request$.next(this._currentFolderPath.map(_ => _.id))

  }
  get content() { return this.currentFolder.content }

  get root() { return this.rootFolder; }

  get name() { return 'root' } //this.rootFolder.name; }

  get parent() { return null }
}

// NON-FOLDER FILESYSTEM
// class FSFileSystemModel extends Tree {
//   constructor(store) {
//     super(store.findFolder(f => f.isRoot))

//     this.store = store;
//     this._rootFolder = this.rootNode
//     this._currentFolder = this.rootNode
//     this._currentFolderPath = [this._currentFolder] // STACK (Last in, first out)


//     console.log('this.rootFolder', this.rootFolder)
//     this.procFile = this.store.findFile(f => f.name.includes('procession'))

//     console.log('this.procFile', this.procFile)
//   }

//   openFolder(path = '') {}

//   get rootFolder() { return this._rootFolder }
//   get currentFolder() { return this._currentFolder }
// }

// export default new FSFileSystemModel(await store)
