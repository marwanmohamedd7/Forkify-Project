import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) return this._handleNextBtn(curPage);

    // Last curPage
    if (curPage === numPages && numPages > 1)
      return this._handlePrevBtn(curPage);

    // Other Page
    if (curPage < numPages) {
      return [this._handleNextBtn(curPage), this._handlePrevBtn(curPage)].join(
        ''
      );
    }

    // Page 1,and there are No other pages
    return ``;
  }
  _handleNextBtn(page) {
    return `
        <button data-goto = "${
          page + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
  _handlePrevBtn(page) {
    return `
    <button data-goto = "${page - 1}" class="btn--inline pagination__btn--prev">
      <span>Page ${page - 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
    </button>
`;
  }
}

export default new PaginationView();
