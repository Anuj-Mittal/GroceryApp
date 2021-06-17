// import "./styles.css";
const elForm = document.getElementById("form");
elForm.setAttribute("data-form-state", "add"); // Deafult form is in add state

const elList = document.getElementById("list");

const createLi = (itemName, quantity) => {
  const elLi = document.createElement("div");
  elLi.setAttribute("id", Math.random());
  elLi.classList.add("list-item");
  elLi.setAttribute("data-name", itemName);
  elLi.setAttribute("data-quantity", quantity);

  const elItemName = document.createElement("span");
  elItemName.innerText = itemName;
  elItemName.classList.add("list-item-name");

  const elQuantity = document.createElement("span");
  elQuantity.innerText = quantity;
  elQuantity.classList.add("list-item-quantity");

  // Edit button
  const elEditButton = document.createElement("button");
  elEditButton.innerText = "Edit";
  elEditButton.classList.add("edit-btn");

  elEditButton.addEventListener("click", () => {
    elForm.setAttribute("data-form-state", "edit");
    elForm.setAttribute("data-edit-id", elLi.getAttribute("id"));
    elForm.elements[0].value = elLi.getAttribute("data-name");
    elForm.elements[1].value = elLi.getAttribute("data-quantity");
    elForm.elements[2].innerText = "Edit Item";
    document.getElementById("add-title").style.display = "none";
    document.getElementById("edit-title").style.display = "block";
  });

  // Delete Button
  const elDeleteButton = document.createElement("button");
  elDeleteButton.innerText = "Delete";
  elDeleteButton.classList.add("del-btn");
  elDeleteButton.addEventListener("click", () => {
    elList.removeChild(elLi);
    updateLocalStorage();
  });

  elLi.append(elItemName, elQuantity, elEditButton, elDeleteButton);

  return elLi;
};

const getListFromLocalStorage = () => {
  const list = JSON.parse(localStorage.getItem("list"));
  if (list) {
    list.forEach((item) => {
      const elNewItem = createLi(item.name, item.quantity);
      elList.appendChild(elNewItem);
    });
  }
};

getListFromLocalStorage();

const getItem = (itemName) => {
  for (const item of Array.from(elList.children)) {
    if (item.getAttribute("data-name") === itemName) {
      return item;
    }
  }
};
const updateItem = (item, extraQuantity) => {
  const newQuantity =
    parseInt(item.getAttribute("data-quantity")) + parseInt(extraQuantity);
  item.setAttribute("data-quantity", newQuantity);
  item.children[1].innerText = newQuantity;
};
elForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredName = event.target.elements[0].value.trim();
  const enteredQuantity = parseInt(event.target.elements[1].value);
  if (event.target.getAttribute("data-form-state") === "add") {
    const item = getItem(enteredName);
    if (item) {
      updateItem(item, enteredQuantity);
    } else {
      const elNewItem = createLi(enteredName, enteredQuantity);
      elList.appendChild(elNewItem);
    }
  } else if (event.target.getAttribute("data-form-state") === "edit") {
    let current;
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
      updateItem(item, enteredQuantity);
      current.remove();
    } else {
      const elNewItem = createLi(enteredName, enteredQuantity);
      current.replaceWith(elNewItem);
    }
  }
  event.target.elements[0].value = "";
  event.target.elements[1].value = "";
  event.target.elements[2].innerText = "Add Item";
  elForm.setAttribute("data-form-state", "add");
  document.getElementById("add-title").style.display = "block";
  document.getElementById("edit-title").style.display = "none";
  updateLocalStorage();
});

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
