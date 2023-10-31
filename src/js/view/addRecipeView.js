import icons from 'url:../../img/icons.svg';
import View from './View';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _messageSucces = 'Recipe was successfully uploaded :)';

  constructor(){
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow(){
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler){
    this._parentEl.addEventListener('submit',function(e){
        e.preventDefault();
        const dataArr = [...new FormData(this)];
        const data = Object.fromEntries(dataArr);
        handler(data);
    })
  }
}

export default new AddRecipeView();
