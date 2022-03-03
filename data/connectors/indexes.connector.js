const { forkJoin, combineLatest, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const SOURCE = {
  attributes: '/data/_sources/indexes/INDEX_ATTRIBUTES.json',
  folders: '/data/_sources/indexes/INDEX_FOLDERS.json',
  fileNames: '/data/_sources/indexes/INDEX_FILENAMES.json',
}

export default forkJoin({
  attributes: fromFetch(SOURCE.attributes).pipe(mergeMap(_ => _.json()), map(_=>_.files)),
  folders: fromFetch(SOURCE.folders).pipe(mergeMap(_ => _.json()), map(_=>_.directory)),
  fileNames: fromFetch(SOURCE.fileNames).pipe(mergeMap(_ => _.json()), map(_=>_.files)),
})

// export default fromFetch(SOURCE.muex)
// .pipe(
//   mergeMap(res => from(res.json())
//     .pipe(map(flattenTree))
//   ),
//   tap(x => console.log('x', x)),
//   mergeMap(nodeArray => from(nodeArray)),
// );
