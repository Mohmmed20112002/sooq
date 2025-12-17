let userimage   = document.getElementsByName("image");//الصوره
let username    = document.getElementsByName("name");
let useremail   = document.getElementsByName("email");
let userphone   = document.getElementsByName("phone");
let usertype    = document.getElementsByName("user_type");
let useraddress = document.getElementsByName("address");//العنوان
let useryear    = document.getElementsByName("year");//عدد سنوات الخبره
let userskales  = document.getElementsByName("skales");//المهارات
let linked_in   = document.getElementsByName("linked_in");
let userpaypale = document.getElementsByName("paypale"); // خليته زي كودك
let userabout   = document.getElementsByName("about");
let image_freelanser = document.getElementById("image_freelanser");
let btn         = document.getElementById("btn_submit");
let name_2      = document.querySelector(".name");
let Field       = document.querySelector(".Field");
// دالة مساعدة لِجلب قيمة من match أو إرجاع سلسلة فارغة لو مش موجود
function getMatchValue(result, regex){
  const m = result.match(regex);
  return m ? m[1] : "";
}

window.onload = function() {
  const dataform = new FormData();
  dataform.append("email", localStorage.getItem("email"));
  dataform.append("acount", localStorage.getItem("acount"));
  dataform.append("action", "call");

  fetch("http://localhost/web_stor/php/freelanser.php", {
        method: "POST",
        body: dataform
    })
    .then(res => res.text())
    .then(result => {
        // اطبع النتيجة أولًا علشان تتأكد إنها وصلت
        console.log("raw result from server:", result);

        // استخرج القيم باستخدام المجموعة الأولى [1]
        const name  = getMatchValue(result, /name:([^;]+)/);
        const code  = getMatchValue(result, /code:([^;]+)/);
        const type  = getMatchValue(result, /type:([^;]+)/);
        const phone = getMatchValue(result, /phone:([^;]+)/);
        const linke = getMatchValue(result, /linkedin:([^;]+)/);
        const image = getMatchValue(result, /image:([^;]+)/);
        const des   = getMatchValue(result, /description:([^;]+)/);
        const paypal= getMatchValue(result, /paypal:([^;]+)/);
        const address = getMatchValue(result, /address:([^;]+)/);
        const skilss =  getMatchValue(result, /skilss:([^;]+)/);
        const experience_years =  getMatchValue(result, /experience_years:([^;]+)/);
        // ملحوظة: لو أي عنصر DOM مش موجود هنتجنّب الخطأ
        try {
          if (image && document.getElementById("image_freelanser")) {
            document.getElementById("image_freelanser").src = image;
          }
          if (username.length && name) username[0].value = name;
          if (useremail.length) useremail[0].value = localStorage.getItem("email") || "";
          if (userphone.length && phone) userphone[0].value = phone;
          if (usertype.length && type) usertype[0].value = type;
          if (linked_in.length && linke) linked_in[0].value = linke;
          if (userabout.length && des) userabout[0].value = des;
          if (userpaypale.length && paypal) userpaypale[0].value = paypal;
          if (useraddress.length && address) useraddress[0].value = address;
          if (userskales.length && skilss) userskales[0].value = skilss;
          if (useryear.length && experience_years) useryear[0].value = experience_years ;
          image_freelanser.src =  "http://localhost/web_stor/php/" + image;
          name_2.innerText = " الاسم: " + name;
          Field.innerText = type +  "  "+":المجال" ;
          localStorage.setItem("code",code);
        } catch (e) {
          console.error("DOM assignment error:", e);
        }
    })
    .catch(err => {
        console.log("حدث خطأ في fetch (call):", err);
    }); 
}

if(btn){
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // لو الزر داخل فورم يمنع إعادة تحميل الصفحة

    const formData = new FormData();

    // الصورة — تأكد وجود ملف قبل الإضافة
    if (userimage.length && userimage[0].files && userimage[0].files[0]) {
      formData.append("image", userimage[0].files[0]);
    }

    // باقي الحقول (تحقّق من وجودها قبل الإضافة)
    if (username.length) formData.append("name", username[0].value);//الاسم
    if (useremail.length) formData.append("email", useremail[0].value);//الايميل
    if (userphone.length) formData.append("phone", userphone[0].value);//رقم التلفون
    if (usertype.length) formData.append("user_type", usertype[0].value);// المجال
    if (useraddress.length) formData.append("address", useraddress[0].value);//العنوان
    if (useryear.length) formData.append("year", useryear[0].value);//عدد سنوات الخبره
    if (userskales.length) formData.append("skales", userskales[0].value);//المهارات
    if (linked_in.length) formData.append("linked_in", linked_in[0].value);//رابط حساب linked in
    if (userpaypale.length) formData.append("paypale", userpaypale[0].value);//رابط حساب الدفع
    if (userabout.length) formData.append("about", userabout[0].value);//الوصف

    formData.append("action","edit");
    formData.append("acount", localStorage.getItem("acount"));
    

    fetch("http://localhost/web_stor/php/freelanser.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(result => {
      if(result.includes("تنفيذ") === true){
        alert("تم حفظ بياناتك بنجاح")
      }
    })
    .catch(err => {
        console.log("حدث خطأ في fetch (edit):", err);
    });

  });
} else {
  console.warn("زر الإرسال btn_submit مش لَقِيتَه في الصفحة.");
}
