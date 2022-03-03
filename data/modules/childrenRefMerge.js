const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

export const childrenRefMerge = (ref) => ({ ...ref, childrenRefs: [...ref.childrenRefs.folders, ...ref.childrenRefs.files] })
