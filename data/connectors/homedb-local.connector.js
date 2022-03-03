const { forkJoin, from } = rxjs;
const { mergeMap, map, tap, groupBy } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const SOURCE = {
  homeDbLocal: '/data/_homedb-local/homedb-local.json',
  fileData: '/data/_homedb-local/file-data_muex.json'
}
const homedb$ = fromFetch(SOURCE.homeDbLocal)
  .pipe(
    mergeMap(_ => _.json()),
    // map(Object.values),
    // mergeMap(_ => from(_)),

    // tap(x => console.log('homedb$', x)),

  );
// console.log('sik');

export default forkJoin({
  fileRefs$: homedb$.pipe(
    tap(x => console.log('FILEREFS$', x)),
    map(_ => new Map(Object.entries(_.fileRefs)))),
  folderRefs$: homedb$.pipe(
    tap(x => console.log('FOLDERREFS$', x)),

    map(_ => new Map(Object.entries(_.folderRefs)))),
  fileData$: fromFetch(SOURCE.fileData).pipe(
    tap(x => console.log('FOLDERREFS$', x)),
    mergeMap(_ => _.json()), map(({ fileData }) => fileData)),
})
// export default forkJoin({
//   fileRefs$: homedb$.pipe(map(_ => new Map(Object.entries(_.fileRefs)))),
//   folderRefs$: homedb$.pipe(map(_ => new Map(Object.entries(_.folderRefs)))),
//   fileData$: fromFetch(SOURCE.fileData).pipe(mergeMap(_ => _.json()), map(({fileData}) => fileData)),
// })