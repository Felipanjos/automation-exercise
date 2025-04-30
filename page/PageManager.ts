import { Page } from '@playwright/test';
import { Navigation } from './Navigation';
import { Home } from './Home';
import { Header } from './Header';
import { Contact } from './Contact';
import { Product } from './Product';
import { LoginPage } from './LoginPage';
import { SignUpPage } from './SignUpPage';

export class PageManager {
  private readonly page: Page;
  private readonly navigation: Navigation;
  private readonly home: Home;
  private readonly signUpPage: SignUpPage;
  private readonly header: Header;
  private readonly contact: Contact;
  private readonly product: Product;
  private readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.home = new Home(this.page);
    this.signUpPage = new SignUpPage(this.page);
    this.header = new Header(this.page);
    this.navigation = new Navigation(this.page);
    this.contact = new Contact(this.page);
    this.loginPage = new LoginPage(this.page);
    this.product = new Product(this.page);
  }

  navigateTo() {
    return this.navigation;
  }

  onHome() {
    return this.home;
  }

  onSignUpPage() {
    return this.signUpPage;
  }

  onHeader() {
    return this.header;
  }

  onContact() {
    return this.contact;
  }

  onProduct() {
    return this.product;
  }

  onLoginPage() {
    return this.loginPage;
  }
}
