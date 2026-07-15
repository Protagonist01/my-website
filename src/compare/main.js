const routeMap = [
  { label: "Home", v1: "/", v2: "/v2/" },
  { label: "Work", v1: "/works/", v2: "/v2/work/" },
  { label: "About", v1: "/about/", v2: "/v2/about/" },
  { label: "Skills", v1: "/my-stack/", v2: "/v2/about/#stack" },
  { label: "Experience", v1: "/experience/", v2: "/v2/about/#experience" },
  { label: "Evidence", v1: "/testimonial/", v2: "/v2/proof/" },
  { label: "Contact", v1: "/contact/", v2: "/v2/contact/" },
  { label: "AI engineering", v1: "/works/ai-agents/", v2: "/v2/services/ai-engineering/" },
  { label: "Machine learning", v1: "/works/ai-workflows/", v2: "/v2/services/machine-learning/" },
  { label: "Conversational AI", v1: "/ecommerce%20demo%20gallery/", v2: "/v2/services/conversational-ai/" },
  { label: "Full-stack product engineering", v1: "/works/fullstack/", v2: "/v2/services/product-engineering/" },
  { label: "Project galleries", v1: "/demo%20gallery/", v2: "/v2/work/#experiments" },
];

const select = document.getElementById("compare-route");
const stage = document.querySelector(".compare-stage");
const v1Frame = document.getElementById("v1-frame");
const v2Frame = document.getElementById("v2-frame");
const v1Open = document.getElementById("v1-open");
const v2Open = document.getElementById("v2-open");
const refresh = document.getElementById("compare-refresh");
const viewportButtons = [...document.querySelectorAll("[data-viewport]")];

routeMap.forEach((route, index) => {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = route.label;
  select.append(option);
});

function applyRoute() {
  const route = routeMap[Number(select.value)] || routeMap[0];
  v1Frame.src = route.v1;
  v2Frame.src = route.v2;
  v1Open.href = route.v1;
  v2Open.href = route.v2;
  window.history.replaceState(null, "", `?route=${encodeURIComponent(route.label.toLowerCase().replaceAll(" ", "-"))}`);
}

function initialRoute() {
  const requested = new URLSearchParams(window.location.search).get("route");
  const index = routeMap.findIndex((route) => route.label.toLowerCase().replaceAll(" ", "-") === requested);
  select.value = String(index >= 0 ? index : 0);
  applyRoute();
}

select.addEventListener("change", applyRoute);
refresh.addEventListener("click", () => {
  v1Frame.contentWindow?.location.reload();
  v2Frame.contentWindow?.location.reload();
});

viewportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewportButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    stage.dataset.viewport = button.dataset.viewport;
  });
});

initialRoute();
