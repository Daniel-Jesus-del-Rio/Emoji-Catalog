//General Constans
const wordSearch = document.querySelector('.js-search-input');
const feedback = document.querySelector('.js-search-feedback');
const favoritesButton = document.querySelector('.js-favourites');
const listOfcategories = document.querySelector('.js-category-list');
const groupOfEmojis = document.querySelector('.js-groups');
const buttonSearch = document.querySelector('.js-search-btn');
const WordResult = document.querySelector('js-result-word');
const listOfResults = document.querySelector('.js-results-list');
const articleEmojidetail = document.querySelector('article.js-detail');
const listOfGroups = document.querySelector('.js-group-list');
const listaEmojis = document.querySelector("#js-results-list");
const botonesLaterales = document.querySelectorAll('.js-category-item');
const resultTitle = document.querySelector('.results__title');
const detailPopUp = document.querySelector('article.js-detail');
const iconChanged = document.querySelector('.js-detail-fav-icon');
const textOfLateral = document.querySelector('.js-detail-fav-label');
const nameDetail = document.querySelector('.js-detail-name');
const codeDetail = document.querySelector('.js-detail-emoji');
const detalFullname = document.querySelector('.js-detail-fullname');
const detailCategory = document.querySelector('.js-detail-category');
const detailGroup = document.querySelector('.js-detail-group');
const detailHtml = document.querySelector('.js-detail-htmlcodes');
const detailUnicode = document.querySelector('.js-detail-unicodes');
//General variables
let emojisByCategory = [];
let favEmojis = getCookie('favEmojis') == null ? [] : JSON.parse(getCookie('favEmojis').slice(1));
let listOfEmojis = [];
let emojis = [];
let categories = [];
let groups = [];
let test = [];
let apiURL = "https://emojihub.yurace.pro/api/all";
let selectedCategory = "all";
feedback.textContent = '';
textOfLateral.addEventListener('click', () => {addEmojiFavList()});

//Fetching API

fetchData(apiURL)
    .then((data) => {
        emojis = data;
        listOfEmojis = data;
        displayEmojiCatalog(data);
        changeTitle(data, selectedCategory);
        getCategories();
    })
    .catch((error) => {
        console.error('Error fetching emoji data:', error);
    });

//Function for filtering emojis
function displayEmojiCatalog(emojiData) {
    emojiData.sort((a, b) => a.name.localeCompare(b.name));

    let uniqueEmojis = new Set();

    const resultsList = document.querySelector('.js-results-list');
    resultsList.innerHTML = '';

    emojiData.forEach((emoji) => {
        const emojiId = emoji.unicode[0];
        if (!uniqueEmojis.has(emojiId)) {
            uniqueEmojis.add(emojiId);

            const emojiCard = document.createElement('li');
            emojiCard.className = 'emoji-card js-item-emoji';
            emojiCard.setAttribute('data-emoji', emojiId);
            emojiCard.title = emoji.name;
            let favIcon = 'ico-fav-outline.svg';
            if (favEmojis.includes(emoji.unicode[0])) favIcon = 'ico-fav-selected-outline.svg';

            emojiCard.innerHTML = `
                <img class="emoji-card__fav js-item-fav" data-emoji="${emojiId}" src="img/${favIcon}">
                <span class="emoji-card__image" data-emoji="${emojiId}">${emoji.htmlCode[0]}</span>
                <span class="emoji-card__name" data-emoji="${emojiId}">${emoji.name.split(/[≊,]/)[0].trim().substring(0, 20)}</span>
                
            `;
            resultsList.appendChild(emojiCard);
            
            document.querySelector(`.js-item-fav[data-emoji="${emojiId}"]`).addEventListener('click', () => {
                    if(document.querySelector(`.js-item-fav[data-emoji="${emojiId}"]`).src.includes('ico-fav-outline.svg'))
                document.querySelector(`.js-item-fav[data-emoji="${emojiId}"]`).src = "img/ico-fav-selected-outline.svg";
                    else document.querySelector(`.js-item-fav[data-emoji="${emojiId}"]`).src = "img/ico-fav-outline.svg";
                addEmojiFavList(emoji.unicode[0]);
            });
            //Event listener in the image, if you click, detail--show will appear
            document.querySelector(`.emoji-card__image[data-emoji="${emojiId}"]`).addEventListener('click', () => {
                detailPopUp.classList.add('detail--show');
                nameDetail.innerText = emoji.name.split(/[≊,]/)[0].trim().substring(0, 20);
                codeDetail.innerHTML = emoji.htmlCode;
                detalFullname.innerText = emoji.name;
                detailCategory.innerText = emoji.category;
                detailGroup.innerText = emoji.group;
                detailHtml.innerText = emoji.htmlCode[0];
                detailUnicode.innerText = emoji.unicode[0];
                detailUnicode.style.cssText = 'display: inline-block;padding: 4px 8px;margin: 0 8px 0 0;font-size: 19px;color: var(--white);background-color: var(--gray--160);border-radius: 6px;';
                detailHtml.style.cssText = 'display: inline-block;padding: 4px 8px;margin: 0 8px 0 0;font-size: 19px;color: var(--white);background-color: var(--gray--160);border-radius: 6px;';
                if (favEmojis.includes(emoji.unicode[0])) {
                    iconChanged.src = "img/ico-trash-outline.svg";
                    textOfLateral.textContent = "Remove favs";
                } else {
                    iconChanged.src = "img/ico-fav-outline.svg";
                    textOfLateral.textContent = "Add to favs";
                }
            });
            
        }
    });
emojiData = uniqueEmojis;
//Change title
changeTitle(uniqueEmojis, selectedCategory);
}
//Event listener to close detail--show
document.querySelector('.js-detail-close').addEventListener('click', () => {
    detailPopUp.classList.remove('detail--show');
});

const iconOfCard = document.querySelector('.js-item-fav');

//Event in case we click search Button
buttonSearch.addEventListener('click', (event) => {
    event.preventDefault();
    const searchTerm = wordSearch.value.toLowerCase();
    wordSearch.value = searchTerm;
    if (searchTerm.length < 3) {
        feedback.textContent = 'Search term should be at least 3 chars length';
    } else {
        feedback.textContent = '';
        const filteredEmojis = new Set(); 
        listOfEmojis.forEach((emoji) => {
            const emojiNameLowerCase = emoji.name.toLowerCase();
            const unicode = emoji.unicode[0].toLowerCase();

            if (emojiNameLowerCase.includes(searchTerm) || unicode.includes(searchTerm)) {
                filteredEmojis.add(emoji); 
            }
        });
        listOfEmojis = Array.from(filteredEmojis);
        const filteredEmojisArray = Array.from(filteredEmojis); 
        displayEmojiCatalog(filteredEmojisArray);
        changeTitleSearch(filteredEmojisArray, searchTerm);
    }
});

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
//Getting categories
function getCategories() {
    emojis.forEach(emoji => {
        const category = emoji.category;
        if (!categories.includes(category)) {
            categories.push(category);
        }
    });
    categories.sort();
    printCategories();
    getGroups();

}
//Function for printing categories
function printCategories() {
    listOfcategories.innerHTML = '';
    const categoryLi = document.createElement('li');
    categoryLi.className = 'category-item js-category-item category-list__item';
    categoryLi.setAttribute('data-category', "all");
    categoryLi.innerHTML = `
            <a class="category-list__link link" href="" data-category="all">All</a>
        `;

    categoryLi.addEventListener("click", () => {

        window.location.reload();

    });
    listOfcategories.appendChild(categoryLi);
    categories.forEach(category => {
        const categoryLi = document.createElement('li');
        categoryLi.className = 'category-item js-category-item category-list__item';
        categoryLi.setAttribute('data-category', category.replaceAll(" ", "-"));
        categoryLi.innerHTML = `
            <a class="category-list__link link" href="" data-category="${category.replaceAll(" ", "-")}">${category}</a>
        `;

        categoryLi.addEventListener("click", (event) => {
            event.preventDefault();
            const categoryUrl = `https://emojihub.yurace.pro/api/all/category/${category.replaceAll(" ", "-")}`;
            fetchData(categoryUrl)
                .then((data) => {
                    displayEmojiCatalog(data);
                    emojis = data;
                    listOfEmojis = data;
                    changeTitle(data, category);
                    selectedCategory = category;
                    getGroups();
                })
                .catch((error) => {
                    console.error('Error fetching emoji data:', error);
                });
        });
        listOfcategories.appendChild(categoryLi);
    });

}
//Getting groups
function getGroups() {
    groups = [];
    listOfEmojis.forEach(emoji => {
        const group = emoji.group;
        if (!groups.includes(group)) {
            groups.push(group);
        }
    });
    groups.sort();
    printGroups();
}
//Function for printing Groups
function printGroups() {
    listOfGroups.innerHTML = '';
    const groupLi = document.createElement('li');
    groupLi.className = 'pill pill--selected';
    groupLi.innerHTML = `<a class="pill__link" data-group="all" href="">all</a>`;
    groupLi.addEventListener("click", (event) => {
        event.preventDefault();
        listOfGroups.querySelectorAll(".pill").forEach((event) => { event.classList.remove("pill--selected") });
        groupLi.className += " pill--selected";
        let groupUrl = '';
        if (selectedCategory == "all") {
            groupUrl = `https://emojihub.yurace.pro/api/all`;
        } else {
            groupUrl = `https://emojihub.yurace.pro/api/all/category/${selectedCategory.replaceAll(" ", "-")}`;
        }
        fetchData(groupUrl)
            .then((data) => {
                displayEmojiCatalog(data);
                listOfEmojis = data;
                changeTitle(data, selectedCategory);
            })
            .catch((error) => {
                console.error('Error fetching emoji data:', error);
            });
    });
    listOfGroups.appendChild(groupLi);
    if (groups.length > 1 && selectedCategory != "all") {
        document.getElementById("cosas").style.display = "flex"; 
        groups.forEach(group => {
            const groupLi = document.createElement('li');
            groupLi.className = 'pill';
            groupLi.innerHTML = `<a class="pill__link" data-group="${group.replaceAll(" ", "-")}" href="">${group}</a>`;
            listOfGroups.appendChild(groupLi);
            groupLi.addEventListener("click", (event) => {
                event.preventDefault();
                listOfGroups.querySelectorAll(".pill").forEach((event) => { event.classList.remove("pill--selected") });
                groupLi.className += " pill--selected";
                let groupUrl = `https://emojihub.yurace.pro/api/all/group/${group.replaceAll(" ", "-")}`;

                fetchData(groupUrl)
                    .then((data) => {
                        displayEmojiCatalog(data);
                        changeTitle(data, selectedCategory);
                    })
                    .catch((error) => {
                        console.error('Error fetching emoji data:', error);
                    });
            });
            listOfGroups.appendChild(groupLi);

        });
    } else if(groups.length==1 || selectedCategory == "all" || selectedCategory == "favs"){
        document.getElementById("cosas").style.display = "none"; 
    }
}
//Function to change Search title
function changeTitle(data, category) {
    data = scrapNames(data);
    resultTitle.innerHTML = data.length == 0 ? "There is no emojis that matchs this category." :
        data.length + " results found in " + category + " category.";
    if (data.length == 0) {
        resultTitle.classList.add("js-results-empty");
        resultTitle.classList.remove("js-results-title");
    } else {
        resultTitle.classList.remove("js-results-empty");
        resultTitle.classList.add("js-results-title");
    }
}
function changeTitleSearch(data, search) {
    data = scrapNames(data);
    resultTitle.innerHTML = data.length == 0 ? "No emojis found for " + search :
        data.length + " results found for " + search;
    if (data.length == 0) {
        resultTitle.classList.add("js-results-empty");
        resultTitle.classList.remove("js-results-title");
    } else {
        resultTitle.classList.remove("js-results-empty");
        resultTitle.classList.add("js-results-title");
    }
}

function scrapNames(data) {
    let emojisList = [];
    let emojisUnicode = [];
    data.forEach(emoji => {
        if (typeof emoji.name !== "undefined") {
            if (!emojisUnicode.includes(emoji.unicode[0])) {
                emojisUnicode.push(emoji.unicode[0]);
                emojisList.push(emoji);
            }
        }
    });
    emojis = emojisList;
    listOfEmojis = emojisList;
    return emojisList;
}
//We add emojis to the list of favs
function addEmojiFavList(unicode) {
    let emojiId = unicode === undefined ? document.querySelector('.js-detail-unicodes').textContent : unicode;
    if (favEmojis.includes(emojiId)) {
        favEmojis.splice(favEmojis.indexOf(emojiId), 1);
        iconChanged.src = "img/ico-fav-outline.svg";
        textOfLateral.textContent = "Add to favs";
        document.querySelector(`.js-item-fav[data-emoji="${emojiId}"]`).src = "img/ico-fav-outline.svg";
    } else {
        favEmojis.push(emojiId);
        iconChanged.src = "img/ico-trash-outline.svg";
        textOfLateral.textContent = "Remove favs";
        document.querySelector(`.js-item-fav[data-emoji="${emojiId}"]`).src = "img/ico-fav-selected-outline.svg";
    }
    document.cookie = 'favEmojis='+JSON.stringify(favEmojis)+";expires="+new Date().setTime(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)+"; path=/";
    if(selectedCategory == 'favs') getFavEmojis();
}
//Get cookies
function getCookie(name) {
    const cookies = document.cookie.split(";");

    for(let i =0 ; i< cookies.length; i++){
        let cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length));
        }
    }
    return null;
}
//Getting fav emojis
function getFavEmojis(){
    let listOfFavEmojis = [];
    fetchData(apiURL)
    .then((data) => {
        data.forEach(emoji => {
            if(favEmojis.includes(emoji.unicode[0])){
                listOfFavEmojis.push(emoji);
            }
        });
        console.log(listOfFavEmojis);
        displayEmojiCatalog(listOfFavEmojis);
        resultTitle.innerHTML = favEmojis == 0 ? "There is no emojis in favourites." :
        favEmojis.length + " results found in favourites.";
    })
    .catch((error) => {
        console.error('Error fetching emoji data:', error);
    });
}
favoritesButton.addEventListener('click', () => {selectedCategory='favs';getFavEmojis()});

