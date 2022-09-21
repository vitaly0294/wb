'use strict';

// layout, style
const container = document.querySelector('.container');
const form = document.createElement('form');
const labelInputSearch = document.createElement('label');
const textSearch = document.createElement('div');
const inputSearch = document.createElement('input');
const labelInputBrand = document.createElement('label');
const textBrand = document.createElement('div');
const InputBrand = document.createElement('input');
const btn = document.createElement('button');
const text = document.createElement('h1');
const ol = document.createElement('ol');
const empty = document.createElement('div');
const li = document.createElement('li');

container.append(form);
form.append(labelInputSearch);
form.append(labelInputBrand);
form.append(btn);
container.append(text);
container.append(ol);
container.append(empty);

labelInputBrand.append(textBrand);
labelInputBrand.append(InputBrand);
labelInputSearch.append(textSearch);
labelInputSearch.append(inputSearch);

textSearch.textContent = 'Запрос: ';
textBrand.textContent = 'Мой бренд: ';
btn.textContent = 'поиск';
text.textContent = 'Рейтинг по запросу:';
empty.textContent = 'Пусто...';

form.style.cssText = `
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 300px;
`
labelInputSearch.style.cssText = `
  display: flex;
  margin-bottom: 10px;
`

labelInputBrand.style.cssText = `
  display: flex;
  margin-bottom: 10px;
`
textSearch.style.width = '80px';
textBrand.style.width = '80px';

btn.style.cssText = `
  padding: 5px;
  width: 150px;  
`
text.style.fontWeight = '700';

// code
const endpoint = 'https://search.wb.ru/exactmatch/ru/common/v4/search?filters=fbrand&resultset=filters&suppressSpellcheck=false&locale=ru&dest=-1221148,-140294,-1751445,-364763';

const getStandardizedString = (str, separator) => str.toLowerCase().split(' ').filter((word) => word).join(separator);

const getValue = (obj, path) => {
	if (!path) return obj;
	const pathParts = path.split('.');
	let value = obj;
	for (const part of pathParts) {
		value = value?.[part];
		if (value === null || value === undefined) return null;
	}
	return value;
};

const clearTable = () => {
  ol.textContent = '';
  empty.style.display = 'block';
};

const getSortedBrands = (data) => data.sort((a, b) => a.count - b.count);

const addTable = (data, brand) => {
  empty.style.display = 'none';
  const sortedData = getSortedBrands(data);
  sortedData.map((item) => {
    const li = document.createElement('li');
    ol.append(li);
    li.textContent = item.name;

    if (item.name.toLowerCase().trim() === brand) {
      li.style.color = 'green';
      li.style.fontWeight = '700';
    } 
  });
}

const getInputsValue = (searchProduct, searchBrand) => {
  return {
    path: getStandardizedString(searchProduct, '+'),
    brand: getStandardizedString(searchBrand, ' '),
  }
}

const getItems = async (path) => {
  try {
    const response = await fetch(endpoint + '&query=' + path)
      .then(response => response.json());

    const items = getValue(response, 'data.filters.0.items');
    return Array.isArray(items) ? items : null;  

  } catch (error) {
    console.log(error);
  }
}

const runSearching = async (search, searchBrand) => {
  text.textContent = 'Рейтинг по запросу: ' + search;

  const {path, brand} = getInputsValue(search, searchBrand);
  const data = await getItems(path);
  
  clearTable();
  if (!data) return;
  addTable(data, searchBrand ? brand : null);
}

const addEventClick = () => {
  document.addEventListener('click', e => {
    e.preventDefault();
    const event = e.target;

    if (event === btn) {
      const search = inputSearch.value.trim();
      if (!search) return;
      const searchBrand = InputBrand.value.trim();
      runSearching(search, searchBrand);
    }
  });
}

addEventClick();