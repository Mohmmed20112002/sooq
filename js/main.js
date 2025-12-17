let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list(){
    category_nav_list.classList.toggle("active")

}

let nav_links = document.querySelector(".nav_links")

function open_Menu() {
    nav_links.classList.toggle("active")
}


var cart = document.querySelector('.cart');

function open_close_cart() {
    cart.classList.toggle("active")
}
// navbar
// الاقسام 
function category(children,type){
category_nav_list.children[children].addEventListener("click", (e) => {
    e.preventDefault(); // الصحيح
    localStorage.setItem("type", type);
    location.href = "products.html";
});
}
category(0,"web_them.json");
category(1,"web_side.json");
category(2,"app_code.json");
category(3,"appliction.json");

function nav_link(children,type){
    nav_links.children[children].addEventListener("click",(e)=>{
        e.preventDefault();
        localStorage.setItem("type",type);
        location.href = "products.html";
    })
}
nav_link(2,"web_them.json");
nav_link(3,"web_side.json");
nav_link(5,"app_code.json");
nav_link(6,"appliction.json");

let blog = document.querySelector(".blog");
blog.addEventListener("click",()=>{
    location.href = "blog.html";
})
let home = document.querySelector(".home");
home.addEventListener("click",()=>{
    location.href = "index.html";
})
//مربع البحث let select_serch = document.querySelector(".select_serch");
let select_serch = document.querySelector(".select_serch");
let serch = document.querySelector(".serch");
let serch_btn = document.querySelector(".serch_btn");
serch_btn.addEventListener("click",(e)=>{
  e.preventDefault();
  localStorage.setItem("serech",serch.value);
  localStorage.setItem("type",select_serch.value);
  location.href = "products.html";
})