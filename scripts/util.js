window.appConfig = null;

export async function getConfig() {
  try {
    const response = await fetch('./config.json');
    if (!response.ok) throw new Error('Failed to load config.json');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

export async function fetchMenu(location) {
  try {
    const response = await fetch(location);
    if (!response.ok) throw new Error('Failed to load menu JSON file');
    return await response.json();
  } catch (error) {
    console.error('Error loading menu from:', location, error);
    return null;
  }
}

export async function getMenu() {
  try {
    return await fetchMenu(window.appConfig.menuFile);
  } catch (error) {
    const config = await getConfig();
    window.appConfig = config;
    return await fetchMenu(config.menuFile);
  }
}

export async function getLocalMenuName() {
  const id = await getRestaurantId();
  return `menu-${id}`;
}

export async function getLocalMenu() {
  const key = await getLocalMenuName();
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : { categories: {} };
}

export async function getCombinedMenu() {
  const baseMenu = await getMenu();
  const storedMenu = await getLocalMenu();

  for (const [category, dishes] of Object.entries(storedMenu.categories)) {
    if (!baseMenu.categories[category]) {
      baseMenu.categories[category] = [];
    }
    baseMenu.categories[category].push(...dishes);
  }

  return baseMenu;
}

export async function getRestaurantId() {
  if (!window.appConfig) {
    window.appConfig = await getConfig();
  }

  return window.appConfig?.name || 'default';
}


/**
 * Check if the user is logged in, if not move it to the login page, if he is, return his username
 * @returns 
 */
export async function checkUserLoggedIn() {
  const username = sessionStorage.getItem('username');
  if (!username) {
    window.location.href = '/login.html';
    return;
  }
  return username;
}