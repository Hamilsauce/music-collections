import { FileModel } from '/models/file.model.js'
import { FSFolder } from '/components/FSFolder.component.js'
import { FSFile } from '/components/FSFile.component.js'
import homeDb$ from '/data/homedb.mapper.js';


const { concat, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { concatMap, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


// export const treeBuilder = ({ fileRefs$, folderRefs$, fileData$ }) => {
export const treeBuilder$ = (homeDb$) => {
  return homeDb$.pipe(
      map(collection => {
        // const root = 
        console.log('collection', collection)
        // return fileRefs$.pipe()
        return collection
      })
    )
    .subscribe()



  // concat(fileRefs$, folderRefs$, fileData$)
  // .pipe(
  //   tap(x => console.log('TREEBUILDER', x)),
  // )
  // .subscribe()
};



export const treeBuilder = (store) => {
  const treeListEl = document.querySelector('#treeView--list');
  const rootRef = store.reference('folder', store.collection('rootId'))
  const folderRefs = store.collection('folder')
  const fileRefs = store.collection('file')

  treeListEl.innerHTML = ''
  const root = new FSFolder(rootRef, store)
  treeListEl.appendChild(root.node)
 }





  // return homeDb$.pipe(
  //     map(collection => {
  //       // const root = 
  //       console.log('collection', collection)
  //       // return fileRefs$.pipe }
  //       return collection
  //     })
  //   )
    // .subscribe()



  // concat(fileRefs$, folderRefs$, fileData$)
  // .pipe(
  //   tap(x => console.log('TREEBUILDER', x)),
  // )
  // .subscribe()
// };
