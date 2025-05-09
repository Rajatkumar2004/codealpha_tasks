const translations = {
    en: {
      title: "Age Calculator",
      selectLang: "Select Language:",
      dayPlaceholder: "Day (1-31)",
      monthPlaceholder: "Month (1-12)",
      yearPlaceholder: "Year (e.g. 2000)",
      calculateBtn: "Calculate",
      initialMessage: "Let's discover your age!",
      resultMessage: "You are {years} years, {months} months, and {days} days old.",
      errorMessages: {
        dayRange: "Day must be between 1 and 31.",
        monthRange: "Month must be between 1 and 12.",
        yearRange: "Year must be between 1900 and the current year.",
        futureDate: "Birth date can't be in the future.",
      },
    },
    // Translations for other languages (e.g., Spanish, French, German) can be added similarly
  };
  
  let currentLanguage = "en";
  
  function changeLanguage() {
    const language = document.getElementById("languageSelect").value;
    currentLanguage = language;
    updateTextContent();
  }
  
  function updateTextContent() {
    const lang = translations[currentLanguage];
    document.getElementById("calculatorTitle").innerText = lang.title;
    document.getElementById("languageLabel").innerText = lang.selectLang;
    document.getElementById("day").placeholder = lang.dayPlaceholder;
    document.getElementById("month").placeholder = lang.monthPlaceholder;
    document.getElementById("year").placeholder = lang.yearPlaceholder;
    document.getElementById("calculateBtn").innerText = lang.calculateBtn;
    document.getElementById("initialMessage").innerText = lang.initialMessage;
  }
  
  function validateInputs() {
    const day = parseInt(document.getElementById("day").value);
    const month = parseInt(document.getElementById("month").value);
    const year = parseInt(document.getElementById("year").value);
    const currentDate = new Date();
  
    if (day < 1 || day > 31) {
      showError(translations[currentLanguage].errorMessages.dayRange);
      return false;
    }
    if (month < 1 || month > 12) {
      showError(translations[currentLanguage].errorMessages.monthRange);
      return false;
    }
    if (year < 1900 || year > currentDate.getFullYear()) {
      showError(translations[currentLanguage].errorMessages.yearRange);
      return false;
    }
  
    const birthDate = new Date(year, month - 1, day);
    if (birthDate > currentDate) {
      showError(translations[currentLanguage].errorMessages.futureDate);
      return false;
    }
  
    return { day, month, year };
  }
  
  function showError(message) {
    alert(message);
  }
  
  function calculateAge() {
    const birthDate = validateInputs();
    if (!birthDate) return;
  
    const currentDate = new Date();
    const ageInMilliseconds = currentDate - new Date(birthDate.year, birthDate.month - 1, birthDate.day);
  
    const ageDate = new Date(ageInMilliseconds);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
  
    const resultMessage = translations[currentLanguage].resultMessage.replace("{years}", years)
      .replace("{months}", months)
      .replace("{days}", days);
  
    document.getElementById("result").innerHTML = resultMessage;
    document.getElementById("result").style.opacity = 1;
    document.getElementById("result").style.transform = "translateY(0)";
  }
  
  updateTextContent();
  