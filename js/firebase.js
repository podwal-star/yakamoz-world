const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_AUTH_DOMAIN",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_STORAGE_BUCKET",
  messagingSenderId: "ВАШ_MESSAGING_ID",
  appId: "ВАШ_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const ref = db.collection("birthdays");

const monthsArr = ["Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function isValidDate(dateStr){
  const match = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if(!match) return false;
  const d = parseInt(match[1]), m = parseInt(match[2]), y = parseInt(match[3]);
  const date = new Date(y,m-1,d);
  return date.getFullYear()===y && date.getMonth()===m-1 && date.getDate()===d;
}

function addBirthday(){
  const code = document.getElementById("adminCode").value.trim();
  if(code !== "Yakamoz"){ alert("Неверный код!"); return; }

  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value.trim();
  if(!name){ alert("Введите имя"); return; }
  if(!isValidDate(date)){ alert("Неверный формат даты"); return; }

  const month = parseInt(date.slice(3,5)) - 1;
  ref.add({name, date, month})
     .then(()=>{ document.getElementById("name").value=""; document.getElementById("date").value=""; render(); })
     .catch(err=>alert(err));
}

function render(){
  const monthsDiv = document.getElementById("months");
  if(!monthsDiv) return;
  monthsDiv.innerHTML = "";
  ref.get().then(snapshot=>{
    const data = {};
    monthsArr.forEach(m=>data[m]=[]);
    snapshot.forEach(doc=>{
      const d=doc.data();
      const id = doc.id;
      data[monthsArr[d.month]].push({name: d.name, date: d.date, id});
    });
    monthsArr.forEach(m=>{
      let html = `<div class="month"><h3>${m}</h3>`;
      if(data[m].length==0) html+="<i>Пусто</i>";
      else data[m].forEach(b=>{
        html+=`<div class="bday">${b.name} — ${b.date} <button onclick="deleteBirthday('${b.id}')">Удалить</button></div>`;
      });
      html+="</div>";
      monthsDiv.innerHTML+=html;
    });
  }).catch(err=>console.log(err));
}

function deleteBirthday(id){
  const code = prompt("Введите код для удаления");
  if(code !== "Yakamoz"){ alert("Неверный код!"); return; }
  ref.doc(id).delete().then(()=>render());
}
