document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return console.error("لم يتم العثور على form في الصفحة.");

  const fileInput = document.getElementById("imageInput");
  if (!fileInput) return console.error("لم يتم العثور على input#imageInput. تأكد من وجوده و id صحيح.");

  const imageBoxes = Array.from(document.querySelectorAll(".prodet_img .img span"));
  if (!imageBoxes.length) console.warn("لم يتم العثور على مربعات الصور (.prodet_img .img span). تأكد من HTML.");

  const productCodeInput = document.querySelector('input[name="prodect_code"]');
  if (!productCodeInput) return console.error('لم يتم العثور على input[name="prodect_code"].');
  
  const type = document.getElementById("type");
  let btn_submit = document.getElementById("btn_submit");
  btn_submit.addEventListener("click",()=>{
    if(type.value == "none"){
      alert("حدد فئة المنتج");
      return;
    }
  })
  // تأكد أن حقل الملفات يسمح باختيار عدة صور
  fileInput.setAttribute("multiple", "");
  fileInput.setAttribute("accept", "image/*");

  // جعل حقل كود المنتج غير قابل للكتابة
  productCodeInput.readOnly = true;

  // اجعل كل مربع قابل للنقر لفتح اختيار الملفات
  imageBoxes.forEach((box) => {
    box.style.cursor = "pointer";
    box.style.position = "relative";
    box.addEventListener("click", () => fileInput.click());
  });
let tool = document.getElementById("tool");

tool.addEventListener("input", function() {
    // استبدال أي مسافة بـ ,
    this.value = this.value.replace(/ /g, ",");
});

  // عند اختيار الصور
  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length !== 8) {
      alert("يجب اختيار 8 صور بالضبط! اختر حالياً: " + files.length);
      fileInput.value = "";
      imageBoxes.forEach(box => {
        const img = box.querySelector("img");
        if (img) img.src = "";
        const nameTag = box.querySelector(".file-name");
        if (nameTag) nameTag.remove();
      });
      return;
    }

    imageBoxes.forEach((box, i) => {
      const file = files[i];
      const img = box.querySelector("img");
      if (!img) {
        console.warn("لا يوجد عنصر img داخل المربع رقم", i);
        return;
      }

      let nameTag = box.querySelector(".file-name");
      if (!nameTag) {
        nameTag = document.createElement("p");
        nameTag.className = "file-name";
        Object.assign(nameTag.style, {
          position: "absolute",
          bottom: "5px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.55)",
          color: "white",
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "4px",
          maxWidth: "95%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "center",
          boxSizing: "border-box"
        });
        box.appendChild(nameTag);
      }

      if (file) {
        const url = URL.createObjectURL(file);
        img.src = url;
        img.style.objectFit = "cover";
        img.style.width = "100%";
        img.style.height = "100%";
        nameTag.textContent = file.name;
      } else {
        img.src = "";
        nameTag.textContent = "";
      }
    });
  });

  // عند الإرسال: التحقق فقط بدون توليد كود المنتج
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    form.querySelectorAll("input, textarea, select").forEach(inp => inp.style.border = "");

    let valid = true;
    const requiredSelectors = [
      'input[name="prodect_name"]',
      'input[name="prodect_price"]',
      'input[name="seller"]',
      'textarea[name="description"]'
    ];
    requiredSelectors.forEach(sel => {
      const el = form.querySelector(sel);
      if (el && el.value.trim() === "") {
        el.style.border = "2px solid red";
        valid = false;
      }
    });

    if (!fileInput.files || fileInput.files.length !== 8) {
      alert("يجب اختيار 8 صور قبل الإرسال.");
      valid = false;
    }

    if (!valid) {
      console.warn("التحقق فشل، تم منع الإرسال.");
      return;
    }

    // لا يتم توليد كود المنتج تلقائيًا هنا
    // فقط نرسل النموذج كما هو
    form.submit();
  });
});

// منطق إظهار الأقسام حسب نوع المشروع
let type = document.querySelector(".type");
let side = document.querySelector(".side");
let operating_system = document.querySelector(".operating_system");
let view_link = document.getElementById("view_link");
let appliction = document.querySelector(".appliction");

side.style.display = "none";
type.addEventListener("change", function() {
  if (type.value === "web_side") {
    side.style.display = "block";
    operating_system.style.display = "none";
    appliction.style.display = "none";
  } else if (type.value === "app_code") {
    side.style.display = "none";
    operating_system.style.display = "block";
    appliction.style.display = "none";
    view_link.style.display = "none";
  } else if (type.value === "appliction") {
    side.style.display = "none";
    operating_system.style.display = "block";
    appliction.style.display = "block";
  } else {
    side.style.display = "none";
    operating_system.style.display = "none";
    appliction.style.display = "none";
  }
});

if (localStorage.getItem("type") === "add"){
  let form = document.getElementById("form");
   // اضافة منتج في الوضع العادي
  form.action = "php/add_prodect.php";

}else if(localStorage.getItem("type") === "edit"){
  // في حالة تعديل المنتج 
  let prodet_img = document.querySelector(".prodet_img");
  prodet_img.remove();
  let seller = document.getElementById("seller");
  seller.style.display = "block";
  // استدعاء البيانات 
  let edit_title = document.querySelector(".edit_title");
  let edit_suptitle = document.querySelector(".edit_suptitle");
  let submit = document.getElementById("btn_submit");
  submit.innerText = "حفظ التعديل";
  submit.style.backgroundColor = "red";
  edit_title.innerText = "تعديل منتج";
  edit_suptitle.innerText = "قم بالتعديل علي علي البيانات التاليه كود المنتج غير قابل للتعديل كذالك الصور اذا اردت تعديلها احذف المنتج و اعد اضافته ";

  let prodect_name = document.getElementsByName("prodect_name");
  let prodect_code = document.getElementsByName("prodect_code");
  let description = document.getElementsByName("description");
  let prodect_price = document.getElementsByName("prodect_price");
  let type = document.getElementsByName("type");
  let tole = document.getElementsByName("tole");
  let seller_code = document.getElementsByName("seller");
  let view_page = document.getElementsByName("view_page");
  let prodect_type = document.getElementsByName("prodect_type");
  //في حالة كان موقع او تطبيق فعلي 
  let visity = document.getElementsByName("visity");
  let monthly = document.getElementsByName("monthly");
  //في حالة كان تطبيق فعلي 
  let downloads = document.getElementsByName("downloads");
  let monthly_earnings = document.getElementsByName("monthly_earnings");
  //رابط التحميل و المشاهده 
  let downlode = document.getElementById("downlode");
  downlode.remove();
  let view_link = document.getElementsByName("view_link");
  //الفئه و نظام التشغيل
  let ification = document.getElementsByName("ification");
  let operating_system = document.getElementsByName("operating_system");
  form.action = "php/edit_prodect.php";
  const xhr2 = new XMLHttpRequest();
  xhr2.open("GET", `php/json/${localStorage.getItem("prodect")}`, true);
  xhr2.onload = function() {
  if (xhr2.status === 200) {
    const data = JSON.parse(xhr2.responseText);
  for (let i = 0; i < data.length; i++) {
    if(data[i].code === localStorage.getItem("code")){
      prodect_code[0].value = data[i].code;
      prodect_name[0].value = data[i].name;
      description[0].value = data[i].description;
      prodect_price[0].value = data[i].price;
      type[0].value = localStorage.getItem("prodect").slice(0, -5);
      tole[0].value = data[i].technologies;
      seller_code[0].value = data[i].seller;
      view_page[0].value = data[i].page_link;
      view_link[0].value = data[i].view_link;
      ification[0].value = data[i].ification;
      prodect_type[0].value = data[i].type;

      if(localStorage.getItem("prodect") === "web_side.json"){
       let side = document.querySelector(".side");
       side.style.display = "block";
       visity[0].value = data[i].visits;
       monthly[0].value = data[i].monthly_earnings;
      } else if (localStorage.getItem("prodect") === "appliction.json") {
        let operating_system_1= document.querySelector(".operating_system");
        let appliction = document.querySelector(".appliction");
       operating_system_1.style.display = "block";
       appliction.style.display = "block";
       downloads[i].value = data[i].downloads;
       monthly_earnings[i].value = data[i].monthly_earnings;
       operating_system[i].value = data[i].operating_system;
      } else if (localStorage.getItem("prodect") === "app_code.json") {
       let operating_system = document.querySelector(".operating_system");
       operating_system.style.display = "block";
       operating_system[i].value = data[i].operating_system;
      }  
    }

  }}}

xhr2.send();
}
//في حالة كان يتم اضافة منتج من قبل بائع 

if(localStorage.getItem("acount") === "seller"){
  document.querySelectorAll(".active").forEach(el => el.remove());
  document.querySelectorAll(".home_page").forEach(el => el.remove());
  document.querySelector(".seller_data").remove();
}
let seller = document.querySelector(".seller");
seller.value = localStorage.getItem("code");
seller.readOnly = true;
