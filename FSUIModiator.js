export class FSDOMMutator {
  constructor(hostElement, options) {
    // super(hostElement, options);
    /* multiple clicks outside of elements */
   this.hostElement = hostElement;
  
    this.hostElement.addEventListener('click', e => {
      if (e.detail > 1) {
        const active = this.active();

        if (active && active !== e.target) {
          if (e.target.tagName === 'A' || e.target.tagName === 'SUMMARY') {
            return this.select(e.target, 'click');
          }
        }
        if (active) { this.focus(active); }
      }
    });

    window.addEventListener('focus', () => {
      const active = this.active();
      if (active) { this.focus(active); }
    });

    hostElement.addEventListener('focusin', e => {
      const active = this.active();
      if (active !== e.target) {
        this.select(e.target, 'focus');
      }
    });

    this.on('created', (element, node) => {
      if (node.selected) { this.select(element); }
    });

    hostElement.classList.add('select-tree');
    // navigate
    if (options.navigate) {
      this.hostElement.addEventListener('keydown', e => {
        const { code } = e;
        if (code === 'ArrowUp' || code === 'ArrowDown') {
          this.navigate(code === 'ArrowUp' ? 'backward' : 'forward');
          e.preventDefault();
        }
      });
    }
  }

  
  file(node, parent = this.hostElement, before) {
    parent = parent.closest('details');
    node = this.interrupt(node);

    const a = this.append(
      Object.assign(
        document.createElement('a'), {
          textContent: node.name,
          href: '#'
        }),
      parent,
      before
    );

    a.dataset.type = SimpleTree.FILE;

    this.emit('created', a, node);
    return a;
  }

  folder(node, parent = this.hostElement, before) {
    parent = parent.closest('details');
    node = this.interrupt(node);

    const details = document.createElement('details');

    const summary = Object.assign(
      document.createElement('summary'), {
        textContent: node.name
      });

    details.appendChild(summary);

    this.append(details, parent, before, () => {
      details.open = node.open;
      details.dataset.type = SimpleTree.FOLDER;
    });

    this.emit('created', summary, node);
    return summary;
  }

  open(node) { node.open = true; }

  siblings(element = this.hostElement.querySelector('a, details')) {
    if (this.hostElement.contains(element)) {
      if (element.dataset.type === undefined) {
        element = element.parentElement;
      }
      return [...element.parentElement.children]
        .filter(e => {
          return e.dataset.type === SimpleTree.FILE || e.dataset.type === SimpleTree.FOLDER;
        })
        .map(e => {
          if (e.dataset.type === SimpleTree.FILE) {
            return e;
          }
          else { return e.querySelector('summary'); }
        });
    } else { return []; }
  }

  children(details) {
    const e = details.querySelector('a, details');
    if (e) { return this.siblings(e); }
    else { return [] }
  }

  folder(...args) {
    const summary = super.folder(...args);
    const details = summary.closest('details');

    details.addEventListener('toggle', e => {
      this.emit(details.dataset.loaded === 'false' && details.open ? 'fetch' : 'open', summary);
    });

    summary.resolve = () => {
      details.dataset.loaded = true;
      this.emit('open', summary);
    };

    return summary;
  }

  unloadFolder(summary) {
    const details = summary.closest('details');
    details.open = false;
    const focused = this.active();

    if (focused && this.hostElement.contains(focused)) {
      this.select(details);
    }

    [...details.children].slice(1)
      .forEach(e => e.remove());

    details.dataset.loaded = false;
  }

  active() {
    return this.hostElement.querySelector('.selected');
  }

  focus(target) {
    window.clearTimeout(this.id);
    this.id = window.setTimeout(() => document.hasFocus() && target.focus(), 100);
  }

  select(target) {
    const summary = target.querySelector('summary');

    if (summary) { target = summary; }

    [...this.hostElement.querySelectorAll('.selected')]
    .forEach(e => e.classList.remove('selected'));

    target.classList.add('selected');

    this.focus(target);
    this.emit('select', target);
  }
}
