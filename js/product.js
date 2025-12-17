if(!localStorage.getItem("type")){
  location.href = "index.html";
}

let title = document.getElementById("title");
let sub_title = document.getElementById("sub_title");
let price = document.getElementById("price");
let view = document.querySelector(".view");
let preview = document.querySelector(".preview");
let views = document.querySelector(".views");
let views_text = document.querySelector(".views_text");//نص الزيارات
let views_num = document.querySelector(".views_num");//اعداد الزيارات
let profit_text = document.querySelector(".profit_text");//الارابح
let profit_num = document.querySelector(".profit_num");//اعداد الارباح
let system_type = document.querySelector(".system_type");//نوع نظام التشغيل

if(localStorage.getItem("type") == "web_them.json"){
   views.style.display = "none";
}else if (localStorage.getItem("type") == "web_side.json" ||
localStorage.getItem("type") == "appliction.json"){
   views.style.display = "flex";
}

// جلب اسم الملف من localStorage
const typeFile = localStorage.getItem("type");
const url = `php/json/${typeFile}?v=${Date.now()}`; // إضافة timestamp لتجاوز الكاش
const xhr1 = new XMLHttpRequest();
xhr1.open("GET", url, true); // استخدام الرابط الجديد

xhr1.onload = function() {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);
    const viewCode = localStorage.getItem("view");

    for (let i = 0; i < data.length; i++) {
      if (data[i].code === viewCode) {
        console.log("تم العثور على المنتج:", data[i].name);

        // 🟢 تعبئة العناوين والأسعار
        title.textContent = data[i].name;
        sub_title.textContent = data[i].description;
        price.textContent = data[i].price;
        
        preview.textContent = (data[i].preview || 0) + " عمليات الشراء";
 
        // 🟢 التقنيات المستخدمة
        if (data[i].technologies) {
          const add_tec = document.querySelector(".tec");
          const tecArray = data[i].technologies.split(",").map(item => item.trim()); // تحويل النص إلى مصفوفة
          if(localStorage.getItem("type") == "web_side.json"){
            views_text.innerText = "الزيارات الشهريه";
            views_num.innerText = data[i].visits;
            profit_text.innerText = "الارباح الشهريه";
            profit_num.innerText = data[i].monthly_earnings;
          }else if(localStorage.getItem("type") == "appliction.json"){
             views_text.innerText = "عدد المستخدمين";
            views_num.innerText = data[i].downloads;
            profit_text.innerText = "الارباح الشهريه";
            profit_num.innerText = data[i].monthly_earnings;
            system_type.innerText = data[i].operating_system;
          }else if(localStorage.getItem("type") == "app_code.json"){
            system_type.innerText = data[i].operating_system;
            document.getElementById("views").style.display = "none";
            document.getElementById("Profits").style.display = "none";

          }
          
          let retting = 0;

// عناصر النجوم
let stars = [
  document.getElementById("one"),
  document.getElementById("two"),
  document.getElementById("three"),
  document.getElementById("four"),
  document.getElementById("five")
];

// دالة لتلوين النجوم حتى الرقم المختار
function setStars(num){
  for(let i=0; i<stars.length; i++){
    if(i < num){
      stars[i].className = "fa-solid fa-star";
      stars[i].style.color = "yellow";
    } else {
      stars[i].className = "fa-regular fa-star";
      stars[i].style.color = "black";
    }
  }
}

function sendRating(){
  let arr = (localStorage.getItem("retting") || "").split(",");
if(arr.includes(data[i].code)){
  alert("غير مسموح لك بتقييم هذا المنتج لانه تم تقييمه سابقا");
  return;
}else{ 
  const dataratting = {
    prodect : data[i].code,
    rett : retting,
    database : localStorage.getItem("type")
  };

  const formData = new FormData();
  for(const key in dataratting){
    formData.append(key, dataratting[key]);
  }

  fetch("http://localhost/web_stor/php/retting.php",{
    method:"POST",
    body: formData
  })
  .then(r => r.text())
  .then(result =>{
    if(result.includes("تم اضافة التقييم بنجاح") === true){
      alert("تم اضافة تقييمك بنجاح و لا يمكنك تقييم المنتج مره اخري ")
    }
    console.log(result);
     localStorage.setItem("retting",
      (localStorage.getItem("retting") || "") +","+ data[i].code
    );
  })
  .catch(err => console.error("حدث خطأ", err));
}}

// event listeners
stars.forEach((star, index)=>{
  star.addEventListener("click", ()=>{
    retting = index + 1;   // 1 إلى 5
    setStars(retting);     // تلوين النجوم
    sendRating();          // إرسال التقييم بعد الضغط
  });
});
//اضافة التقييم 
let str = document.getElementById("stars");
let ret = data[i].rating / data[i].views;
ret = parseFloat(ret.toFixed(1));
view.textContent = ret || 0;

// احسب عدد النجوم كعدد صحيح (1 إلى 5)
let starsCount = Math.round(ret); 

// مسح النجوم القديمة أولاً
str.innerHTML = "";

for (let j = 0; j < starsCount; j++) {
    let star_icon = document.createElement("i");
    star_icon.className = "fa-solid fa-star";
    star_icon.style.color = "yellow";
    str.appendChild(star_icon);
}


let view_web = document.querySelector(".view_web");

view_web.addEventListener("click", (event) => {
    event.preventDefault();

    // الرابط والبيانات التي تريد إرسالها
    if(localStorage.getItem("type") == "web_them.json"){
      const link = data[i].view_link;

    // إنشاء نموذج ديناميكي
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "http://localhost/web_stor/php/viewweb.php";

    // إضافة الحقل المطلوب
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "link";
    input.value = link;
    form.appendChild(input);

    // إضافة النموذج إلى body ثم إرساله
    document.body.appendChild(form);
    form.submit();
    }else if(localStorage.getItem("type") == "app_code.json"){
      view_web.style.display = "none";
    }else if(localStorage.getItem("type") == "web_side.json"){
      view_web.addEventListener("click",()=>{
        window.open(data[i].view_link);
      })
    }else if(localStorage.getItem("type") == "appliction.json"){
      view_web.addEventListener("click",()=>{
        window.open(data[i].view_link);
      })
    }
  
});

          tecArray.forEach(tech => {
            let div = document.createElement("div");
            let icon = document.createElement("i");

            // إضافة أيقونة افتراضية
            icon.classList.add("fa-solid", "fa-code");

            let p_tec = document.createElement("p");
            p_tec.textContent = tech;

            div.appendChild(icon);
            div.appendChild(p_tec);
            add_tec.appendChild(div);
          });
        }
        let bay_btn = document.querySelector(".payment");
        bay_btn.addEventListener("click",()=>{
          window.open("pay.html");
          localStorage.setItem('view',data[i].code);
        })
       


        // 🟢 الصور (image1 إلى image8)
        const imgs = document.querySelectorAll(".img");
        imgs.forEach((img, index) => {
          const imageKey = `image${index + 1}`; // لأن الصور تبدأ من image1
          const imageUrl = data[i][imageKey];

          if (imageUrl) {
            const finalUrl = imageUrl.slice(0, -4) + "raw=1";
            img.src = finalUrl;

            // عند الضغط على أي صورة، تصبح الصورة الرئيسية
            img.addEventListener("click", () => {
              document.getElementById("image_1").src = img.src;
            });
          }
        });
      }
    }
  }
};
xhr1.send();

