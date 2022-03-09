const { AsyncSubject } = rxjs;
const { mergeMap } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class DataSource {
  constructor(url = '', format = 'json', keys = []) {
    this.format = ['json', 'text'].includes(format.toLowerCase()) ? format : 'json'
    this.connection = null;
    this._responseSubject$ = new AsyncSubject();
  }

  connect(url = '', format = 'json') {
    this.connection = this.request(url, format)
      .subscribe(this.responseSubject$);

    return this.responseSubject$;
  }

  request(url = '', format = 'json') {
    return fromFetch(url)
      .pipe(
        mergeMap(_ => _[format]()),
      );
  }

  disconnect() {
    this.connection.unsubscribe()
  }

  get responseSubject$() { return this._responseSubject$ };
  get request$() { return this._request$ };
}