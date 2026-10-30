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

document.querySelectorAll(".practice-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".practice-option").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    const practice = button.dataset.practice;
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
  });
});
