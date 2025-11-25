const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,flags,car,population,capital";

const countriesList = document.getElementById("countries-list");
const modal = document.getElementById("country-modal");
const modalCloseBtn = document.getElementById("modal-close");

const modalFlag = document.getElementById("modal-flag");
const modalName = document.getElementById("modal-name");
const modalCapital = document.getElementById("modal-capital");
const modalPopulation = document.getElementById("modal-population");
const modalCarSide = document.getElementById("modal-car-side");

// Aquí guardaremos todos los países para luego encontrar el que clicamos
let countriesData = [];

// Cuando el DOM está listo, cargamos los países
document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
});

async function loadCountries() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener los países");
    }

    const data = await response.json();
    countriesData = data;

    // Ordenar alfabéticamente por name.common
    countriesData.sort((a, b) => {
      const nameA = a.name.common.toUpperCase();
      const nameB = b.name.common.toUpperCase();
      return nameA.localeCompare(nameB);
    });

    renderCountries(countriesData);
  } catch (error) {
    console.error("Ha ocurrido un error:", error);
  }
}

function renderCountries(countries) {
  countriesList.innerHTML = "";

  countries.forEach((country) => {
    const card = document.createElement("div");
    card.classList.add("country-card");
    // Guardamos el nombre para encontrar el país luego
    card.setAttribute("data-country-name", country.name.common);

    const img = document.createElement("img");
    img.src = country.flags.png || country.flags.svg;
    img.alt = `Bandera de ${country.name.common}`;

    const name = document.createElement("span");
    name.textContent = country.name.common;

    card.appendChild(img);
    card.appendChild(name);
    countriesList.appendChild(card);
  });
}

// Delegación de eventos para detectar clics en cualquier tarjeta
countriesList.addEventListener("click", (event) => {
  const card = event.target.closest(".country-card");
  if (!card) return;

  const countryName = card.getAttribute("data-country-name");

  const selectedCountry = countriesData.find(
    (country) => country.name.common === countryName
  );

  if (selectedCountry) {
    openModal(selectedCountry);
  }
});

function openModal(country) {
  const { name, flags, capital, population, car } = country;

  modalFlag.src = flags.png || flags.svg;
  modalFlag.alt = `Bandera de ${name.common}`;
  modalName.textContent = name.common;

  modalCapital.textContent = capital ? capital[0] : "Sin capital";

  modalPopulation.textContent = population.toLocaleString("es-ES");

  let sideText = "Desconocido";
  if (car && car.side) {
    sideText = car.side === "left" ? "izquierda" : "derecha";
  }
  modalCarSide.textContent = sideText;

  modal.classList.remove("hidden");
}

// Cerrar modal con botón
modalCloseBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Cerrar haciendo clic fuera del contenido
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});
