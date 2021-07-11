class Tooltip {
  element;
  static tooltipInstance;
  constructor() {
    if (Tooltip.tooltipInstance) {
      return Tooltip.tooltipInstance;
    }

    Tooltip.tooltipInstance = this;
  }

  getTemplate(value) {
    return `<div class="tooltip">${value}</div>`;
  }

  render(value) {
    this.element = document.createElement("div");
    this.element.classList.add('tooltip');
    this.element.innerHTML = value;
    document.body.append(this.element);
  }

  handleHover = (event) => {
    let isTooltip = event.target.closest('[data-tooltip]');
    if (isTooltip) {
      const value = isTooltip.dataset.tooltip;
      this.render(value);
      document.addEventListener('pointermove', this.handleMoveMouse);
    }
  }

  handleMoveMouse = (event) => {
    const { clientX, clientY } = event;
    this.element.style.top = `${clientX + 20}px`;
    this.element.style.left = `${clientY + 20}px`;
  }

  handleRemove = () => {
    this.remove();
    document.removeEventListener('pointermove', this.handleRemove);
  }

  initialize() {
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('pointerover', this.handleHover);
    document.addEventListener('pointerout', this.handleRemove);
  }

  destroyEventListeners() {
    document.removeEventListener('pointerover', this.handleHover);
    document.removeEventListener('pointermove', this.handleMoveMouse);
    document.removeEventListener('pointerout', this.handleRemove);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.destroyEventListeners();
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
