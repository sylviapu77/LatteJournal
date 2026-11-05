const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "開啟導覽選單" : "關閉導覽選單");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "開啟導覽選單");
    siteNav.classList.remove("is-open");
  });
});

const practiceMessage = document.querySelector(".practice-message strong");
const practiceEyebrow = document.querySelector("#practice-eyebrow");
const practiceHeading = document.querySelector("#practice-heading");
const practiceDescription = document.querySelector("#practice-description");
const practiceSteps = document.querySelector("#practice-steps");
const practiceGuides = {
  "心形拉花": [
    "把奶泡打到細緻綿密，輕敲並旋轉奶缸讓泡沫融合。",
    "先將奶缸抬高，細細地把牛奶注入濃縮咖啡中央。",
    "液面升高後降低奶缸，穩定注入形成白色圓點，再向前收尾成心形。"
  ],
  "鬱金香拉花": [
    "先以較高的奶缸注入牛奶，讓咖啡液面升高。",
    "降低奶缸，在杯子中央注出第一個白色圓點。",
    "稍微抬高奶缸，往前再疊幾個圓點，最後穿過圓點收尾。"
  ],
  "葉子拉花": [
    "先以較高的奶缸注入牛奶，讓咖啡液面升高。",
    "降低奶缸，從杯子後方開始左右輕晃奶缸並慢慢往前移。",
    "接近杯緣時抬高奶缸，細細地穿過葉片中心收尾。"
  ]
};

function selectPractice(practice) {
  document.querySelectorAll(".practice-option").forEach((option) => {
    const selected = option.dataset.practice === practice;
    option.classList.toggle("is-selected", selected);
    option.setAttribute("aria-pressed", String(selected));
  });

  practiceEyebrow.textContent = "跟著步驟慢慢來";
  practiceHeading.textContent = `${practice}｜簡單步驟`;
  practiceDescription.hidden = true;
  practiceSteps.replaceChildren(...practiceGuides[practice].map((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    return item;
  }));
  practiceSteps.hidden = false;
  practiceMessage.textContent = practice;
}

document.querySelectorAll(".practice-option, .pattern-image").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    selectPractice(trigger.dataset.practice);
  });
});

const products = {
  pitcher: { name: "日常拉花奶缸", price: 680 },
  beans: { name: "晨光配方咖啡豆", price: 420 },
  cup: { name: "慢慢喝陶杯", price: 520 }
};
const cartDialog = document.querySelector(".cart-dialog");
const cartToggle = document.querySelector(".cart-toggle");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartEmpty = document.querySelector(".cart-empty");
const cartSummary = document.querySelector(".cart-summary");
const cartSubtotal = document.querySelector(".cart-subtotal");
const checkoutNote = document.querySelector(".checkout-note");
let cart = {};

try {
  const savedCart = localStorage.getItem("latte-journal-cart");
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    if (parsedCart && typeof parsedCart === "object" && !Array.isArray(parsedCart)) {
      cart = Object.fromEntries(
        Object.entries(parsedCart).filter(([id, quantity]) =>
          products[id] && Number.isInteger(quantity) && quantity > 0
        )
      );
    }
  }
} catch (error) {
  console.error("無法讀取已儲存的購物車：", error);
}

function saveCart() {
  try {
    localStorage.setItem("latte-journal-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("無法儲存購物車：", error);
  }
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const subtotal = entries.reduce((total, [id, quantity]) => total + products[id].price * quantity, 0);

  cartCount.textContent = String(itemCount);
  cartToggle.setAttribute("aria-label", `開啟購物車，${itemCount} 件商品`);
  cartEmpty.hidden = entries.length > 0;
  cartSummary.hidden = entries.length === 0;
  cartSubtotal.textContent = `NT$ ${subtotal.toLocaleString("zh-TW")}`;
  cartItems.replaceChildren(...entries.map(([id, quantity]) => {
    const product = products[id];
    const item = document.createElement("li");
    item.className = "cart-item";

    const name = document.createElement("span");
    name.className = "cart-item-name";
    name.textContent = product.name;
    const price = document.createElement("span");
    price.className = "cart-item-price";
    price.textContent = `NT$ ${(product.price * quantity).toLocaleString("zh-TW")}`;

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    const decrease = document.createElement("button");
    decrease.className = "quantity-button";
    decrease.type = "button";
    decrease.dataset.cartAction = "decrease";
    decrease.dataset.productId = id;
    decrease.setAttribute("aria-label", `減少${product.name}數量`);
    decrease.textContent = "−";
    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = String(quantity);
    const increase = document.createElement("button");
    increase.className = "quantity-button";
    increase.type = "button";
    increase.dataset.cartAction = "increase";
    increase.dataset.productId = id;
    increase.setAttribute("aria-label", `增加${product.name}數量`);
    increase.textContent = "＋";
    controls.append(decrease, quantityLabel, increase);

    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.type = "button";
    remove.dataset.cartAction = "remove";
    remove.dataset.productId = id;
    remove.textContent = "移除";
    item.append(name, price, controls, remove);
    return item;
  }));
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const { productId } = button.dataset;
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    renderCart();
    cartDialog.showModal();
  });
});

cartToggle.addEventListener("click", () => cartDialog.showModal());
document.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});
cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;

  const { cartAction, productId } = button.dataset;
  if (cartAction === "remove" || (cartAction === "decrease" && cart[productId] === 1)) {
    delete cart[productId];
  } else if (cartAction === "decrease") {
    cart[productId] -= 1;
  } else if (cartAction === "increase") {
    cart[productId] += 1;
  }
  saveCart();
  renderCart();
});
document.querySelector(".checkout-button").addEventListener("click", () => {
  checkoutNote.textContent = "目前為展示網站，尚未串接付款功能。";
});

renderCart();
