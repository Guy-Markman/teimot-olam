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

export async function getMenu(location) {
  try {
    const response = await fetch(location);
    if (!response.ok) throw new Error('Failed to load menu json file');
  } catch (error) {
    console.error('Error loading menu: ', error);
    return null;
  }
  return fetch(location)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load menu json file');
      return response.json();
    })
    .catch((error) => {
      console.error('Error loading menu: ', error);
    });
}
