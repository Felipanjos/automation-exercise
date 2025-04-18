import { Page } from "@playwright/test";
import { Navigation } from "./Navigation";
import { Home } from "./Home";
import { Sign } from "./Sign";
import { Header } from "./Header";
import { Contact } from "./Contact";

export class PageManager {
  private readonly page: Page;
  private readonly navigation: Navigation;
  private readonly home: Home;
  private readonly sign: Sign;
  private readonly header: Header;
  private readonly contact: Contact;

  constructor(page: Page) {
    this.page = page;
    this.home = new Home(this.page);
    this.sign = new Sign(this.page);
    this.header = new Header(this.page);
    this.navigation = new Navigation(this.page);
    this.contact = new Contact(this.page);
  }

  goto() {
    return this.navigation;
  }

  onHome() {
    return this.home;
  }

  onSign() {
    return this.sign;
  }

  onHeader() {
    return this.header;
  }

  onContact() {
    return this.contact;
  }

  getStarterPageBundle() {
    return {homePage: this.home, signPage: this.sign, header: this.header}
  }

}