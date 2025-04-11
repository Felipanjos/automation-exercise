export class Helper {
  static getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// const randomBrand = responseBody.brands[Helper.getRandomItem(responseBody.brands.length)];
