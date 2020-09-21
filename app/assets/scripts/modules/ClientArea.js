import Axios from 'axios';

class ClientArea {
  // Inititate
  constructor() {
    this.injectHTML();
    this.form = document.querySelector('.client-area__form');
    this.field = document.querySelector('.client-area__input');
    this.contentArea = document.querySelector('.client-area__content-area');

    this.events();
  }


  // Events
  events() {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.sendRequest();
    })
  }


  // Methods
  injectHTML() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="client-area">
        <div class="wrapper wrapper--medium">
          <h2 class="section-title section-title--blue">Secret Client Area</h2>
          <form class="client-area__form" action="">
            <input class="client-area__input" type="text" placeholder="Enter the secret phrase">
            <button class="btn btn--orange">Submit</button>
          </form>
          
          <div class="client-area__content-area"></div>
        </div>
      </div>
    `)
  }

  sendRequest() {
    Axios.post('https://sad-jones-cae779.netlify.app/.netlify/functions/secret-area', {password: this.field.value}).then(response => {
      this.form.remove();
      this.contentArea = response.data;
    }).catch(() => {
      this.contentArea.innerHTML = `<p class="client-area__error" >The secret phrase is incorrect. Please try again.</p>`;
      this.field.value = '';
      this.field.focus();
    });
  }
}

export default ClientArea;