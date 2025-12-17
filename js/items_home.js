//تفعيل الاقسام 


let link_btn = document.querySelectorAll(".link_btn");

link_btn.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
  });
});

function prodect (click , event ){
    let item = document.getElementById(`${click}`);
    item.addEventListener("click",()=>{
        localStorage.setItem("type" , event);
        location.href = "products.html"; 
    })
}
prodect("web_them","web_them.json");
prodect("web_side","web_side.json");
prodect("app_code","app_code.json");
prodect("appliction","appliction.json");
//اضافة المنتجات 
 function get(API,continer){
const xhr1 = new XMLHttpRequest();
xhr1.open("GET", `php/json/${API}?v=${Date.now()}`, true);
xhr1.onload = function() {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);
  for (let i = 0; i < data.length; i++) {
    if(data[i].page_link === "home_page"){
 const contine = document.getElementById(continer);

/* العنصر الأساسي */
const slide = document.createElement("div");
slide.className = "swiper-slide product";

/* img_product */
const imgProduct = document.createElement("div");
imgProduct.className = "img_product";

const linkImg = document.createElement("a");
linkImg.href = "#";

const img = document.createElement("img");
img.src = data[i].image1.slice(0, -4) + "raw=1";
img.alt = "";

linkImg.appendChild(img);
imgProduct.appendChild(linkImg);

/* stars */
const stars = document.createElement("div");
stars.className = "stars";
//حساب التقييم 
let ret = data[i].rating / data[i].views;
ret = parseFloat(ret.toFixed(1));

for (let s = 0; s < ret; s++) {
    const star = document.createElement("i");
    star.className = "fa-solid fa-star";
    stars.appendChild(star);
}

/* name */
const nameProduct = document.createElement("p");
nameProduct.className = "name_product";

const nameLink = document.createElement("a");
nameLink.href = "#";
nameLink.textContent = data[i].name;

nameProduct.appendChild(nameLink);

/* price */
const price = document.createElement("div");
price.className = "price";

const priceP = document.createElement("p");
const priceSpan = document.createElement("span");
priceSpan.textContent = `$${data[i].price}`;

priceP.appendChild(priceSpan);
price.appendChild(priceP);

/* icons */
const icons = document.createElement("div");
icons.className = "icons";

const btnAddCart = document.createElement("span");
btnAddCart.className = "btn_add_cart";
btnAddCart.textContent = " اشتري الان";

const cartIcon = document.createElement("i");
cartIcon.className = "fa-solid fa-cart-shopping";

btnAddCart.prepend(cartIcon);
icons.appendChild(btnAddCart);

/* تجميع كل العناصر */
slide.appendChild(imgProduct);
slide.appendChild(stars);
slide.appendChild(nameProduct);
slide.appendChild(price);
slide.appendChild(icons);

/* إضافته إلى العنصر الأب */
contine.appendChild(slide);

    btnAddCart.addEventListener("click",()=>{
         localStorage.setItem("view",data[i].code);
        localStorage.setItem("type",API);
        location.href = "product.html";
    })

}}}}
xhr1.send();
}
    get("web_them.json","WebThem");
    get("web_side.json","WebSide");
    get("app_code.json","AppCode");
    get("appliction.json","Appliction");
