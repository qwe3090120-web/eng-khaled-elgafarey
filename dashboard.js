const CMS_KEY = "khaledPortfolioContent";

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
  profileImage: "",
  projectImage1: "",
  projectImage2: "",
  projectImage3: ""
};

const form = document.getElementById("dashboardForm");
const saveButton = document.getElementById("saveDashboard");
const resetButton = document.getElementById("resetDashboard");
const saveStatus = document.getElementById("saveStatus");
const themeToggle = document.getElementById("themeToggle");
const passwordGate = document.getElementById("passwordGate");
const passwordForm = document.getElementById("passwordForm");
const dashboardPassword = document.getElementById("dashboardPassword");
const passwordError = document.getElementById("passwordError");
const DASHBOARD_PASSWORD = "qweQWE123@#$";
const SESSION_KEY = "khaledDashboardUnlocked";

document.body.classList.add("dashboard-locked");

const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  document.body.classList.add("light");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});

function unlockDashboard() {
  passwordGate.classList.add("unlocked");
  document.body.classList.remove("dashboard-locked");
  sessionStorage.setItem(SESSION_KEY, "true");
}

if (sessionStorage.getItem(SESSION_KEY) === "true") {
  unlockDashboard();
}

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (dashboardPassword.value === DASHBOARD_PASSWORD) {
    passwordError.textContent = "";
    unlockDashboard();
    return;
  }

  passwordError.textContent = "كلمة المرور غير صحيحة.";
  dashboardPassword.value = "";
  dashboardPassword.focus();
});

function getStoredContent() {
  try {
    return { ...defaultContent, ...JSON.parse(localStorage.getItem(CMS_KEY) || "{}") };
  } catch {
    return { ...defaultContent };
  }
}

let content = getStoredContent();

function listToText(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function textToList(value) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function setStatus(message) {
  saveStatus.textContent = message;
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 2600);
}

function fillForm() {
  Object.entries(content).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field || field.type === "file") {
      return;
    }

    field.value = Array.isArray(value) ? listToText(value) : value;
  });

  updatePreviews();
}

function updatePreviews() {
  document.querySelectorAll("[data-preview]").forEach((preview) => {
    const image = content[preview.dataset.preview];
    preview.style.backgroundImage = image ? `url("${image}")` : "";
    preview.classList.toggle("has-custom-image", Boolean(image));
    preview.textContent = image ? "" : "لا توجد صورة مختارة";
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function saveForm() {
  const nextContent = { ...content };
  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) {
        nextContent[key] = await readFileAsDataUrl(value);
      }
      continue;
    }

    if (["skills", "goals", "typingPhrases"].includes(key)) {
      nextContent[key] = textToList(value);
    } else {
      nextContent[key] = value.trim();
    }
  }

  content = nextContent;
  localStorage.setItem(CMS_KEY, JSON.stringify(content));
  updatePreviews();
  setStatus("تم حفظ التعديلات. افتح الصفحة الرئيسية لمشاهدة النتيجة.");
}

document.querySelectorAll('input[type="file"]').forEach((input) => {
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) {
      return;
    }

    content[input.name] = await readFileAsDataUrl(file);
    updatePreviews();
  });
});

saveButton.addEventListener("click", saveForm);

resetButton.addEventListener("click", () => {
  localStorage.removeItem(CMS_KEY);
  content = { ...defaultContent };
  form.reset();
  fillForm();
  setStatus("تم استرجاع البيانات الافتراضية.");
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.18 });

reveals.forEach((element) => observer.observe(element));
fillForm();
