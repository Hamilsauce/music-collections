const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

import fileSource from '/db/files.source.js';
// import fileBatch from '/db/files.batch.js';
import folderSource from '/db/folders.source.js';
import { FSNodeMap, FSNamedMap } from '/fs-models/index.js';
// import { batchToFirestore } from '/db/firestore-batch.js';
import db from '/firebase.js'

// const fileVals = Object.values(fileBatch.entries)
// const b2f = batchToFirestore('files',fileVals)



class Collection extends FSNamedMap {
  constructor({ name, entries }) {
    entries = Array.isArray(entries) ? entries : Object.entries(entries);
    super({ entries, name })

    // this._index = [...this.keys];
  }

  indexOf(key) {
    return this._index.indexOf(key)
  }

  find(comparerFn) {
    let file = null;
    for (const value of super.values()) {
      if (comparerFn(value)) {
        file = value
        break;
      }
    }
    return file
  }
}


class Connection {
  constructor(request$, response$) {
    console.log('request$, response$', request$, response$)
    this.connection$ = new Subject()
    this.request$ = request$
    this.response$ = response$

    this.request$.pipe(mergeMap(this.response$))
      .subscribe(this.connection$)

    this.request$ //.subscribe(this.response$)
    this.response$.subscribe(this.connection$)

  }
  open() {
    return this.connection$ //.asObservable()
  }
}



class FSStore {
  constructor(...sources) {
    this._collections = new Map(sources.map(_ => [_.name, _]))
  };

  connect(request$) {
    console.log('request$', request$)
    return request$.pipe(
      map(_ => _.map(this.folder.bind(this))),
      tap(x => console.log('heard request$ in STORE RESPONSE', x)),
    )

    return new Connection(request$, this.response$)
  }

  file(id) { return this._collections.get('files').get(id) }

  folder(id) { return this._collections.get('folders').get(id) }

  collection(key) { return [...this._collections.get(key).values()] }

  deleteFile() {}

  add() {}

  findFile(comparer) {
    return this._collections.get('files').find(comparer)
  }
  findFolder(comparer) {
    return this._collections.get('folders').find(comparer)
  }

  log() {
    console.log('store collection log');
    console.log([...(this._collections.get('files')).entries()]);
    console.log([...this._collections.get('folders').entries()]);
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

// let bartok = fileSource.entries//['3d6gy8knqvv1stsyx2']
// console.log('bartok', bartok)

// const req = await fetch('/data/_homedb-local/homedb-local.json')//).json())
// const resp = (await (await fetch('/data/_homedb-local/homedb-local.json'))).json()
export default await new FSStore(await new Collection(folderSource), await new Collection(fileSource))