let userNameArr = [];

let userPhoto = [];

let userDesignation = [];

let parentDiv = document.querySelector('.parent-div');

let userCompany = [];
let lat = [];

let lng = [];

let APP_ID = process.env.APP_ID;

let CLIENT_SECRET = process.env.CLIENT_SECRET;

let ACCESS_TOKEN = process.env.ACCESS_TOKEN;

let searchBox = document.querySelector('#mySearch');

const search = instantsearch({
  indexName: 'user_info',
  searchClient: algoliasearch(`${APP_ID}`, `${CLIENT_SECRET}`),
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.hits({
    container: document.querySelector('.data-div'),
    templates: {
      item: function (data) {
        userNameArr.push(data.fullName);

        userPhoto.push(data.photo);

        userDesignation.push(data.designation);

        lat.push(data['location.lat']);

        userCompany.push(data.companyName);

        lng.push(data['location.lng']);

        if (lng.length > 999) {
          setTimeout(createDiv, 1000);
        }
      },
    },
  }),
]);

search.start();

function createDiv() {
  for (let i = 0; i < userNameArr.length; i++) {
    let mainDiv = document.createElement('div');

    mainDiv.userName = `mainDiv${i}`;

    let infoDiv = document.createElement('div');

    infoDiv.userName = `infoDiv${i}`;

    let image = document.createElement('img');

    image.userName = `image${i}`;

    let userName = document.createElement('h2');

    userName.userName = `userName${i}`;

    let userField = document.createElement('span');

    userField.userName = `userField${i}`;

    mainDiv.className = `popup${i}`;

    mainDiv.classList.add('popup');

    image.className = `img${i}`;

    image.classList.add('img');

    infoDiv.className = `info${i}`;

    userName.className = `userName${i}`;

    userName.classList.add('heading');

    userName.innerHTML = userNameArr[i];

    infoDiv.appendChild(userName);

    infoDiv.appendChild(userField);

    mainDiv.appendChild(image);

    mainDiv.appendChild(infoDiv);

    parentDiv.appendChild(mainDiv);

    if (userDesignation[i].length !== 0) {
      userField.innerHTML = userDesignation[i];
    }

    if (userPhoto[i].length !== 0) {
      document.querySelector(`.img${i}`).src = userPhoto[i];
    }

    if (i > '998') {
      setTimeout(setPopup, 1000);
    }
  }
}

let arr = [];

mapboxgl.accessToken = `${ACCESS_TOKEN}`;

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.5, 40],
  zoom: 1,
});

function setPopup() {
  let fakearr = [];

  for (let i = 0; i < userNameArr.length; i++) {
    arr[i] = document.querySelector(`.popup${i}`);

    if (lat.length == 0 && lng.length == 0) {
      return;
    } else {
      fakearr[i] = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
        .setLngLat([lng[i], lat[i]])
        .setDOMContent(arr[i])
        .setMaxWidth('200px')
        .addTo(map);
    }
  }
}

map.on('style.load', () => {
  map.addControl(new mapboxgl.NavigationControl());
});

searchBox.addEventListener('keyup', () => {
  let value = searchBox.value;

  for (let i = 0; i < userNameArr.length; i++) {
    let name = document.querySelector(`.userName${i}`).innerHTML;

    name = name.toLowerCase();

    if (name.indexOf(`${value}`) == -1) {
      let childDiv = document.querySelector(`.popup${i}`);

      let parentDiv = childDiv.parentNode;

      let content = parentDiv.closest('.mapboxgl-popup');

      content.style.display = 'none';
    }

    if (value.length == 0) {
      for (let i = 0; i <= 10; i++) {
        let childDiv = document.querySelector(`.popup${i}`);

        let parentDiv = childDiv.parentNode;

        let content = parentDiv.closest('.mapboxgl-popup');

        content.style.display = 'flex';
      }
    }
  }
});

searchBox.addEventListener('keydown', (event) => {
  let key = event.keyCode || event.charCode || event.which;

  if (key == 8 || key == 46) {
    let value = searchBox.value;

    value = value.slice(0, -1);

    for (let i = 0; i < userNameArr.length; i++) {
      let name = document.querySelector(`.userName${i}`).innerHTML;

      name = name.toLowerCase();

      if (name.indexOf(`${value}`) > -1) {
        let childDiv = document.querySelector(`.popup${i}`);

        let parentDiv = childDiv.parentNode;

        let content = parentDiv.closest('.mapboxgl-popup');

        content.style.display = 'flex';
      }
    }
  }
});
