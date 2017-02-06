const apiUrlPath = 'https://bstavroulakis.com/pluralsight/courses/progressive-web-apps/service/';
const apiUrlLatest = apiUrlPath + 'latest-deals.php';
const apiUrlCar = apiUrlPath + 'car.php?carId=';

Polymer({

  is: 'polymer-car-deals',

  properties: {
    carList: {
      type: Array,
      value: [],
      notify: true,
      readOnly: false,
      observer: '_carListChanged',
    },
    isContentLoaded: {
      type: Boolean,
      value: false,
      notify: true,
      reflectToAttribute: true,
      readOnly: false,
    }
  },

  _carListChanged(newValue, oldValue) {
    console.log('newValue', newValue.length)
    setTimeout(() => {
      this.isContentLoaded = (newValue.length)
    }, 500)
  },

  ready: function() {
    console.log('Ready!')

    carService.fetchPromise()
    .then((status) => {
      document.getElementById("connection-status").innerHTML = status;
      this.loadMore();
    })
  },

  generateCarCard(car) {
    let template = document.querySelector('#car-card').innerHTML;
    let title = car.brand + ' ' + car.model + ' ' + car.year;
    template = template.replace('{{title}}', title);
    template = template.replace('{{details-id}}', car.details_id);
    template = template.replace('{{image}}', car.image);
    template = template.replace('{{price}}', car.price);
    return template;
  },

  reload() {
    location.reload();
  },

  loadCarPage(e) {
    const parentEl = e.target.offsetParent;
    const carId = this.carList[parentEl.getAttribute('data-index')].details_id;
    fetch(apiUrlCar + carId)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      //console.log('CAR DATA', data)
      this.insertAdjacentHTML('beforeend', data);
    })
    .catch(() => {
      alert("Oops, can't retrieve page");
    })
  },

  loadMore() {
    console.log('getting cars');
    clientStorage.getCars().then((cars) => {
      console.log(this.carList, cars)
      this.carList = this.carList.concat(cars);
    })
  },

  loadMoreRequest() {
    carService.fetchPromise()
    .then((status) => {
      document.getElementById("connection-status").innerHTML = status;
      this.loadMore();
    })
  },

});
