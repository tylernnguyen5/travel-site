import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

class StickyHeader {
  // Initiate
  constructor() {
    this.siteHeader = document.querySelector('.site-header');
    this.pageSections = document.querySelectorAll('.page-section');
    this.browserHeight = window.innerHeight;
    this.previousScrollY = window.scrollY;

    this.events();
  }


  // Events
  events() {
    window.addEventListener('scroll', throttle(() => this.runOnScroll(), 200));

    window.addEventListener('resize', debounce(() => {
      this.browserHeight = window.innerHeight;
    }, 333))
  }


  // Methods
  runOnScroll() {
    this.determindScrollDirection();

    if (window.scrollY > 60) {
      this.siteHeader.classList.add('site-header--dark');
    } else {
      this.siteHeader.classList.remove('site-header--dark');
    }

    this.pageSections.forEach(el => this.calcSection(el));
  }

  determindScrollDirection() {
    if (window.scrollY > this.previousScrollY) {
      this.scrollDirection = 'down';
    } else {
      this.scrollDirection = 'up';
    }

    this.previousScrollY = window.scrollY
  }

  calcSection(el) {   // Highlight current link in nav bar according to the content the user is viewing
    if (window.scrollY + this.browserHeight > el.offsetTop    // Passes the top edge of the element
      && window.scrollY < el.offsetTop + el.offsetHeight) {   // And have NOT passed the bottom edge of the element

      let scrollPercent = el.getBoundingClientRect().y / this.browserHeight * 100;    // To determine how far from the element the user has scrolled in order to highlight a certain link

      if (scrollPercent < 18 && scrollPercent > -0.1 && this.scrollDirection == 'down' 
        || scrollPercent < 33 && this.scrollDirection == 'up') {

        let matchingLink = el.getAttribute("data-matching-link");

        document.querySelectorAll(`.primary-nav a:not(${matchingLink})`).forEach(el => el.classList.remove("is-current-link"));

        document.querySelector(matchingLink).classList.add("is-current-link");
      }
    }
  }
}

export default StickyHeader