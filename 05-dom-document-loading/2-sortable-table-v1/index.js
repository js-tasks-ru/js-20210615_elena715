export default class SortableTable {
  element;
  subElements;

  constructor(headerConfig = [], data = []) {
    this.headers = headerConfig;
    this.data = data;
    this.render();
  }

  get template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.headerTemplate}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getBodyTemplate(this.data)}
          </div>
        </div>
      </div>
  `;
  }

  get headerTemplate() {
    return this.headers.reduce((template, { id, title, sortable }) => (
      template = `${template}
          <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order>
          <span>${title}</span>
        </div>
      `
    ), '');
  }

  getBodyTemplate(data) {
    return data.reduce((template, item) => (
      template = `${template}
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getRowTemplate(item)}
        </a>`
    ), '');
  }

  getRowTemplate(item) {
    const cells = this.headers.map(({ id, template }) => {
      return {
        id,
        template
      };
    });

    return cells.map(({ id, template }) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  render() {
    const divElement = document.createElement("div");
    divElement.innerHTML = this.template;

    this.element = divElement.firstElementChild;
    this.subElements = this.getSubElements(divElement);
  }

  sort(field, direction) {
    const sortedData = this.sortData(field, direction);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = direction;

    this.subElements.body.innerHTML = this.getBodyTemplate(sortedData);
  }

  sortData(field, direction) {
    const type = (this.headers.find(item => item.id === field) || {}).sortType;
    const orderDict = {
      asc: 1,
      desc: -1,
    };
    const options = { sensitivity: 'case', caseFirst: 'upper' };

    const sortedData = [...this.data].sort((a, b) => {
      switch (type) {
        case 'string':
          return a[field].localeCompare(b[field], ['ru', 'en'], options) * orderDict[direction];
        case 'number':
          return (a[field] - b[field]) * orderDict[direction];
        default:
          return (a[field] - b[field]) * orderDict[direction];
      }
    });
    return sortedData;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();

    this.element = null;
    this.subElements = {};
  }
}

