import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { pipeline, date, array, utils, text } = ham;

const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { toArray, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, reduce, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

import { FileModel, createFile } from '../../models/file.model.js';
import { firebaseDb } from '../../firebase.js'
// import { FireBaseService } from '../../services/FireBaseService.js'
import { FireBaseService } from '/services/FireBaseService.js'

export class FolderModel {
  constructor({ uuid, name, parentId, children = [] }) {
    id: uuid,
    this.root;
    this.children = children.reduce((acc, curr, i) => ({
      [curr.id]: curr.name
    }), {});

  };
  remove() {}
  select() {}
  has() {}


  get firstChild() { return this.children };
  set firstChild(newValue) { this._firstChild = newValue };
}

export class DataService {
  constructor(url = '', config = { rootName: 'C:\\Users\\jacob\\OneDrive - Sea Hag Enterprises\\' }) {
    this.fbService = new FireBaseService(firebaseDb)
    this.url = url;
    this.config = config
    this.rootName = 'C:\\Users\\jacob\\OneDrive - Sea Hag Enterprises\\';
    this.fileSubject$ = new Subject()
    this._state = {};
    console.log('this.fbService', this.fbService);
    this.connections = new Map();
    this.createConnection(this.url, 'files')

    // this.filePaths$ = this.connect('files')
    // .pipe(
    //   // map(( files ) => [...files.children]),
    //   tap(f => console.log('FFFF',f)),//.filePath.split(this.rootName)[1]),
    //   map(( files ) => files),
    //   map(createFile),
    //   // tap(x => console.log('ATER PATH SPLIT', x)),
    //   map(f => f.filePath.split(this.rootName)[1]),
    //   toArray(),
    //   map(this.createDirectoryTree),
    //   map(dirs => {
    //     const root = {
    //       name: rootpath,
    //       count: dirs.length,
    //       children: new Map(dirs.map(dir => [dir.name, dir]))
    //     }
    //     return root
    //   }),

    //   // tap(x => console.log('END SUB', x)),
    //   tap(x => this.state = { ...this.state, ['files']: x }),
    // )
    // this.filePaths$.subscribe(this.fileSubject$)
  }

  seedFb({ folders, files } = { folders: new Map(), files: new Map() }) {
    console.log('this.fbService', this.fbService)
    this.fbService.setFiles(files)
    this.fbService.setFolders(folders)
    console.log('seedFb COMPLETE');
  }

  queryFirebase(root = null, childId = null) {
    const query$ = this.fbService.query({ root, childId });
    return query$;
  }

  connection(name) { return this.connections.get(name).source }

  createConnection(url, name = '', ) {
    console.log(name);
    return this.connections.set(
      name ? name : `connection${this.connections.size}`,
      fromFetch(url)
      .pipe(
        mergeMap(res => res.json()),
        mergeMap((response) => response[name]),
        mergeMap((response) => from(response))
      )
    )
  }

  disconnect(name) {}

  extractRoot(tree, searchName) {
    let curr = tree;
    let matched = false;

    while (!matched) {
      if (curr.name === searchName) {
        matched = true;
        return;
      } else if (true) {

      }
    }
    return curr;
  }

  connect(name) {
    if (!this.connections.has(name)) return

    this.request$ = this.connection(name)
      .pipe(
        // take(5),
        map(createFile),
        toArray(),
        map(this.createDirectoryTree),
        map(dirs => createFile({
          name: this.rootName,
          count: dirs.length,

          children: dirs
            .reduce((acc, curr) => {
              return {
                ...acc,
                [curr.name]: createFile(curr)
              }
            }, {}),
        })),
        tap(x => console.log('BEFORE CREATEFILE', x)),
        tap(_ => this.state[name] = _),
        tap(x => this.fbService.setData({})),
      );

    this.requestSubscription = this.request$.subscribe(this.fileSubject$)
    return this.fileSubject$
  }

  createDirectoryTree(files = []) {
    return files.reduce((r, p, i, arr) => {
      const names = createFile(p).filePath.split('\\');
      let lastDir = names[0]
      names.reduce((q, name) => {
        let temp = q.find(o => o.name === name);
        if (!temp) q.push(temp = createFile({
          name,
          parentName: lastDir,
          children: [],
        }));
        lastDir = name
        return temp.children
      }, r);
      // console.log('RRRR', r)

      return r
    }, [])
  }

  get state() { return this._state };
  set state(newValue) { this._state = newValue };
}



// fetchFiles(FILE_DATA_URL);


// const aggregrates$ = this.fileSubject$.pipe(
//   reduce((agg, file) => {
//     agg.set('totalCount', agg.get('totalCount') + 1);
//     agg.set('totalSize', agg.get('totalSize') + file.Size);
//     agg.set('extensions', { count: agg.get('extensions').list.length, list: [...new Set([...agg.get('extensions').list, file.Extension])] });
//     agg.set('contentTypes', { count: agg.get('contentTypes').list.length, list: [...new Set([...agg.get('contentTypes').list, file.ContentType])] });
//     agg.set('kinds', { count: agg.get('kinds').list.length, list: [...new Set([...agg.get('kinds').list, file.Kind])] });
//     agg.set('folderPaths', { count: agg.get('folderPaths').list.length, list: [...new Set([...agg.get('folderPaths').list, file.FolderPath])] });
//     return agg;
//   }, new Map([
//       ['totalCount', 0],
//       ['totalSize', 0],
//       ['extensions', { count: 0, list: [] }],
//       ['contentTypes', { count: 0, list: [] }],
//       ['kinds', { count: 0, list: [] }],
//       ['folderPaths', { count: 0, list: [] }]
//     ]))
// );

// aggregrates$
//   .pipe(
//     tap(x => console.log('AGGREGATES', [...x])),
//   ).subscribe()

// const files$ = this.fileSubject$.pipe(map(createFile));

// let rootpath = 'C:\\Users\\jacob\\OneDrive - Sea Hag Enterprises\\'
// const createDirectoryTree = (paths = []) => {
//   return paths.reduce((r, p, i, arr) => {
//     const names = p.split('\\');
//     names.reduce((q, name) => {
//       let temp = q.find(o => o.name === name);
//       if (!temp) q.push(temp = { name, children: [], });
//       return temp.children
//     }, r);
//     return r;
//   }, [])
// };

// const folderPaths$ = files$
//   .pipe(
//     map(_ => _.FolderPath.split(rootpath)[1]),
//     toArray(),
//     map(treeMaker),
//   );


// const filePaths$ = files$
//   .pipe(
//     map(f => f.filePath.split(rootpath)[1]),
//     toArray(),
//     map(createDirectoryTree),
//     map(dirs => {
//       console.log('dirs', dirs)
//       const root = {
//         name: rootpath,
//         count: dirs.length,
//         children: new Map(dirs.map(dir => [dir.name, dir]))
//       }
//       return root
//     }),
//     tap(x => console.log('END', x, [...x.children])),
//   ).subscribe()