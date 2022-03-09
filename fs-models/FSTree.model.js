const Emitter = typeof window.Emitter === 'undefined' ?
  class Emitter {
    constructor() {
      this.events = {};
    }
    on(name, callback) {
      this.events[name] = this.events[name] || [];
      this.events[name].push(callback);
    }
    once(name, callback) {
      callback.once = true;
      this.on(name, callback);
    }
    emit(name, ...data) {
      if (this.events[name] === undefined) {
        return;
      }
      for (const c of [...this.events[name]]) {
        c(...data);
        if (c.once) {
          const index = this.events[name].indexOf(c);
          this.events[name].splice(index, 1);
        }
      }
    }
  } :
  window.Emitter;

class SimpleTree extends Emitter {
  constructor(parent, properties = {}) {
    super();
    // do not toggle with click
    parent.addEventListener('click', e => {
      // e.clientX to prevent stopping Enter key
      // e.detail to prevent dbl-click
      // e.offsetX to allow plus and minus clicking
      if (e && e.clientX && e.detail === 1 && e.offsetX >= 0) {
        return e.preventDefault();
      }
      
      const active = this.active();
      if (active && active.dataset.type === SimpleTree.FILE) {
        e.preventDefault();
        this.emit('action', active);
        if (properties['no-focus-on-action'] === true) {
          window.clearTimeout(this.id);
        }
      }
    });
    
    parent.classList.add('simple-tree');
    if (properties.dark) {
      parent.classList.add('dark');
    }
    this.parent = parent.appendChild(document.createElement('details'));
    this.parent.appendChild(document.createElement('summary'));
    this.parent.open = true;
    // use this function to alter a node before being passed to this.file or this.folder
    this.interrupt = node => node;
  }

  append(element, parent, before, callback = () => {}) {
    if (before) {
      parent.insertBefore(element, before);
    }
    else {
      parent.appendChild(element);
    }
    callback();
    return element;
  }

  file(node, parent = this.parent, before) {
    parent = parent.closest('details');
    node = this.interrupt(node);
    const a = this.append(Object.assign(document.createElement('a'), {
      textContent: node.name,
      href: '#'
    }), parent, before);
    a.dataset.type = SimpleTree.FILE;
    this.emit('created', a, node);
    return a;
  }

  folder(node, parent = this.parent, before) {
    parent = parent.closest('details');
    node = this.interrupt(node);
    const details = document.createElement('details');
    const summary = Object.assign(document.createElement('summary'), {
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

  open(details) {
    details.open = true;
  }

  hierarchy(element = this.active()) {
    if (this.parent.contains(element)) {
      const list = [];
      while (element !== this.parent) {
        if (element.dataset.type === SimpleTree.FILE) {
          list.push(element);
        }
        else if (element.dataset.type === SimpleTree.FOLDER) {
          list.push(element.querySelector('summary'));
        }
        element = element.parentElement;
      }
      return list;
    }
    else {
      return [];
    }
  }

  siblings(element = this.parent.querySelector('a, details')) {
    if (this.parent.contains(element)) {
      if (element.dataset.type === undefined) {
        element = element.parentElement;
      }
      return [...element.parentElement.children].filter(e => {
        return e.dataset.type === SimpleTree.FILE || e.dataset.type === SimpleTree.FOLDER;
      }).map(e => {
        if (e.dataset.type === SimpleTree.FILE) {
          return e;
        }
        else {
          return e.querySelector('summary');
        }
      });
    }
    else {
      return [];
    }
  }

  children(details) {
    const e = details.querySelector('a, details');
    if (e) {
      return this.siblings(e);
    }
    else {
      return [];
    }
  }
}