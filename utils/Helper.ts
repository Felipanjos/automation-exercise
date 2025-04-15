export class Helper {
  static getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static getEnvVar(name: string): string {
    const value = process.env[name.toUpperCase()];
    if (!value) throw new Error(`Missing env var: ${name}`);
    return value;
  }
}

// const randomBrand = responseBody.brands[Helper.getRandomItem(responseBody.brands.length)];
