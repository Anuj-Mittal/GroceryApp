// import "./styles.css";

const elForm = document.getElementById("form");

const elList = document.getElementById("list");

const createLi = (itemName, quantity) => {
  const elLi = document.createElement("div");
  elLi.classList.add("list-item");
  elLi.setAttribute("name", itemName);
  elLi.setAttribute("quantity", quantity);

  const elEditButton = document.createElement("button");
  elEditButton.innerText = "Edit";
  // elEditButton.addEventListener("click", () => {
  //   elForm.elements[0].value = elLi.getAttribute("name");
  //   elForm.elements[1].value = elLi.getAttribute("quantity");
  //   elForm.elements[2].innerText = "Edit Item";
  // });

  const elDeleteButton = document.createElement("button");
  elDeleteButton.innerText = "Delete";
  elDeleteButton.addEventListener("click", () => {
    elList.removeChild(elLi);
  });
  const elItemName = document.createElement("span");
  elItemName.innerText = itemName;

  const elQuantity = document.createElement("span");
  elQuantity.innerText = quantity;

  elLi.append(elItemName, elQuantity, elEditButton, elDeleteButton);

  return elLi;
};
const getItem = (itemName, quantity) => {
  for (const item of Array.from(elList.children)) {
    if (item.getAttribute("name") === itemName) {
      return item;
    }
  }
};
const updateItem = (item, extraQuantity) => {
  const newQuantity =
    parseInt(item.getAttribute("quantity")) + parseInt(extraQuantity);
  item.setAttribute("quantity", newQuantity);
  item.children[1].innerText = newQuantity;
};
elForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const enteredName = event.target.elements[0].value.trim();
    const enteredQuantity = parseInt(event.target.elements[1].value);
    const item = getItem(enteredName, enteredQuantity);
    if (item) {
      updateItem(item, enteredQuantity);
    } else {
      const elNewItem = createLi(enteredName, enteredQuantity);
      elList.appendChild(elNewItem);
    }

    event.target.elements[0].value = "";
    event.target.elements[1].value = "";

    event.target.elements[2].innerText = "Add Item";
  },
  false
);
