if(localStorage.getItem("admin") !== "accepted"){
  location.href = "index.html";
}

// Dashboard buttons
let home = document.getElementById("home");
let prodect = document.getElementById("prodect");
let freelancer = document.getElementById("freelancer");
let sellers = document.getElementById("sellers");
let article = document.getElementById("article");
let Social = document.getElementById("Social");
let payment = document.getElementById("payment");
let orders = document.getElementById("orders");

// Dashboard sections/pages
let home_page = document.getElementById("home_page");
let prodect_page = document.getElementById("prodect_page");
let freelanser_page = document.getElementById("freelanser_page");
let Sellers_page = document.getElementById("Sellers_page");
let articles_page = document.getElementById("articles_page");
let Social_page = document.getElementById("Social_page");
let payment_page = document.getElementById("payment_page"); // ✅ تصحيح هنا
let orders_page = document.getElementById("orders_page");

// Arrays
let btn = [home, prodect, freelancer, sellers, article, Social, payment, orders];
let bage = [home_page, prodect_page, freelanser_page, Sellers_page, articles_page, Social_page, payment_page, orders_page];

// إخفاء جميع الصفحات وإلغاء التفعيل
function not_active() {
  for (let i = 0; i < btn.length; i++) {
    if (btn[i]) btn[i].classList.remove("active");
    if (bage[i]) {
      bage[i].classList.remove("section");
      bage[i].classList.add("not_active");
    }
  }
}

// إظهار الصفحة المطلوبة وتفعيل الزر
function active(btn_num, bage_num) {
  if (btn[btn_num]) btn[btn_num].classList.add("active");
  if (bage[bage_num]) {
    bage[bage_num].classList.remove("not_active");
    bage[bage_num].classList.add("section");
  }
}

// 🔄 ربط جميع الأزرار بالأقسام تلقائيًا
for (let i = 0; i < btn.length; i++) {
  if (!btn[i]) continue;
  btn[i].addEventListener("click", () => {
    not_active();
    active(i, i);
  });
}
//روابط التواصل 
let facebook = document.getElementById("facebook");
let instgram = document.getElementById("instgram");
let whatsapp = document.getElementById("whatsapp");
let linkedin = document.getElementById("linkedin");
let email = document.getElementById("email");
// قيم input
let fac = document.getElementById("fac");
let ins = document.getElementById("ins");
let lin = document.getElementById("lin");
let wha = document.getElementById("wha");
let mal = document.getElementById("mal");
const xhr = new XMLHttpRequest();
  xhr.open("GET", `php/json/social_links.json?v=${Date.now()}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      facebook.href = data[0].link;
      fac.value = data[0].link;
      instgram.href = data[1].link;
      ins.value = data[1].link;
      linkedin.href = data[2].link;
      lin.value = data[2].link;
      email.href = "mailto:" + data[3].link;
      mal.value = data[3].link; 
      whatsapp.href = "https:\/\/wa.me\/" + data[4].link;
      wha.value = "https:\/\/wa.me\/" + data[4].link;
    }
  };
  xhr.send();

  //اضافة منتج
  let add_btn = document.querySelector(".add_btn");
  add_btn.addEventListener("click",()=>{
    localStorage.setItem("type","add");
    localStorage.setItem("acount","admin");
    localStorage.setItem("code","000000")
    window.open("add_prodect.html");
  })
  //اضافة مقال
  let add_article = document.getElementById("add_article");
  add_article.addEventListener("click",()=>{
    window.open("add_article.html");
    localStorage.clear();
  })
 const xhr1 = new XMLHttpRequest();
xhr1.open("GET", `php/json/artical.json?v=${Date.now()}`, true);

xhr1.onload = function () {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);

    for (let i = 0; i < data.length; i++) {
      // الكارت الرئيسي
      let artcal_card = document.createElement("div");
      artcal_card.classList.add("artcal_card");

      // العنوان والمعلومات
      let artcal_title = document.createElement("div");
      artcal_title.classList.add("artcal_title");

      let h3 = document.createElement("h3");
      h3.innerText = data[i].main_title;

      let ul = document.createElement("ul");

      // الكاتب
      let li_writer = document.createElement("li");
      let p_writer = document.createElement("p");
      p_writer.innerText = "بواسطة فريق التحرير";
      li_writer.appendChild(p_writer);

      // التاريخ
      let li_date = document.createElement("li");
      li_date.classList.add("data");

      let p_date = document.createElement("p");
      p_date.innerText = data[i].articale_date;

      let i_date = document.createElement("i");
      i_date.classList.add("fa-regular", "fa-calendar");

      li_date.appendChild(p_date);
      li_date.appendChild(i_date);

      // تجميع قائمة المعلومات
      ul.appendChild(li_writer);
      ul.appendChild(li_date);

      artcal_title.appendChild(h3);
      artcal_title.appendChild(ul);

      // القسم السفلي
      let arctal_subtitle = document.createElement("div");
      arctal_subtitle.classList.add("arctal_subtitle");

      let p_sub = document.createElement("p");
      p_sub.innerText = data[i].sub_title;

      let edit = document.createElement("div");
      edit.classList.add("edit");

      let i_edit = document.createElement("i");
      i_edit.classList.add("fa-solid", "fa-pen-to-square");

      let i_delete = document.createElement("i");
      i_delete.classList.add("fa-solid", "fa-trash");

      edit.appendChild(i_edit);
      edit.appendChild(i_delete);

      arctal_subtitle.appendChild(p_sub);
      arctal_subtitle.appendChild(edit);

      // الآن الترتيب الصحيح حسب الـ CSS:
      // داخل artcal_card ➜ العنوان ثم الوصف
      artcal_card.appendChild(artcal_title);
      artcal_card.appendChild(arctal_subtitle);

      // الإضافة إلى الصفحة
      document.getElementById("articales").appendChild(artcal_card);
      //تفعيل البحث 
      let attical_serch = document.querySelector(".attical_serch");
      let btn_attical_serch = document.getElementById("attical_serch");
      btn_attical_serch.addEventListener("click",()=>{
        if(data[i].main_title.includes(attical_serch.value) === true){
          artcal_card.style.display = "flex";
        }else{ artcal_card.style.display = "none";}
      })

      i_delete.addEventListener("click",()=>{
        const artical_data = {
          name:data[i].main_title,
          type: "Delet"
        }
        const formData = new FormData();
        for(const key in artical_data){
          formData.append(key,artical_data[key]);
        }
        fetch("http://localhost/web_stor/php/edit_artical.php",{
          method: "POST",
          body: formData
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert("تم حذف المقال بنجاح",result);
          location.reload(true);
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
      })

      i_edit.addEventListener("click",()=>{
        localStorage.setItem("artical","edit");
        localStorage.setItem("art_type",data[i].main_title);
        location.href = 'add_article.html';
      })
    }
  }
};

xhr1.send();


function API(type){
const xhr2 = new XMLHttpRequest();
xhr2.open("GET", `php/json/${type}?v=${Date.now()}`, true);
xhr2.onload = function() {
  if (xhr2.status === 200) {
    const data = JSON.parse(xhr2.responseText);
  for (let i = 0; i < data.length; i++) {
      let tr = document.createElement("tr");

      let td_1 = document.createElement("td");//التفعيل
      td_1.innerText = data[i].type;
      
      let td_2 = document.createElement("td");//الاسم
      td_2.innerText = data[i].name;

      let td_3 = document.createElement("td");//الكود
      td_3.innerText = data[i].code;
      td_3.style.cursor = "pointer";
      td_3.style.color = "blue";

      let td_4 = document.createElement("td");//الفئه
      td_4.innerText = data[i].ification ?? "اخري";

      let td_5 = document.createElement("td");

      let td_6 = document.createElement("td");

      let td_7 = document.createElement("td");

      let td_8 = document.createElement("td");//مشاهده 
      td_8.style.cursor = "pointer";
      
      let td_9 = document.createElement("td");//التحميل 
       
      let view_icon = document.createElement("i");
      view_icon.className = "fa-solid fa-eye";

      let downlode_icon = document.createElement("i");
      downlode_icon.className = "fa-solid fa-download";
       td_9.addEventListener("click",()=>{
          
   const prodect_data= {
        table: localStorage.getItem("prodect").slice(0,-5),
        item : data[i].code
        }
        const formData = new FormData();
        for(const key in prodect_data){
          formData.append(key,prodect_data[key]);
        }
        fetch("http://localhost/web_stor/php/downlode_prodect.php",{
          method: "POST",
          body: formData
        })
        .then(response=> response.text())
        .then(result =>{
          window.open(result.replace(/dl=0$/, "dl=1"));  
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
       })
       td_8.appendChild(view_icon);
       td_9.appendChild(downlode_icon);
       td_8.addEventListener("click",()=>{
        localStorage.setItem("type",localStorage.getItem("prodect"));
        localStorage.setItem("view",data[i].code);
        window.open("http://localhost/web_stor/product.html");
      })

      let status = document.createElement("status");
      status.classList.add("status" , "success");
      status.innerText = data[i].seller;

      let price = document.createElement("span");
      price.classList.add("price");
      price.innerText = data[i].price + "$";

      let profit = document.createElement("span");
      profit.classList.add("profit");
      let textprice = data[i].price;
      let numprice = Number(textprice);
      let profitnum = (numprice * 10) / 100;
      profit.innerText = profitnum + "$";

      //تركيب العناصر
     
      tr.appendChild(td_2);
      tr.appendChild(td_3);
      tr.appendChild(td_4);
      td_5.appendChild(status);
      tr.appendChild(td_5);
      td_6.appendChild(price);
      tr.appendChild(td_6);
      td_7.appendChild(profit);
      tr.appendChild(td_8);
      tr.appendChild(td_9);
      tr.appendChild(td_1);
      tr.appendChild(td_7);

       if(data[i].name == "0"){
        tr.style.display = "none";
      }
      
      let prodects = document.getElementById("prodects");
      prodects.appendChild(tr);
      let prodect_serch = document.getElementById("prodect_serch");
      let serch_btn = document.querySelector(".prodect_serch");
      serch_btn.addEventListener("click",()=>{
        if(data[i].name.includes(prodect_serch.value) === true || 
           data[i].type.includes(prodect_serch.value) === true){
          tr.style.display = "table-row";
        }else{tr.style.display = "none"; }
      })
      td_3.addEventListener("click",()=>{
        localStorage.setItem("type","edit");
        localStorage.setItem("code" , data[i].code);
        localStorage.setItem("seller",data[i].seller);
        localStorage.setItem("acount","admin")
        localStorage.setItem("user","admin");
        window.location = "add_prodect.html";
      })

      
}}}
xhr2.send();
};
let web_side = document.getElementById("web_side");
let web_them = document.getElementById("web_them");
let code_app = document.getElementById("code_app");
let appliction = document.getElementById("appliction");

web_side.addEventListener("click",()=>{
  
  let prodects = document.getElementById("prodects");
  prodects.innerHTML = "";
  API("web_side.json"); 
  localStorage.setItem("prodect" , "web_side.json");
  web_side.classList.add("li_active");
  web_them.classList.remove("li_active");
  code_app.classList.remove("li_active");
  appliction.classList.remove("li_active");
})
web_them.addEventListener("click",()=>{
  let prodects = document.getElementById("prodects");
  prodects.innerHTML = "";
  API("web_them.json");
  localStorage.setItem("prodect" , "web_them.json");
  web_side.classList.remove("li_active");
  web_them.classList.add("li_active");
  code_app.classList.remove("li_active");
  appliction.classList.remove("li_active");
})
code_app.addEventListener("click",()=>{
  let prodects = document.getElementById("prodects");
  prodects.innerHTML = "";
  API("app_code.json");
  localStorage.setItem("prodect" , "app_code.json");
  web_side.classList.remove("li_active");
  web_them.classList.remove("li_active");
  code_app.classList.add("li_active");
  appliction.classList.remove("li_active");
})
appliction.addEventListener("click",()=>{
  let prodects = document.getElementById("prodects");
  prodects.innerHTML = "";
  API("appliction.json");
   localStorage.setItem("prodect" , "appliction.json");
  web_side.classList.remove("li_active");
  web_them.classList.remove("li_active");
  code_app.classList.remove("li_active");
  appliction.classList.add("li_active");
})

//البائعين
const xhr3 = new XMLHttpRequest();
xhr3.open("GET", `php/json/sales.json?v=${Date.now()}`, true);
xhr3.onload = function() {
  if (xhr3.status === 200) {
    const data = JSON.parse(xhr3.responseText);
  for (let i = 0; i < data.length; i++) {
  let sales_tbody = document.getElementById("sales_tbody");
  let tr = document.createElement("tr");
  let name = document.createElement("td");
  name.innerText = data[i].name;
   
  let code = document.createElement("td");
  code.innerText = data[i].code;
  
  if(data[i].code == "000000"){
    let Profits_total = document.getElementById("Profits")
    let total = (parseFloat(Profits_total.textContent) || 0) + parseFloat(data[i].wallet);
    Profits_total.innerText = total + "$";
    tr.style.display = "none"; 
  }
  let wallet = document.createElement("td");
  wallet.innerText = data[i].wallet + "$";

  let mail = document.createElement("td");
  mail.innerText = data[i].email;

  let pho = document.createElement("td");
  pho.innerText = data[i].phone;

  let file = document.createElement("td");
  let a_file = document.createElement("a");
  a_file.innerText = "تحميل ملف التحقق";
  a_file.href = "http://localhost/web_stor/php/uploads/" + data[i].id_seller;
  a_file.download = data[i].id_seller;
  file.appendChild(a_file);

  let act = document.createElement("td");
  act.innerText = data[i].activet;

  let accActive = document.createElement("td");
  let ActiveIcon = document.createElement("i");
  ActiveIcon.className = "fa-solid fa-shield";
  ActiveIcon.style.color = "blue";
  ActiveIcon.style.cursor = "pointer";
  accActive.appendChild(ActiveIcon);
   
  accActive.addEventListener("click",()=>{
       const act = {
         user: "active",
         code: data[i].code
        }
        const formData = new FormData();
        for(const key in act){
          formData.append(key,act[key]);
        }
        fetch("http://localhost/web_stor/php/seller_account.php",{
          method: "POST",
          body: formData
        }).then(response=> response.text())
        .then(result =>{
          alert(result);
        })
  })


  let DeletAcount = document.createElement("td");
  let IconDelet = document.createElement("i");
  IconDelet.className = "fa-solid fa-delete-left";
  IconDelet.style.color = "red";
  IconDelet.style.cursor = "pointer";
  DeletAcount.appendChild(IconDelet);
  DeletAcount.addEventListener("click",()=>{
           const del = {
         user: "delet",
         code: data[i].code
        }
        const formData = new FormData();
        for(const key in del){
          formData.append(key,del[key]);
        }
        fetch("http://localhost/web_stor/php/seller_account.php",{
          method: "POST",
          body: formData
        }).then(response=> response.text())
        .then(result =>{
          alert(result);
        })
  })
  


  tr.appendChild(name);
  tr.appendChild(code);
  tr.appendChild(wallet);
  tr.appendChild(mail);
  tr.appendChild(pho);
  tr.appendChild(file);
  tr.appendChild(act);
  tr.appendChild(DeletAcount);
  tr.appendChild(accActive);
  sales_tbody.appendChild(tr);
  //تفعيل مربع البحث
  let sales_btn = document.getElementById("sales_btn");
  let sales_serch = document.getElementById("sales_serch");
  sales_btn.addEventListener("click",()=>{
    if(data[i].name.includes(sales_serch.value) === true || data[i].code.includes(sales_serch.value) === true){
      tr.style.display = "table-row";
    }else{
      tr.style.display = "none";
    }
  })
  }}}
  xhr3.send();// تفعيل الاحصائيات
let Profits = document.getElementById("Profits");//الارباح
let Visits = document.getElementById("Visits");//الزيارات
let Sales = document.getElementById("Sales");//المبيعات
let AI = document.getElementById("AI");//الذكاء الصناعي

const xhr4 = new XMLHttpRequest();
xhr4.open("GET", `php/json/home.json?v=${Date.now()}`, true);
xhr4.onload = function() {
  if (xhr4.status === 200) {
    try {
      const data = JSON.parse(xhr4.responseText);
      // افتراض أن الملف هو مصفوفة أو كائن واحد — نتعامل مع الحالتين
      if (Array.isArray(data)) {
        if (data.length > 0) {
          Profits.innerText = data[0].profits + "$";
          Visits.innerText = data[0].visits;
          Sales.innerText = data[0].sales + "$";
          AI.innerText = data[0].ai_value + "$";
        }
      } else if (typeof data === 'object' && data !== null) {
        Profits.innerText = data.profits + "$";
        Visits.innerText = data.visits;
        Sales.innerText = data.sales + "$";
        AI.innerText = data.ai_value + "$";
      }
    } catch (e) {
      console.error("JSON parse error for home.json:", e);
    }
  } else {
    console.error("Failed to load home.json, status:", xhr4.status);
  }
};
xhr4.onerror = () => console.error("Network error while loading home.json");
xhr4.send();

// المبيعات
const xhr5 = new XMLHttpRequest();
xhr5.open("GET", `php/json/prodectSale.json?v=${Date.now()}`, true);
// ← هنا كان الخطأ: قبل حطيت xhr4.onload بدل xhr5.onload
xhr5.onload = function() {
  if (xhr5.status === 200) {
    try {
      const data = JSON.parse(xhr5.responseText);
      // افتراض أن data مصفوفة من السجلات
      if (!Array.isArray(data)) {
        console.warn("prodectSale.json ليس مصفوفة، تحقق من البنية:", data);
        return;
      }

      let prodect_sale = document.getElementById("prodect_sale");
      if (!prodect_sale) {
        console.error("العنصر #prodect_sale غير موجود في الصفحة");
        return;
      }

      // تنظيف الجدول قبل الإضافة (اختياري)
      // prodect_sale.innerHTML = "";

      for (let i = 0; i < data.length; i++){
        let tr2 = document.createElement("tr");

        let prodec = document.createElement("td");
        prodec.innerText = data[i].product_name || "";

        let selle = document.createElement("td");
        selle.innerText = data[i].seller_name || "";

        let customer_name = document.createElement("td");
        customer_name.innerText = data[i].customer_name || "";

        let customer_phone = document.createElement("td");
        customer_phone.innerText = data[i].customer_phone || "";

        let customer_email = document.createElement("td");
        customer_email.innerText = data[i].customer_email || "";

        let customer_address = document.createElement("td");
        customer_address.innerText = data[i].customer_address || "";

        let prodect_price = document.createElement("td");
        prodect_price.innerText = data[i].price || "";

        let profit = document.createElement("td");
        profit.innerText = data[i].profit || "";

        let created_at = document.createElement("td");
        created_at.innerText = data[i].created_at || "";

        let sales_type = document.createElement("td");
        if(data[i].type == "web_them"){
          sales_type.innerText = "قالب موقع";
        }else if(data[i].type == "web_side"){
          sales_type.innerText = "موقع الكتروني";
        }else if(data[i].type == "appliction"){
          sales_type.innerText = "ملكية تطبيق";
        }else if(data[i].type == "app_code"){
          sales_type.innerText = "كود تطبيق";
        }

        tr2.appendChild(prodec);
        tr2.appendChild(selle);
        tr2.appendChild(customer_name);
        tr2.appendChild(customer_phone);
        tr2.appendChild(customer_email);
        tr2.appendChild(customer_address);
        tr2.appendChild(prodect_price);
        tr2.appendChild(profit);
        tr2.appendChild(created_at);
        tr2.appendChild(sales_type);
        prodect_sale.appendChild(tr2);
        //تفعليل مربع البحث
        let sale_serch = document.getElementById("sale_serch");
        let sale_btnserch = document.querySelector(".sale_btnserch");
        sale_btnserch.addEventListener("click",()=>{
          if(data[i].created_at.includes(sale_serch.value) === true //بحث بالتاريخ
          || data[i].customer_name.includes(sale_serch.value) === true || //بحث بالاسم
          data[i].product_name.includes(sale_serch.value) === true || //بحث بالنوع
        data[i].seller_code.includes(sale_serch.value) === true/* بحث بكود البائع */ || 
      data[i].type.includes(sale_serch.value) === true/*بحث بالنوع */){
          tr2.style.display = "table-row";
        }else{
          tr2.style.display = "none";
        }
        })
      }
    } catch (e) {
      console.error("JSON parse error for prodectSale.json:", e);
    }
  } else {
    console.error("Failed to load prodectSale.json, status:", xhr5.status);
  }
};
xhr5.onerror = () => console.error("Network error while loading prodectSale.json");
xhr5.send();
//الطلبات let serves = document.getElementById("serves");
const xhr6 = new XMLHttpRequest();

xhr6.open("GET", `php/json/services.json?v=${Date.now()}`, true);

xhr6.onload = function() {
  if (xhr6.status === 200) {
    const data = JSON.parse(xhr6.responseText);

    for (let i = 0; i < data.length; i++) {

      let serves_tr = document.createElement("tr");

      let serves_type = document.createElement("td");
      serves_type.innerText = data[i].service_type;
      
      let serves_code = document.createElement("td");
      serves_code.innerText = data[i].code;

      let serves_name = document.createElement("td");
      serves_name.innerText = data[i].name;

      let serves_email = document.createElement("td");
      serves_email.innerText = data[i].email;

      let serves_phone = document.createElement("td");
      serves_phone.innerText = data[i].phone;

      let texterea = document.createElement("textarea");
      texterea.innerText = data[i].details;

      let serves_details = document.createElement("td");
      serves_details.appendChild(texterea);
      
      let icon_2 = document.createElement("i");
      icon_2.classList.add("fa-solid", "fa-trash");
      icon_2.style.color = "red";

      let serves_delet = document.createElement("td");
      serves_delet.appendChild(icon_2);
      if(data[i].service_type == "0"){
        serves_tr.style.display = "none";
      }
      serves_tr.appendChild(serves_type);
      serves_tr.appendChild(serves_code);
      serves_tr.appendChild(serves_name);
      serves_tr.appendChild(serves_email);
      serves_tr.appendChild(serves_phone);
      serves_tr.appendChild(serves_details);
      serves_tr.appendChild(serves_delet);

      serves.appendChild(serves_tr);

      // ---- حدث الحذف بعد التصحيح ----
      icon_2.addEventListener("click", () => {

        const payload = {      // <-- تم تغيير الاسم
          delet_code: data[i].code
        };

        const formData = new FormData();
        for (const key in payload) {
          formData.append(key, payload[key]);
        }

        fetch("http://localhost/web_stor/php/service.php", {
          method: "POST",
          body: formData
        })
        .then(response => response.text())
        .then(result => {
          console.log(result);
          window.alert(result);
          //location.reload();   // <-- تم التصحيح
        })
        .catch(error => {
          console.error("حدث خطأ", error);
        });
      });
    }
  }
};

xhr6.send();
//المستقلين
const xhr7 = new XMLHttpRequest();

xhr7.open("GET", `php/json/freelancers.json?v=${Date.now()}`, true);

xhr7.onload = function() {
  if (xhr7.status === 200) {
    const data = JSON.parse(xhr7.responseText);

    for (let i = 0; i < data.length; i++) {
    let tbody_freelanc = document.getElementById("freelanc");
    let tr_7 = document.createElement("tr");

   let freelans = document.createElement("td");
   freelans.innerText = data[i].name;

   let freelans_mail = document.createElement("td");
   freelans_mail.innerText = data[i].email;

   let freelans_phone = document.createElement("td");
   freelans_phone.innerText = data[i].phone;

   let freelans_type = document.createElement("td");
   freelans_type.innerText = data[i].type;

   let freelans_skills = document.createElement("td");
   freelans_skills.innerText = data[i].skills

   let freelans_experience = document.createElement("td");
   freelans_experience.innerText = data[i].experience_years;

   let freelans_address = document.createElement("td");
   freelans_address.innerText = data[i].address;

   let freelans_link = document.createElement("td");
   let linkedIn = document.createElement("a");
   linkedIn.innerText = "linked_in";
   linkedIn.href =  data[i].linkedin;
   freelans_link.appendChild(linkedIn);

   let freelanc_paypal = document.createElement("td");
   freelanc_paypal.innerText = data[i].paypal;

   let freelans_description = document.createElement("td");
   let description = document.createElement("textarea");
   description.innerText = data[i].description;
   freelans_description.appendChild(description);

   tr_7.appendChild(freelans);
   tr_7.appendChild(freelans_mail);
   tr_7.appendChild(freelans_phone);
   tr_7.appendChild(freelans_type);
   tr_7.appendChild(freelans_skills);
   tr_7.appendChild(freelans_experience);
   tr_7.appendChild(freelans_address);
   tr_7.appendChild(freelans_link);
   tr_7.appendChild(freelanc_paypal);
   tr_7.appendChild(freelans_description);
   tbody_freelanc.appendChild(tr_7);
   let freelanc_btn = document.getElementById("freelanc_btn");
   let freelanc_serch = document.getElementById("freelanc_serch");
   freelanc_btn.addEventListener("click",()=>{
    if(data[i].name.includes(freelanc_serch.value) === true || 
       data[i].type.includes(freelanc_serch.value) === true){
      tr_7.style.display = "table-row";
      
    }else{
      tr_7.style.display = "none";
    }
   })

}}}
xhr7.send();
//المدفوعات
const xhr8 = new XMLHttpRequest();

xhr8.open("GET", `php/json/payment.json?v=${Date.now()}`, true);

xhr8.onload = function() {
  if (xhr8.status === 200) {
    const data = JSON.parse(xhr8.responseText);

    for (let i = 0; i < data.length; i++) {
      let SellerName = document.createElement("td");
      SellerName.innerText = data[i].name;

      let SellerCode = document.createElement("td");
      SellerCode.innerText = data[i].code;

      let SellerWallet = document.createElement("td");
      SellerWallet.innerText = data[i].payment_method;

      let SellerEmail = document.createElement("td");
      SellerEmail.innerText = data[i].email;

      let SellerNumber = document.createElement("td");
      SellerNumber.innerText = data[i].phone_number;

      let SellerPayment = document.createElement("td");
      SellerPayment.innerText = data[i].payment_email;

      let PaymentDelet = document.createElement("td");
      let DeletIcon = document.createElement("i");
      DeletIcon.classList.add("fa-solid", "fa-trash");
      DeletIcon.style.color = "red";
      DeletIcon.style.cursor = "pointer";
      PaymentDelet.appendChild(DeletIcon);
      PaymentDelet.addEventListener("click",()=>{
        const payment_data = {
          SellerEdit : "delet",
          SellerCode : data[i].code
        }
         const PaymentForm = new FormData();
        for(const key in payment_data){
          PaymentForm.append(key,payment_data[key]);
        }
        fetch("http://localhost/web_stor/php/Profits.php",{
          method: "POST",
          body: PaymentForm
        })
        .then(response=> response.text())
        .then(result =>{
          window.alert(result);
          console.log(result);
          
        })
        .catch(error =>{
          console.error("حدث خطا",error);
        })
      })

      let tbody_payment = document.querySelector(".tbody_payment");
      let tbody_tr = document.createElement("tr");
      if(data[i].name == "0"){
        tbody_tr.style.display = "none";
      }
      tbody_tr.appendChild(SellerName);
      tbody_tr.appendChild(SellerCode);
      tbody_tr.appendChild(SellerWallet);
      tbody_tr.appendChild(SellerPayment);
      tbody_tr.appendChild(SellerNumber);
      tbody_tr.appendChild(SellerEmail);
      tbody_tr.appendChild(PaymentDelet);
      tbody_payment.appendChild(tbody_tr);


}}}
xhr8.send();
//تسجيل الخروج
let log_out = document.querySelector(".log_out");
log_out.addEventListener("click",()=>{
localStorage.clear();
window.close();
})
//تقرير المبيعات\
let sheet_btn = document.querySelector(".sheet_btn");
sheet_btn.addEventListener("click", () => {

    // مسار الملف JSON
    let url = "http://localhost/web_stor/php/json/prodectSale.json";

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {

            // تحويل JSON إلى Sheet
            let worksheet = XLSX.utils.json_to_sheet(jsonData);

            // إنشاء ملف Excel
            let workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

            // تحميل الملف
            XLSX.writeFile(workbook, "prodectSale.xlsx");
        })
        .catch(error => console.log("Error: ", error));
});