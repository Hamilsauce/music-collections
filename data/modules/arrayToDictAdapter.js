const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export default (fileData$, idField = 'id') => fileData$
  .pipe(
    filter(collection => collection.key === 'fileData'),
    filter(({ key, data }) => Array.isArray(data)),
    map(({ key, data }) => ({
      key,
      data: data.reduce((dict, entry, i) => ({
        ...dict,
          [entry.id]: entry
      }))
    })),
    tap(x => console.log('DATASORCE', x)),
  )