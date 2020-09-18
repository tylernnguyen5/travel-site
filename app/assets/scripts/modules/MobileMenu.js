class MobileMenu {
  // Initiate
  constructor() {
    this.menuIcon = document.querySelector('.site-header__menu-icon');
    this.menuContent = document.querySelector('.site-header__menu-content');
    this.siteHeader = document.querySelector('.site-header');

    this.events();
  }

  // Events
  events() {
    this.menuIcon.addEventListener('click', () => this.toggleMenuIcon());
  }

  // Methods
  toggleMenuIcon() {
    this.menuContent.classList.toggle("site-header__menu-content--is-visble");
    this.siteHeader.classList.toggle("site-header--is-expanded");
    this.menuIcon.classList.toggle("site-header__menu-icon--close-x");
  }
}

export default MobileMenu