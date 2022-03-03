const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { groupBy, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

import { DataSource } from '/data/modules/DataSource.js';
// import { childrenRefMerge } from '/data/modules/childrenRefMerge.js';

const dbUrl = '/data/_homedb-local/homedb-local.json';
const homeDbSource$ = new DataSource(dbUrl, 'json');

const homeDb$ = homeDbSource$.connect().pipe(
  map(Object.entries),
  switchMap(_ => from(_)
    .pipe(
    
      // map(({ key, data }) => {
      //   return key === 'folderRefs' ? {
      //     key,
      //     data: childrenRefMerge(data)
      //   } : { key, data }
      // }),
    )),
  groupBy(([k, v]) => k),
      tap(x => console.log('START OF PIPE', x)),
  mergeMap((group$) => group$
    .pipe(
      map(([key, data]) => {
        return {
          key: key,
          data: key === 'rootId' ? data : [...Object.entries(data)]
            .reduce((entries, entry, i) => {
              if (!Array.isArray(entry)) entry = [entry.id, entry]
              return entries.set(entry[0], entry[1]);
            }, new Map())
        }
      }),
      tap(x => console.log('AFTER GROUPING', x)),
    )),
  // tap(x => console.log('AFTER N OUTSIDE GROUPING', x)),
);

const homeDb_fileRefs$ = homeDb$.pipe(
  filter(_ => _.key === 'fileRefs'),
  tap(x => console.log('AFTER N OUTSIDE GROUPING', x)),
  
);

const homeDb_fileData$ = homeDb$.pipe(
  filter(_ => _.key === 'fileData'),
);

const homeDb_folderRefs$ = homeDb$.pipe(
  filter(_ => _.key === 'folderRefs'),
);

homeDb$.disconnect = () => homeDbSource$.disconnect()
export default homeDb$;
