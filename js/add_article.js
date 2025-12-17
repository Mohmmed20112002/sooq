
//في حالة التعديلات 
if(localStorage.getItem("artical") == "edit"){
  let form = document.getElementById("form");
  form.action = "php/edit_artical.php";
  let titel = document.getElementById("titel");
  let sub_title = document.getElementById("sub_title");
  let reset = document.getElementById("reset");
  reset.style.display = "none";
  submit = document.getElementById("submit");
  submit.innerText = "حفظ التعديل";
  titel.innerText = "تعديل المقال";
  sub_title.innerText = "قم بالتعديل علي بيانات النموذج التالي ";
  let article_title = document.getElementsByName("article_title");
  let subtitle = document.getElementsByName("subtitle");
  let article_link = document.getElementsByName("article_link");
  const xhr1 = new XMLHttpRequest();
xhr1.open("GET", "php/json/artical.json", true);

xhr1.onload = function () {
  if (xhr1.status === 200) {
    const data = JSON.parse(xhr1.responseText);
    for (let i = 0; i < data.length; i++) {
    if(localStorage.getItem("art_type") == data[i].main_title){ 
    article_title[0].value = data[i].main_title;
    article_title[0].readOnly = true;
    subtitle[0].value = data[i].sub_title;
    article_link[0].value = data[i].article_link;
  }
  }}}
  xhr1.send();
}