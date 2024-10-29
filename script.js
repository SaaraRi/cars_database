'use strict';

const addCarForm = document.querySelector('#addCarForm');
const searchCarForm = document.querySelector('#searchCarForm');
const cars = [];

class Car {
    constructor (maker, model, year, color, owner, license, price, dateAdded) {
        this.maker = maker;
        this.model = model;
        this.year = parseInt(year);
        this.color = color;
        this.owner = owner;
        this.license = license;
        this.price = parseFloat(price);
        this.dateAdded = dateAdded;
    }

    calcCarAge() {
        const currentYear = new Date().getFullYear();
        return currentYear - this.year;
    }

    calcDiscountPrice() {
        return this.calcCarAge() > 10 ? this.price * 0.85 : this.price;
    }

    isEligibleForDiscount() {
        return this.calcCarAge() > 10;
    }
};

const displayMessage = (message, type = 'success') => {
    const messageElement = document.querySelector('#message');
    messageElement.textContent = message;
    messageElement.className = type;
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = '';
    }, 3000);
};

const addCar = (event) => {
    event.preventDefault();

    try {
        const makerInput = document.querySelector('#maker').value.trim();
        const maker = makerInput.charAt(0).toUpperCase() + makerInput.slice(1);
        const modelInput = document.querySelector('#model').value.trim();
        const model = modelInput.charAt(0).toUpperCase() + modelInput.slice(1);
        const year = parseInt(document.querySelector('#year').value.trim());
        const color = document.querySelector('#color').value.trim();
        const ownerInput = document.querySelector('#owner').value.trim();
        const ownerArray = ownerInput.split(' ');
        const ownerCapitalized = ownerArray.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()});
        const owner = ownerCapitalized.join(' '); 
        const licenseInput = document.querySelector('#license').value.trim();
        const license = licenseInput.slice(0, 3).toUpperCase()+ licenseInput.slice(3);
        const price = parseFloat(document.querySelector('#price').value.trim());
        const currentYear = new Date().getFullYear();
        const dateAdded = new Date().toLocaleDateString('fi');

        if (!maker || !model || !year || !color || !owner || !license || !price) {
            throw new Error('Please fill in all required fields.');
        }

        if (isNaN(price) || isNaN(year)) {
            throw new Error('Input must be in numbers.');
        }

        if (year < 1886 || year > currentYear) {
            throw new Error(`Year must be within the range 1886 - ${currentYear}.`);
        }

        if (price <= 0) {
            throw new Error('Price must be a positive number.');
        }

        const newCar = new Car(maker, model, year, color, owner, license, price, dateAdded);
        addCarForm.reset();
        cars.push(newCar);

        localStorage.setItem('cars', JSON.stringify(cars));

        displayCarsTable();
        displayMessage('Car added successfully!');

    } catch (error) {
        displayMessage(error.message, 'error'); 
    }
};

const loadCarsFromLocalStorage = () => {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
        const parsedCars = JSON.parse(storedCars);
        parsedCars.forEach(carFeature => {
            cars.push(new Car(carFeature.maker, carFeature.model, carFeature.year, carFeature.color, carFeature.owner, carFeature.license, carFeature.price, carFeature.dateAdded));
        });
        displayCarsTable();
    }
};

const displayCarsTable = () => {
    const table = document.querySelector('#carsTable');

    table.innerHTML = table.rows[0].innerHTML;

    cars.forEach((car, index) => {
        const row = table.insertRow(-1);

        const { maker, model, year, color, owner, license, price, dateAdded } = car;

        const carFeature = [maker, model, year, color, owner, license];

        carFeature.forEach(feature => {
        row.insertCell(-1).textContent = feature ?? 'N/A';
        });

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`;

        const discountPrice = car.isEligibleForDiscount()
            ? `${car.calcDiscountPrice().toFixed(2)}€`
            : 'Not eligible';
        row.insertCell(-1).textContent = discountPrice;

        row.insertCell(-1).textContent = dateAdded;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete car";
        deleteButton.classList.add("delete");
        deleteButton.addEventListener("click", () => deleteCar(index));
        row.insertCell(-1).appendChild(deleteButton);
   });
};

const deleteCar = (index) => {
    cars.splice(index, 1);
    localStorage.setItem('cars', JSON.stringify(cars));
    displayCarsTable();
    displayMessage("Car deleted successfully!");
};



const searchCar = (event) => {
    event.preventDefault();

    try {
    const searchInput = document.querySelector('#searchCar').value.trim();

    if (!searchInput) {
        throw new Error("Please fill in the required field in the form 'ABC-123'.")
    }
  
   const foundCar = cars.find((car) => 
    car.license.toLowerCase() === searchInput.toLowerCase());

   const searchResult = document.querySelector('#searchResult');

    if (foundCar) {
        const originalPrice = foundCar.price.toFixed(2);
        const discountPrice = foundCar.isEligibleForDiscount()
            ? `${foundCar.calcDiscountPrice().toFixed(2)}€`
            : 'No Discount';

        searchResult.innerHTML = `
            <p><strong>Car maker:</strong> ${foundCar.maker}</p>
            <p><strong>Car model:</strong> ${foundCar.model}</p>
            <p><strong>Year of manufacture:</strong> ${foundCar.year}</p>
            <p><strong>Car color:</strong> ${foundCar.color}</p>
            <p><strong>Current owner:</strong> ${foundCar.owner}</p>
            <p><strong>Original price:</strong> ${originalPrice}€</p>
            <p><strong>Discounted price:</strong> ${discountPrice}</p>
            <p><strong>Date added:</strong> ${foundCar.dateAdded}</p>
        `;
    } else {
        searchResult.innerHTML = '<p>No car found with the given license number.</p>';
    };
    } catch (error) {
        displayMessage(error.message, 'error');
    };
};


addCarForm.addEventListener('submit', addCar);
searchCarForm.addEventListener('submit', searchCar);
window.addEventListener('load', loadCarsFromLocalStorage);









 