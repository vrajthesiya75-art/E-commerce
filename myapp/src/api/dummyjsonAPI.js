/**
 * DummyJSON API – all resources from https://dummyjson.com
 * Docs: https://dummyjson.com/docs
 */

const BASE = "https://dummyjson.com";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function queryString(params) {
  const sp = new URLSearchParams(params).toString();
  return sp ? `?${sp}` : "";
}

// —— Auth ——
export async function loginUser(username, password, expiresInMins = 60) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, expiresInMins }),
  });
  return res.json();
}

export async function getAuthUser() {
  const res = await fetch(`${BASE}/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return res.json();
}

// —— Users ——
export async function getAllUsers(params = {}) {
  const res = await fetch(`${BASE}/users${queryString(params)}`);
  return res.json();
}

export async function getSingleUser(userId) {
  const res = await fetch(`${BASE}/users/${userId}`);
  return res.json();
}

export async function searchUsers(q) {
  const res = await fetch(`${BASE}/users/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function filterUsers(key, value, params = {}) {
  const res = await fetch(`${BASE}/users/filter${queryString({ key, value, ...params })}`);
  return res.json();
}

export async function limitSkipUsers(limit = 30, skip = 0, select) {
  const params = { limit, skip };
  if (select) params.select = select;
  const res = await fetch(`${BASE}/users${queryString(params)}`);
  return res.json();
}

export async function sortUsers(sortBy, order = "asc") {
  const res = await fetch(`${BASE}/users${queryString({ sortBy, order })}`);
  return res.json();
}

export async function addUser(body) {
  const res = await fetch(`${BASE}/users/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateUser(userId, body) {
  const res = await fetch(`${BASE}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getUserCarts(userId) {
  const res = await fetch(`${BASE}/users/${userId}/carts`);
  return res.json();
}

export async function getUserPosts(userId) {
  const res = await fetch(`${BASE}/users/${userId}/posts`);
  return res.json();
}

export async function getUserTodos(userId) {
  const res = await fetch(`${BASE}/users/${userId}/todos`);
  return res.json();
}

// —— Products ——
export async function getAllProducts(params = {}) {
  const res = await fetch(`${BASE}/products${queryString(params)}`);
  return res.json();
}

export async function getSingleProduct(productId) {
  const res = await fetch(`${BASE}/products/${productId}`);
  return res.json();
}

export async function searchProducts(q) {
  const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function getProductCategories() {
  const res = await fetch(`${BASE}/products/categories`);
  return res.json();
}

export async function getProductCategoryList() {
  const res = await fetch(`${BASE}/products/category-list`);
  return res.json();
}

export async function getProductsByCategory(category) {
  const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}`);
  return res.json();
}

export async function addProduct(body) {
  const res = await fetch(`${BASE}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateProduct(productId, body) {
  const res = await fetch(`${BASE}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteProduct(productId) {
  const res = await fetch(`${BASE}/products/${productId}`, { method: "DELETE" });
  return res.json();
}

// —— Carts ——
export async function getAllCarts(params = {}) {
  const res = await fetch(`${BASE}/carts${queryString(params)}`);
  return res.json();
}

export async function getSingleCart(cartId) {
  const res = await fetch(`${BASE}/carts/${cartId}`);
  return res.json();
}

export async function getCartsByUser(userId) {
  const res = await fetch(`${BASE}/carts/user/${userId}`);
  return res.json();
}

export async function addCart(body) {
  const res = await fetch(`${BASE}/carts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateCart(cartId, body) {
  const res = await fetch(`${BASE}/carts/${cartId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteCart(cartId) {
  const res = await fetch(`${BASE}/carts/${cartId}`, { method: "DELETE" });
  return res.json();
}

// —— Posts ——
export async function getAllPosts(params = {}) {
  const res = await fetch(`${BASE}/posts${queryString(params)}`);
  return res.json();
}

export async function getSinglePost(postId) {
  const res = await fetch(`${BASE}/posts/${postId}`);
  return res.json();
}

export async function searchPosts(q) {
  const res = await fetch(`${BASE}/posts/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function getAllPostsTags() {
  const res = await fetch(`${BASE}/posts/tags`);
  return res.json();
}

export async function getPostsTagList() {
  const res = await fetch(`${BASE}/posts/tag-list`);
  return res.json();
}

export async function getPostsByTag(tag) {
  const res = await fetch(`${BASE}/posts/tag/${encodeURIComponent(tag)}`);
  return res.json();
}

export async function getPostsByUser(userId) {
  const res = await fetch(`${BASE}/posts/user/${userId}`);
  return res.json();
}

export async function addPost(body) {
  const res = await fetch(`${BASE}/posts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updatePost(postId, body) {
  const res = await fetch(`${BASE}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`${BASE}/posts/${postId}`, { method: "DELETE" });
  return res.json();
}

// —— Comments ——
export async function getAllComments(params = {}) {
  const res = await fetch(`${BASE}/comments${queryString(params)}`);
  return res.json();
}

export async function getSingleComment(commentId) {
  const res = await fetch(`${BASE}/comments/${commentId}`);
  return res.json();
}

export async function getCommentsByPost(postId) {
  const res = await fetch(`${BASE}/comments/post/${postId}`);
  return res.json();
}

// —— Quotes ——
export async function getAllQuotes(params = {}) {
  const res = await fetch(`${BASE}/quotes${queryString(params)}`);
  return res.json();
}

export async function getSingleQuote(quoteId) {
  const res = await fetch(`${BASE}/quotes/${quoteId}`);
  return res.json();
}

export async function getRandomQuote(length) {
  const url = length != null ? `${BASE}/quotes/random/${length}` : `${BASE}/quotes/random`;
  const res = await fetch(url);
  return res.json();
}

// —— Recipes ——
export async function getAllRecipes(params = {}) {
  const res = await fetch(`${BASE}/recipes${queryString(params)}`);
  return res.json();
}

export async function getSingleRecipe(recipeId) {
  const res = await fetch(`${BASE}/recipes/${recipeId}`);
  return res.json();
}

export async function searchRecipes(q) {
  const res = await fetch(`${BASE}/recipes/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function getRecipeTags() {
  const res = await fetch(`${BASE}/recipes/tags`);
  return res.json();
}

export async function getRecipesByTag(tag) {
  const res = await fetch(`${BASE}/recipes/tag/${encodeURIComponent(tag)}`);
  return res.json();
}

export async function getRecipesByMealType(mealType) {
  const res = await fetch(`${BASE}/recipes/meal-type/${encodeURIComponent(mealType)}`);
  return res.json();
}

export async function addRecipe(body) {
  const res = await fetch(`${BASE}/recipes/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateRecipe(recipeId, body) {
  const res = await fetch(`${BASE}/recipes/${recipeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteRecipe(recipeId) {
  const res = await fetch(`${BASE}/recipes/${recipeId}`, { method: "DELETE" });
  return res.json();
}

// —— Todos ——
export async function getAllTodos(params = {}) {
  const res = await fetch(`${BASE}/todos${queryString(params)}`);
  return res.json();
}

export async function getSingleTodo(todoId) {
  const res = await fetch(`${BASE}/todos/${todoId}`);
  return res.json();
}

export async function getTodosByUser(userId) {
  const res = await fetch(`${BASE}/todos/user/${userId}`);
  return res.json();
}

export async function getRandomTodo() {
  const res = await fetch(`${BASE}/todos/random`);
  return res.json();
}

export async function addTodo(body) {
  const res = await fetch(`${BASE}/todos/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function updateTodo(todoId, body) {
  const res = await fetch(`${BASE}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function deleteTodo(todoId) {
  const res = await fetch(`${BASE}/todos/${todoId}`, { method: "DELETE" });
  return res.json();
}

// —— Utility ——
export async function getIp() {
  const res = await fetch(`${BASE}/ip`);
  return res.json();
}

export async function testRoute() {
  const res = await fetch(`${BASE}/test`);
  return res.json();
}
