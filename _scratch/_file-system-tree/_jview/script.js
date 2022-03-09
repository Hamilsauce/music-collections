import jview from './jview.js'

const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

const MUSIC_URL = '../data/_sources/MUSIC_FOLDERS.json'
// const MUSIC_URL = '../data/_sources/MUSIC_FOLDERS.json'
const PROC_URL = './procession.json'

const createConnection = (url) => {
  return fromFetch(url)
    .pipe(
      mergeMap(res => res.json()),
      mergeMap(({ files }) => from(files)),
      tap((data) => {
        const tree = jview.create(data);
        jview.render(tree, document.querySelector('.root'));
        jview.expand(tree);
      }),
    )
}
// const MUSIC_URL = './MUSIC_686.json'
// fetch(MUSIC_URL)
fetch(PROC_URL)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const tree = jview.create(data);
    jview.render(tree, document.querySelector('.root'));
    jview.expand(tree);
  })
  .catch((err) => {
    console.log(err);
  })