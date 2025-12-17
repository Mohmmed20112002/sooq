if(!localStorage.getItem("type")){
  location.href = "index.html";
}


let web_continer = document.querySelector(".web_continer");
let plus = document.querySelector(".plus");
let minus = document.querySelector(".Minus");
let pag = document.querySelector(".page");

let page = 1; // رقم الصفحة الحالية
const ITEMS_PER_PAGE = 9; // عدد العناصر في كل صفحة
pag.innerText = page;

// استدعاء API
const xhr1 = new XMLHttpRequest();
xhr1.open("GET", `php/json/${localStorage.getItem("type")}?v=${Date.now()}`, true);

xhr1.onload = function () {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);
    let totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    // دالة لعرض المنتجات في الصفحة المحددة
    function displayProducts() {
      web_continer.innerHTML = ""; // مسح المحتوى القديم
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = Math.min(start + ITEMS_PER_PAGE, data.length);

      for (let i = start; i < end; i++) {
        // نحول technologies من نص إلى مصفوفة
        let technologiesArray = data[i].technologies
          .split(",")
          .map((t) => t.trim());

        // تجهيز الصورة
        let image1 = data[i].image1;
        image1 = image1.slice(0, -4) + "raw=1";

        // إنشاء البطاقة
        const web_card = document.createElement("div");
        web_card.classList.add("web_card");

        const web_img = document.createElement("div");
        web_img.classList.add("web_img");

        const img = document.createElement("img");
        img.src = image1;
        web_img.appendChild(img);

        const web_text = document.createElement("div");
        web_text.classList.add("web_text");

        const h4 = document.createElement("h4");
        h4.innerText = data[i].name;

        const p = document.createElement("p");
        p.innerText = data[i].description;

        const web_tec = document.createElement("div");
        web_tec.classList.add("web_tec");

        const Evaluation = document.createElement("span");
        Evaluation.classList.add("Evaluation");

        const span = document.createElement("span");
        let views = data[i].views;
        let ret = data[i].rating;
        let ret_num = ret / views 
        span.innerText = Math.round(ret_num * 10) / 10 || 0;

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-star");

        const ul = document.createElement("ul");

        // إضافة التقنيات
        technologiesArray.forEach((tech) => {
          const li = document.createElement("li");
          li.classList.add("li_tec")
          li.innerText = tech;
          ul.appendChild(li);
        });

        const web_price = document.createElement("div");
        web_price.classList.add("web_price");

        const buying = document.createElement("button");
        buying.classList.add("buying");
        buying.innerText = "اشتري الآن";

        const buying_span = document.createElement("span");
        buying_span.style.color = "black";
        buying_span.innerText = data[i].price + "$";

        const span_ification = document.createElement("span");
        span_ification.innerText = data[i].ification || "تجاري";
        span_ification.style.color = "black";
        // تجميع العناصر
        Evaluation.append(span, icon);
        web_tec.append(Evaluation, ul);
        web_text.append(h4, p);
        web_price.append(buying, buying_span, span_ification);
        web_card.append(web_img, web_text, web_tec, web_price);
        web_continer.appendChild(web_card);
        Evaluation.children[0].style.color = "black";
        if(data[i].type == "not_active" || data[i].name == "0"){
          web_card.remove();
        }
        web_card.addEventListener("click",()=>{
        localStorage.setItem("view", data[i].code);
        location.href = "product.html";
        })
        
        //تفعيل البحث بالاسم
        if(localStorage.getItem("serech")){
          if(data[i].name.includes(localStorage.getItem("serech")) === true|| 
            data[i].description.includes(localStorage.getItem("serech")) === true ){
            web_card.style.display = "flex";
          }else{
            web_card.style.display = "none";
            localStorage.removeItem("serech");
        }
        }


        let prodect_name = document.querySelector(".prodect_name");
        let btn_search = document.querySelector(".btn_search");
        btn_search.addEventListener("click",()=>{
          if(data[i].name.includes(prodect_name.value )||
             data[i].description.includes(prodect_name.value )){
            web_card.style.display = "flex";
          }else{
            web_card.style.display = "none";
          }}) 
          //تفعيل البحث بالفئه
          let category = document.getElementById("category");
          category.addEventListener("change",()=>{
            if(data[i].ification === category.value){
              web_card.style.display = "flex";
            }else if (category.value === "الكل"){
              web_card.style.display = "flex";
            }else{
              web_card.style.display = "none";
            }
          })
          //تفعيل البحث بالتقنيه
         let tec_serch = document.getElementById("tec_serch");
         let tec = document.querySelector(".tecno");
         tec_serch.addEventListener("click",()=>{
          if(data[i].technologies.includes(tec.value) === true){
            web_card.style.display = "flex";
          }else{
            web_card.style.display = "none";
          }
         }) 
         //تفعيل البحث بالسعر 
       let btn_price = document.querySelector(".btn_price");
       let price_down = document.querySelector(".price_down");
       let price_up = document.querySelector(".price_up");

       btn_price.addEventListener("click", () => {
       let min = Number(price_down.value);
       let max = Number(price_up.value);
       let price = Number(data[i].price);

       if (price >= min && price <= max) {
       web_card.style.display = "flex";
       } else {
       web_card.style.display = "none";
       }
       });   
       }

      // تحديث رقم الصفحة في الواجهة
      pag.innerText = page;
    }

    // أول عرض عند تحميل الصفحة
    displayProducts();

    // عند الضغط على زر plus ➕
    plus.addEventListener("click", () => {
      if (page < totalPages) {
        page++;
        displayProducts();
      }
    });

    // عند الضغط على زر minus ➖
    minus.addEventListener("click", () => {
      if (page > 1) {
        page--;
        displayProducts();
      }
    });

  }
 
};

xhr1.send();
// تفعيل روابط التواصل الاجتماعي 
