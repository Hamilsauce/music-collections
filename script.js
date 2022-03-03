import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import homedb from '/data/homedb.mapper.js'
import homeDbForkJoin$ from '/data/connectors/homedb-local.connector.js'
// import MyClass  from '/exportTest.js'
const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, toArray, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;
const {
  download,
  date,
  array,
  utils,
  text
} = ham

const app = document.querySelector('#app');
const appBody = document.querySelector('#appBody')
const fileViewTree = document.querySelector('#fileView_tree')
const containers = document.querySelectorAll('.container')
const selectors = [
'#app',
'#appHeader',
'#appHeader_title',
'#appBody',
'.fileView',
'.fileView_top',
'#fileView_tree',
'.treeNode',
'#folder-node-template',
'#fs-node-template',
'.svg-container',
'.svg-content-responsive',
]


// console.log('MyClass', MyClass)
// const myClass = MyClass('poop')
// console.log('myClass', myClass)

const connectionGb$ = homedb.collectionSubject$.pipe(
  // tap(x => console.warn('homeDbGroupBy$', x)),
) //.subscribe()
// const folderRefs$ = connectionGb$
  // .pipe(
  //   filter(_ => _.key === 'folderRefs'),
  //   tap(x => console.warn('folderRefs$', x)),
  // ).subscribe()



const folderTree$ = homedb.folderTree$
.pipe(
  tap(x => console.warn('folderTree$', x)),
  // map(x => x['8y17ynkbytusbghytq']),
  // map(root => {
  //   delete root.childrenRefs
  //   return root
  // }),
  map(x => JSON.stringify(x,null, 2)),
  tap(x => fileViewTree.innerHTML = x),
  // tap(() => homedb.download$(homedb.folderTree$,'homeDbFileTree.json')),
)
. subscribe()
homedb.download$(homedb.folderTree$,'homeDbFileTree.json').subscribe()
// const connectionFj = homeDbForkJoin$.pipe(
//     // toArray(),
//     tap(x => console.log('forkJoin', x)),
//   )
// .subscribe()
