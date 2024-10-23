console.log("====================================");
console.log("Connected");
console.log("====================================");

const parentEle = document.querySelector(".table-data");
const totalPriceEle = document.querySelector(".total-price");
const subtotalEle = document.querySelector(".cart-totals span");

let cartData = [];

// Fetch Cart Data from API and Store in localStorage
const fetchData = async () => {
  try {
    const res = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889",
    );
    const data = await res.json();
    cartData = data.items;
    localStorage.setItem("cartData", JSON.stringify(cartData));
    displayCartItems(cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

// Display Cart Items Dynamically
const displayCartItems = (data) => {
  parentEle.innerHTML = ""; // Clear existing items

  let cartHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;

  data.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    cartHTML += `
      <tr>
        <td>
          <div class="product-info">
            <img src="${item.featured_image.url}" alt="${item.title}" />
            <span class="light-text">${item.title}</span>
          </div>
        </td>
        <td class="light-text">₹ ${item.price.toLocaleString()}</td>
        <td>
          <input type="number" value="${
            item.quantity
          }" min="1" data-index="${index}" class="quantity-input" />
        </td>
        <td>₹ ${subtotal.toLocaleString()}</td>
        <td><button class="remove-btn" data-index="${index}"><img src="./assets/delete.png" /> </button></td>
      </tr>
    `;
  });

  cartHTML += "</tbody></table>";
  parentEle.insertAdjacentHTML("afterbegin", cartHTML);

  // Update total price
  totalPriceEle.textContent = `₹ ${total.toLocaleString()}`;
  subtotalEle.textContent = `₹ ${total.toLocaleString()}`;

  // Attach event listeners
  attachEventListeners();
};

// Attach Event Listeners for Quantity Change and Item Removal
const attachEventListeners = () => {
  // Update quantity event
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = event.target.dataset.index;
      const newQuantity = parseInt(event.target.value);
      updateQuantity(index, newQuantity);
    });
  });

  // Remove item event
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.dataset.index;
      removeItem(index);
    });
  });
};

// Update Quantity of Cart Item
const updateQuantity = (index, newQuantity) => {
  if (newQuantity < 1) return;

  cartData[index].quantity = newQuantity;
  localStorage.setItem("cartData", JSON.stringify(cartData));
  displayCartItems(cartData);
};

// Remove Item from Cart
const removeItem = (index) => {
  if (confirm("Are you sure you want to remove this item?")) {
    cartData.splice(index, 1);
    localStorage.setItem("cartData", JSON.stringify(cartData));
    displayCartItems(cartData);
  }
};

// Fetch Data on Page Load or Retrieve from Local Storage
if (localStorage.getItem("cartData") > 0) {
  cartData = JSON.parse(localStorage.getItem("cartData"));

  displayCartItems(cartData);
} else {
  console.log("data not found, calling api");
  fetchData();
}

// Checkout Button Functionality
document.querySelector(".checkout-btn").addEventListener("click", () => {
  alert("Hey there! Thank You for shopping with us.");
});
