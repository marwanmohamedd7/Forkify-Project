import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  update(recipe) {
    // if (!recipe || (Array.isArray(recipe) && recipe.length === 0))
    //   return this.renderErrorMessage();
    this._data = recipe;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this._parentEl.querySelectorAll('*'));
    // console.log(newElement);
    // console.log(curElement);
    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      // console.log(curEl,newEl.isEqualNode(curEl));

      // 1: Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('🔴',newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // 2: Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr => {
          // console.log(attr.name, attr.value);
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} recipe The data to be rendered (e.g. recipe) 
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM 
   * @returns {undefined | string} A markup is returned if render = false
   * @this {Object} View instance
   * @author Marwan Mohamed
   * @todo Finish implementation
   */
  render(recipe, render = true) {
    if (!recipe || (Array.isArray(recipe) && recipe.length === 0))
      return this.renderErrorMessage();
    this._data = recipe;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._insertMarkup(markup);
  }

  renderSpinner() {
    const markup = this._generateMarkupSpinner();
    this._clear();
    this._insertMarkup(markup);
  }

  renderErrorMessage(message = this._messageError) {
    const markup = this._generateError(message);
    this._clear();
    this._insertMarkup(markup);
  }

  renderSuccesMessage(message = this._messageSucces) {
    const markup = this._generateSuccesMessage(message);
    this._clear();
    this._insertMarkup(markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  _insertMarkup(markup) {
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _generateError(message = this._messageError) {
    return `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
        <p>${message}</p>
    </div>
    `;
  }
  _generateSuccesMessage(message = this._messageError) {
    return `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
        <p>${message}</p>
    </div>
    `;
  }

  _generateMarkupSpinner() {
    return `
    <div class="spinner">
      <svg>
      <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
  }
}
