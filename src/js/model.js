import { async } from 'regenerator-runtime';
import { API_URL, KEY, RESULTS_PER_PAGE } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
  },
  Bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.Bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        title: rec.title,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 4 / 2 = 4
  });
  state.recipe.servings = newServings;
};

const presistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.Bookmarks));
};

export const addBookmark = function (recipe) {
  // Push recipe to bookMark array
  state.Bookmarks.push(recipe);
  // Set recipe bookMark = true
  if (recipe.id === state.recipe.id) state.recipe.bookmark = true;
  presistBookmarks();
};

export const removeBookmark = function (id) {
  // Find bookMark recipe id
  const index = state.Bookmarks.findIndex(bookmark => bookmark.id === id);
  // Delete Bookmark recipe
  state.Bookmarks.splice(index, 1);
  // Set recipe bookMark = false
  if (id === state.recipe.id) state.recipe.bookmark = false;
  presistBookmarks();
};

const init = function () {
  const storedBookmarks = localStorage.getItem('bookmarks');
  if (storedBookmarks) state.Bookmarks = JSON.parse(storedBookmarks);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const addRecipe = async function (recipeData) {
  try {
    const ingredients = Object.entries(recipeData)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll.split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: recipeData.title,
      publisher: recipeData.publisher,
      source_url: recipeData.sourceUrl,
      image_url: recipeData.image,
      servings: +recipeData.servings,
      cooking_time: +recipeData.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
