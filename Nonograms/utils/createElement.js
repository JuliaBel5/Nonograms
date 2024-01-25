export function createElement(tag = "div", className = "", content = "") {
  // eslint-disable-next-line no-undef
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (content) {
    element.textContent = content;
  }

  return element;
}
