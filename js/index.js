const app = document.getElementById("app");
const loader = document.querySelector(".loader");
const counter = document.querySelector("#counter");
let debounce = true;
let current = 1;
let timer;
const getImages = async (amount = 1) => {
  let page = getRandomInRange(1, 10);
  let url = `https://picsum.photos/v2/list?page=${page}&limit=100`;
  const response = await fetch(url);
  const data = await response.json();
  const newData = extractImageWithAutor(data);
  drawImages(newData, amount);
};
const getRandomInRange = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};
const extractImageWithAutor = (data) => {
  const newData = data.map((item) => {
    return { author: item["author"], url: item["download_url"] };
  });
  return newData;
};
const createImg = ({ url, author }) => {
  const div = document.createElement("div");
  div.classList.add(["container"]);
  const img = document.createElement("img");
  img.setAttribute("src", url);
  img.setAttribute("loading", "loading");
  img.setAttribute("crossorigin", "");
  img.setAttribute("alt", author);
  div.appendChild(img);
  img.addEventListener("load", (data) => {
    const images = document.querySelectorAll("img").length + 1;
    loader.classList.add("fade-out");
    app.appendChild(div);
    Grade(data["path"]["1"]);
  });
};
const range = (start = 1, end = 1) => {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
};
const drawImages = (data, amount = 1) => {
  const listImages = [];
  for (const i in range(1, amount)) {
    listImages.push(data[Math.floor(Math.random() * data.length)]);
  }
  for (const i of listImages) {
    createImg(i);
  }
};
const handleIntersection = (entries) => {
  entries.map((entry) => {
    if (entry.isIntersecting) {
      if (timer) {
        clearTimeout(timer);
      }
      if (debounce) {
        getImages();
        debounce = false;
      } else {
        timer = setTimeout(() => {
          debounce = true;
        }, 500);
      }
    }
  });
};
window.addEventListener("load", () => {
  getImages(5);
  app.addEventListener("scroll", (data) => {
    const images = document.querySelectorAll(".container");
    const lastImage = images[images.length - 1];
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [1.0],
    });
    observer.observe(lastImage);
  });
});
