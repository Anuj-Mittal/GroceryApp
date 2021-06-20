const elForm = document.getElementById("form"); // Form Element
const elList = document.getElementById("list"); // List of items, each item is a HTMLDivElement element
const elInputItemName = document.getElementById("input-item-name");
const elInputQuantity = document.getElementById("input-quantity");
const elInputButton = document.getElementById("input-button");
const elEmptyListTitle = document.getElementById("empty-list-title");

elForm.setAttribute("data-form-state", "add"); // Default form is in 'add item' state

/**
 * This function takes itemName and quantity as input and returns
 * an div element corresponding to this item which should be added to DOM.
 * Each list item (HTMLDivElement) contains 4 elements :
 * item name (HTMLSpanElement), quantity (HTMLSpanElement),
 * edit button (HTMLButtonElement) and delete button (HTMLButtonElement).
 * @param {String} itemName
 * @param {String} quantity
 * @returns {<HTMLDivElement> Object}
 */

const createLi = (itemName, quantity) => {
  const elLi = document.createElement("div");
  // Each item is assigned unique id
  elLi.setAttribute("id", Math.random());
  elLi.classList.add("list-item");
  // Storing itemName and quantity as attributes on the list item HTMLDivElement.
  elLi.setAttribute("data-name", itemName);
  elLi.setAttribute("data-quantity", quantity);

  // Span element to display item name
  const elItemName = document.createElement("span");
  elItemName.innerText = itemName;
  elItemName.classList.add("list-item-name");

  // Span element to display item quantity
  const elQuantity = document.createElement("span");
  elQuantity.innerText = quantity;
  elQuantity.classList.add("list-item-quantity");

  // Edit button
  const elEditButton = document.createElement("button");
  elEditButton.innerText = "Edit";
  elEditButton.classList.add("edit-btn");

  // Edit button event handler
  elEditButton.addEventListener("click", () => {
    elForm.setAttribute("data-form-state", "edit");
    // Sending item's id to form by setting attribtutes, so that we know which item is being edited.
    elForm.setAttribute("data-edit-id", elLi.getAttribute("id"));
    // Sending data to the form
    elInputItemName.value = elLi.getAttribute("data-name");
    elInputQuantity.value = elLi.getAttribute("data-quantity");
    elInputButton.innerText = "Edit Item";

    // Switching the main to title to 'Edit Grocery Item'
    document.getElementById("add-title").style.display = "none";
    document.getElementById("edit-title").style.display = "block";
  });

  // Delete Button
  const elDeleteButton = document.createElement("button");
  elDeleteButton.innerText = "Delete";
  elDeleteButton.classList.add("del-btn");
  elDeleteButton.addEventListener("click", () => {
    if (
      elForm.getAttribute("data-form-state") === "edit" &&
      elForm.getAttribute("data-edit-id") === elLi.getAttribute("id")
    ) {
      // If user tries to delete the time which is currently being edited.
      elList.removeChild(elLi);
      // Remove item and reset form back to add state.
      resetForm();
    } else {
      elList.removeChild(elLi);
    }
    // Check if list is empty, update dialogue
    setEmptyListTitle();
    // Delete element and update local storage
    updateLocalStorage();
  });

  elLi.append(elItemName, elQuantity, elEditButton, elDeleteButton);
  return elLi;
};

/**
 * This function takes list from the localStorage and adds items to the DOM by adding them to
 * the main list (elList).
 * Local storage contains, array of objects with keys 'name' and 'quantity'.
 */
const getListFromLocalStorage = () => {
  const list = JSON.parse(localStorage.getItem("list"));
  if (list) {
    list.forEach((item) => {
      const elNewItem = createLi(item.name, item.quantity);
      elList.appendChild(elNewItem);
    });
  }
};

/**
 * This function shows the 'grocery list is empty' dialogue, if required.
 */
const setEmptyListTitle = () => {
  if (elList.children.length > 0) {
    elEmptyListTitle.style.display = "none";
  } else {
    elEmptyListTitle.style.display = "block";
  }
};

// Getting data from local storage and adding to the list
getListFromLocalStorage();
// Check if list is empty, update dialogue
setEmptyListTitle();
/**
 * This function takes item name as input and checks wether
 * current item is already in the list. If the given itemName is already in the list
 * it returns that HTMLDivElement corresponding to that item.
 * Otherwise, returns null.
 * @param {String} itemName
 * @returns
 */
const getItem = (itemName) => {
  for (const item of Array.from(elList.children)) {
    if (item.getAttribute("data-name") === itemName) {
      return item;
    }
  }
};

/**
 * This function takes the item and updates its quantity by extraQuantity.
 * @param {HTMLDivElement} item
 * @param {string} extraQuantity
 */
const updateItem = (item, extraQuantity) => {
  const newQuantity =
    parseInt(item.getAttribute("data-quantity"), 10) +
    parseInt(extraQuantity, 10);
  item.setAttribute("data-quantity", newQuantity);
  item.children[1].innerText = newQuantity;
};

// Resets form back to 'add state'.
const resetForm = () => {
  elInputItemName.value = "";
  elInputQuantity.value = "";
  elInputButton.innerText = "Add Item";
  elForm.setAttribute("data-form-state", "add");
  document.getElementById("add-title").style.display = "block";
  document.getElementById("edit-title").style.display = "none";
};

// Submit event handler on the form.
elForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredName = event.target.elements[0].value.trim();
  const enteredQuantity = event.target.elements[1].value;
  if (event.target.getAttribute("data-form-state") === "add") {
    // We are currently on the 'Add Item State'.
    const item = getItem(enteredName);
    if (item) {
      updateItem(item, enteredQuantity);
    } else {
      const elNewItem = createLi(enteredName, enteredQuantity);
      elList.appendChild(elNewItem);
    }
  } else if (event.target.getAttribute("data-form-state") === "edit") {
    // We are currently on the 'Edit Item State'.
    let current;
    // Getting the item which is being edited.
    for (const item of Array.from(elList.children)) {
      if (
        item.getAttribute("id") === event.target.getAttribute("data-edit-id")
      ) {
        current = item;
        break;
      }
    }
    const item = getItem(enteredName);
    if (item && current !== item) {
      // Update the item, if already exists.
      updateItem(item, enteredQuantity);
      current.remove();
    } else {
      // Add new item in place of the current item.
      const elNewItem = createLi(enteredName, enteredQuantity);
      current.replaceWith(elNewItem);
    }
  }

  // Resetting form and title and getting back to 'Add Form State'.
  resetForm();
  // Check if list is empty, update dialogue
  setEmptyListTitle();
  // Update local storage.
  updateLocalStorage();
});
/**
 * Updates local storage by making array of objects with keys 'name' and 'quantity', of corresponding
 * list item.
 * Stores in JSON.
 */
const updateLocalStorage = () => {
  const list = [];
  for (const item of Array.from(elList.children)) {
    list.push({
      name: item.getAttribute("data-name"),
      quantity: item.getAttribute("data-quantity"),
    });
  }
  localStorage.setItem("list", JSON.stringify(list));
};
