// Menu items. Names and descriptions come from locales/<lang>.json under
// items.<id>.name / items.<id>.description. Put photos in images/menu/.
const MENU_ITEMS = [
  { id: "item1", image: "images/menu/item1.jpg" },
  { id: "item2", image: "images/menu/item2.jpg" },
  { id: "item3", image: "images/menu/item3.jpg" },
  { id: "item4", image: "images/menu/item4.jpg" },
  { id: "item5", image: "images/menu/item5.jpg" },
  { id: "item6", image: "images/menu/item6.jpg" },
  { id: "item7", image: "images/menu/item7.jpg" },
  { id: "item8", image: "images/menu/item8.jpg" },
  { id: "item9", image: "images/menu/item9.jpg" },
];

const PLACEHOLDER_IMAGE = "favicon/icon-192.png";

const grid = document.getElementById("menu-grid");
const dialog = document.getElementById("item-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogName = document.getElementById("dialog-name");
const dialogDescription = document.getElementById("dialog-description");

// Shows the placeholder cone if the photo is missing.
function setImage(img, src) {
  const frame = img.parentElement;
  frame.classList.remove("is-placeholder");
  img.onerror = () => {
    img.onerror = null;
    img.src = PLACEHOLDER_IMAGE;
    frame.classList.add("is-placeholder");
  };
  img.src = src;
}

for (const item of MENU_ITEMS) {
  const li = document.createElement("li");
  li.innerHTML = `
    <button type="button" class="card" data-id="${item.id}" aria-haspopup="dialog">
      <span class="card-image"><img alt="" loading="lazy" decoding="async" data-i18n-attr="alt:items.${item.id}.name"></span>
      <span class="card-name" data-i18n="items.${item.id}.name"></span>
    </button>`;
  setImage(li.querySelector("img"), item.image);
  grid.append(li);
}

function openItem(item) {
  setImage(dialogImage, item.image);
  dialogImage.dataset.i18nAttr = `alt:items.${item.id}.name`;
  dialogName.dataset.i18n = `items.${item.id}.name`;
  dialogDescription.dataset.i18n = `items.${item.id}.description`;
  i18n.apply(dialog);
  dialog.showModal();
  // lets the phone's Back button close the card instead of leaving the page
  history.pushState({ modal: true }, "");
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  openItem(MENU_ITEMS.find((item) => item.id === card.dataset.id));
});

dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());

// clicking the dimmed backdrop (outside the card) closes it
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

dialog.addEventListener("close", () => {
  if (history.state && history.state.modal) history.back();
});

window.addEventListener("popstate", () => {
  if (dialog.open) dialog.close();
});
