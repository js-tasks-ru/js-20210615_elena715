import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

function getColumnProps(data) {
  const maxValue = Math.max(...data);
  const scale = 50 / maxValue;

  return data.map((item) => {
    return {
      percent: ((item / maxValue) * 100).toFixed(0) + "%",
      value: String(Math.floor(item * scale)),
    };
  });
}

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  element;

  constructor({
    url = '',
    range = {
      from: null,
      to: null,
    },
    label = '',
    link = '',
    value = '',
    formatHeading = data => data,
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.render();
    this.update(this.range.from, this.range.to);
  }

  async fetchData (from, to) {
    let url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('from', `${from}`);
    url.searchParams.set('to', `${to}`);
    return await fetchJson(url);
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.fetchData(from, to);

    if (data && Object.values(data).length) {
      this.subElements.header.textContent = this.getHeaderValue(data);
      this.subElements.body.innerHTML = this.getColumnBody(data);

      this.element.classList.remove('column-chart_loading');
    }
    return data;
  }

  get template() {
    return `<div class='column-chart' style="--chart-height: 50">
    <div class="column-chart__title">
      ${this.label}
      ${this.link ? `<a class="column-chart__link" href=${this.link}>View all</a>` : " <span />"}
    </div>
    <div class="column-chart__container">
      <div data-element="header" class="column-chart__header">
        ${this.value}
      </div>
      <div data-element="body" class="column-chart__chart">
      </div>
  </div>
  `;
  }

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));

    return Object.entries(data).map(([key, value]) => {
      const scale = this.chartHeight / maxValue;
      const percent = (value / maxValue * 100).toFixed(0);
      const tooltip = `<span>
        <small>${key.toLocaleString('default', {dateStyle: 'medium'})}</small>
        <br>
        <strong>${percent}%</strong>
      </span>`;

      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${tooltip}"></div>`;
    }).join('');
  }


  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));
  }

  render() {
    const divElement = document.createElement("div");

    divElement.innerHTML = this.template;

    this.element = divElement.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  setNewRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  renderColumns = (data) => {
    return data.reduce(
      (template, { percent, value }) =>
        (template = `${template}
      <div style="--value: ${value}" data-tooltip=${percent}></div>
      `),
      ""
    );
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
