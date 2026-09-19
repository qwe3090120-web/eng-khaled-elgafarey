const CMS_KEY = "khaledPortfolioContent";
const birthDate = new Date(2009, 0, 20);

const defaultContent = {
  heroEyebrow: "مرحبًا بك في موقعي الشخصي",
  heroText: "طالب في أكاديمية السويدي الفنية - قسم الإلكترونيات، شغوف بالإلكترونيات وتطوير تطبيقات الموبايل وتصميم مواقع الويب وبناء حلول تجمع بين البرمجة والهاردوير.",
  aboutTitle: "أبني مهاراتي بين البرمجة والإلكترونيات",
  aboutName: "Eng. Khaled Elgafarey",
  aboutText: "أنا خالد الجعفري، طالب في أكاديمية السويدي الفنية بقسم الإلكترونيات. أهتم بتطوير تطبيقات الهواتف الذكية، وإنشاء مواقع ويب حديثة، وبرمجة الأنظمة المدمجة مثل ESP32 وArduino، واستخدام تقنيات الذكاء الاصطناعي في حلول عملية ومفيدة.",
  educationSchool: "أكاديمية السويدي الفنية",
  educationDepartment: "قسم الإلكترونيات - طالب حاليًا",
  contactTitle: "جاهز للتعاون وتبادل الأفكار",
  projectTitle1: "BioSmart Drop",
  projectText1: "مشروع تقني يجمع بين البرمجة والتطبيق العملي.",
  projectTitle2: "تطبيقات Android",
  projectText2: "واجهات موبايل حديثة وتجارب استخدام منظمة.",
  projectTitle3: "ESP32 & Arduino",
  projectText3: "نماذج إلكترونية وأنظمة مدمجة قابلة للتطوير.",
  skills: [
    "Android",
    "Web Development",
    "HTML / CSS / JavaScript",
    "Flutter",
    "Python",
    "Arduino",
    "ESP32",
    "Electronics",
    "Artificial Intelligence",
    "UI / UX Design"
  ],
  goals: [
    "تطوير تطبيقات احترافية.",
    "إنشاء مواقع ويب عصرية.",
    "دمج الذكاء الاصطناعي مع الإلكترونيات.",
    "تنفيذ مشاريع تخدم المجتمع.",
    "التعلم المستمر ومواكبة أحدث التقنيات."
  ],
  email: "khaledkhaled010104740@email.com",
  phone: "+20 1010474002",
  facebook: "https://www.facebook.com/share/19GdoNNczA/",
  typingPhrases: [
    "Eng. Khaled Elgafarey",
    "مطور ويب وتطبيقات",
    "طالب إلكترونيات",
    "Arduino & ESP32 Maker"
  ],
  profileImage: "assets/khaled-profile.jpeg",
  projectImage1: "",
  projectImage2: "",
  projectImage3: ""
};

function getStoredContent() {
  try {
    const savedContent = JSON.parse(localStorage.getItem(CMS_KEY) || "{}");
    return {
      ...defaultContent,
      ...savedContent,
      profileImage: savedContent.profileImageRemoved ? "" : (savedContent.profileImage || defaultContent.profileImage)
    };
  } catch {
    return { ...defaultContent };
  }
}

let content = getStoredContent();

const loader = document.getElementById("loader");
const themeToggle = document.getElementById("themeToggle");
const typingName = document.getElementById("typingName");
const footerAge = document.getElementById("footerAge");

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => loader.classList.add("hide"), 700);
  }
});

const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  document.body.classList.add("light");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

function calculateAge(date) {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate());

  if (today < birthdayThisYear) {
    age -= 1;
  }

  return age;
}

function applyContent() {
  document.querySelectorAll("[data-cms-text]").forEach((element) => {
    const key = element.dataset.cmsText;
    if (content[key]) {
      element.textContent = content[key];
    }
  });

  document.querySelectorAll("[data-cms-bg]").forEach((element) => {
    const image = content[element.dataset.cmsBg];
    if (image) {
      element.style.backgroundImage = `url("${image}")`;
      element.classList.add("has-custom-image");
    } else {
      element.style.backgroundImage = "";
      element.classList.remove("has-custom-image");
    }
  });

  const skillsGrid = document.getElementById("skillsGrid");
  if (skillsGrid) {
    skillsGrid.innerHTML = content.skills.map((skill) => `<span>${skill}</span>`).join("");
  }

  const goalsList = document.getElementById("goalsList");
  if (goalsList) {
    goalsList.innerHTML = content.goals.map((goal) => `<div>${goal}</div>`).join("");
  }

  const emailLink = document.getElementById("emailLink");
  if (emailLink) {
    emailLink.textContent = content.email;
    emailLink.href = `mailto:${content.email}`;
  }

  const phoneLink = document.getElementById("phoneLink");
  if (phoneLink) {
    phoneLink.textContent = content.phone;
    phoneLink.href = `tel:${content.phone.replace(/\s/g, "")}`;
  }

  const facebookLink = document.getElementById("facebookLink");
  if (facebookLink) {
    facebookLink.href = content.facebook;
  }
}

function isFirebaseConfigured() {
  return Boolean(
    window.firebaseConfig &&
    window.firebaseConfig.apiKey &&
    !window.firebaseConfig.apiKey.includes("PUT_YOUR")
  );
}

function initFirebaseApp() {
  if (!isFirebaseConfigured() || !window.firebase?.firestore) {
    return false;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(window.firebaseConfig);
  }

  return true;
}

async function loadRealtimeContent() {
  if (!isFirebaseConfigured() || !window.firebase?.database) {
    return false;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }

    const path = window.firebaseContentPath || "portfolio/main";
    const snapshot = await firebase.database().ref(path).once("value");

    if (snapshot.exists()) {
      content = { ...content, ...snapshot.val() };
      return true;
    }
  } catch (error) {
    console.warn("Realtime Database content was not loaded:", error);
  }

  return false;
}

async function loadFirestoreContent() {
  if (!initFirebaseApp()) {
    return false;
  }

  try {
    const path = window.firestoreContentPath || "portfolio/main";
    const snapshot = await firebase.firestore().doc(path).get();

    if (snapshot.exists) {
      content = { ...content, ...snapshot.data() };
      return true;
    }
  } catch (error) {
    console.warn("Firestore content was not loaded:", error);
  }

  return false;
}

async function loadRemoteContent() {
  const realtimeLoaded = await loadRealtimeContent();
  if (!realtimeLoaded) {
    await loadFirestoreContent();
  }
}

function typeName() {
  if (!typingName) {
    return;
  }

  const phrases = content.typingPhrases.length ? content.typingPhrases : defaultContent.typingPhrases;
  let phraseIndex = 0;
  let index = 0;
  let deleting = false;

  function tick() {
    const text = phrases[phraseIndex];
    typingName.textContent = text.slice(0, index);

    if (!deleting && index < text.length) {
      index += 1;
      setTimeout(tick, 100);
      return;
    }

    if (!deleting && index === text.length) {
      deleting = true;
      setTimeout(tick, 2000);
      return;
    }

    if (deleting && index > 0) {
      index -= 1;
      setTimeout(tick, 50);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(tick, 250);
  }

  tick();
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.18 });

reveals.forEach((element) => observer.observe(element));

const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function runCounters() {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    const duration = target > 100 ? 1400 : 900;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target).toLocaleString("en-US");

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

const stats = document.querySelector(".stats");
if (stats) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      const age = calculateAge(birthDate);
      document.querySelector('[data-target="17"]').dataset.target = age;
      if (footerAge) {
        footerAge.textContent = age;
      }
      runCounters();
    }
  }, { threshold: 0.35 });

  statsObserver.observe(stats);
}

if (footerAge) {
  footerAge.textContent = calculateAge(birthDate);
}

applyContent();
typeName();
