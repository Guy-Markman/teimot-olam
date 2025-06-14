import { getConfig, getMenu } from "./util.js";

window.appConfig = null;

async function loadCategoryBoxes(dishes, container) {
    const template = document.getElementById("dish-template");
    Object.values(dishes).forEach((dish) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector("h3").textContent = dish.name;
        clone.querySelector(".dishDescription").textContent = dish.description;
        clone.querySelector(".dishPrice").textContent = dish.price;

        const img = clone.querySelector(".dishImage");
        img.src = dish.image;
        img.alt = dish.name;

        clone.querySelector(".addButton").onclick = function () {
            addItem(dish.name, dish.price);
        };

        container.append(clone);
        return null;
    });
}

function loadCategoryLines(items, container) {
    const template = document.getElementById("menu-line-template");
    items.forEach((dish) => {
        const clone = template.content.cloneNode(true);

        clone.querySelector("h3").textContent = dish.name;
        clone.querySelector(".dishDescription").textContent = dish.description;
        clone.querySelector(".price").textContent = dish.price;

        const img = clone.querySelector(".dishImage");
        img.src = dish.image;
        img.alt = dish.name;

        container.append(clone);
    });
}

async function load() {
    const config = await getConfig();
    window.appConfig = config;
    const menu = await getMenu(config.menuFile);
    const main = document.getElementsByTagName("main")[0];

    Object.entries(menu.categories).forEach(([category, items]) => {
        const catElement = document.createElement("section");
        main.append(catElement);

        catElement.classList.add("category");
        const title = document.createElement("h2");
        catElement.append(title);
        title.textContent = category;
        title.classList.add("titleBox", "titleBoxBakery");

        const dishList = document.createElement("div");
        catElement.append(dishList);
        dishList.classList.add("dishList");

        loadCategoryBoxes(items, dishList);
    });
}

async function init() {
    await load();
    const id = getRestaurantId();
    loadCart(id);
}

init();