import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _messageError = `No recipes found for your query! Please try again!`;
  _messageSucces = ``;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
