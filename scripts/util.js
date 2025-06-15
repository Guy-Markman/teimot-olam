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
    if (!response.ok) throw new Error("Failed to load menu JSON file");
    return await response.json();
  } catch (error) {
    console.error("Error loading menu from:", location, error);
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


export async function getRestaurantId() {
  if (!window.appConfig) {
    window.appConfig = await getConfig();
  }

  return window.appConfig?.name || "default";
}

