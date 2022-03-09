// const { iif, ReplaySubject,AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
// const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
// const { fromFetch } = rxjs.fetch;

import { CollapsibleNode } from './collapsible.js'


const app = document.querySelector('.app');
const appBody = document.querySelector('.app-body')
const containers = document.querySelectorAll('.container')

const newFolderButton = document.querySelector('#newFolderButton');
const fileSystem = document.querySelector('#file-system');
// fileSystem.innerHTML = ''
const fs = {
  self: fileSystem,
  _curr: null,
  _root: null,
  _path: [],
  set root(val) {
    if (this._root === null) {
      console.log('val', val)
      this._root = val;
      this.curr = val;
      fileSystem.appendChild(this.curr.self)
    }

  },
  get root() {
    return this._root
  },
  get curr() {
    return this._curr
  },
  set curr(val) {
    if (this.curr !== val) {
      this._curr = val;
      this.path = val ///[...this._path, val];
    }

  },

  get path() {
    return this._path
  },
  set path(val) {
    this._path = [...this.path, val];
    if (this.curr !== val) {
      this.curr = val;
      // this._root = val;
    }
  },
}


fs.self.addEventListener('node-click', e => {
  let det = e.detail
  console.log('det', det.target)
  
  if (det.state === 'active') {
    fs.path = [...fs.path, det.targ]//.pop();
    fs.curr = det.target;
  }else {
    fs.path.pop();
    fs.curr = fs.path[fs.path.length -1]
    
    
  }
});




newFolderButton.addEventListener('click', e => {
  if (!fs.root) {
    fs.root = new CollapsibleNode({
      name: 'root',
      id: 1,
      nodeType: 'folde yhhr',
      isRoot: true,
    }, null)

  } else {
    // const n = new CollapsibleNode({
    fs.curr.createNode({
      name: 'poopplt',
      id: 3,
      nodeType: 'folder666',
      isRoot: false,
    }, fs.curr)
    .createNode({
      name: 'pooppltygetgut',
      id: 89,
      nodeType: 'folder666',
      isRoot: false,
    }, fs.curr)
    .createNode({
      name: 'pooppltygetgut',
      id: 4,
      nodeType: 'folder666',
      isRoot: false,
    }, fs.curr)

  }
  console.log({ fs });
});
