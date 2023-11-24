import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { KEY, MODAL_CLOSE_SEC } from './config';
import * as model from './model';
import recipeView from '../js/view/recipeView';
import searchView from './view/searchView';
import resultsView from './view/resultsView';
import paginationView from './view/paginationView';
import bookmarksView from './view/bookmarksView';
import addRecipeView from './view/addRecipeView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // 1: Get recipe id
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0: Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1:Update bookmarks view
    bookmarksView.update(model.state.Bookmarks);

    // 2: Loading Recipe
    await model.loadRecipe(id);

    // 3: Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1: Get search query
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    // 2: Loading Search Results
    await model.loadSearchResults(query);
    // 3: Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4: Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    searchView.renderErrorMessage(err);
  }
};

const controlPagination = function (goToPage) {
  // 1: Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2: Render NEW Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Render updated servings (update the recipe view)
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // Add OR Remove bookmark
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // Update bookmark View
  recipeView.update(model.state.recipe);

  // Render bookmark
  bookmarksView.render(model.state.Bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.Bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.addRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderSuccesMessage();

    // Render bookmark view
    bookmarksView.render(model.state.Bookmarks);

    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderErrorMessage(err.message);
  }
};

const controlDeleteRecipe = async function () {
  try {
    const id = model.state.recipe.id;
    const idx = model.state.search.results.findIndex(el => el.id === id);
    const bookIdx = model.state.Bookmarks.findIndex(el => el.id === id);
    // Delete recipe
    await model.deleteRecipe(id);
    // Remove id in url
    const ref = window.location.href.slice(
      0,
      window.location.href.indexOf('#')
    );
    window.history.replaceState(null, '', `${ref}`);
    if (idx >= 0) {
      model.state.search.results.splice(idx, 1);
      model.state.Bookmarks.splice(bookIdx, 1);
      localStorage.setItem('bookmarks', JSON.stringify(model.state.Bookmarks));
      resultsView.render(model.getSearchResultsPage());
      bookmarksView.render(model.state.Bookmarks);
      recipeView.renderSuccesMessage();
    }
  } catch (err) {
    recipeView.renderErrorMessage(err);
  }
};

const init = function () {
  // Add event listeners
  bookmarksView.addHandlerRenderStoredBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerDeleteRecipe(controlDeleteRecipe);
  recipeView.addHandlerAddBookmarks(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
