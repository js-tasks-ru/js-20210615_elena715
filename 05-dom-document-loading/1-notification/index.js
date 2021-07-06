export default class NotificationMessage {
  static existedElement;
  element;
  timer;

  constructor(message, { duration = 0, type = "" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value: ${this.duration / 1000}s">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">success</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>
  `;
  }

  render() {
    const divElement = document.createElement("div");
    divElement.innerHTML = this.template;

    this.element = divElement.firstElementChild;
  }

  show(parent = document.body) {
    if (NotificationMessage.existedElement) {
      NotificationMessage.existedElement.remove();
    }

    parent.append(this.element);

    this.timer = setTimeout(() => {
      this.destroy();
    }, this.duration);

    NotificationMessage.existedElement = this;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  clearElementTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  destroy() {
    this.remove();
    this.clearElementTimer();

    this.element = null;
    NotificationMessage.existedElement = null;
  }
}
