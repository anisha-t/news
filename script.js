// Define the API key for accessing the news data
const API_KEY = "6d363425e7144265bcf36db3d5658ee6";
// Define the base URL for the News API
const url = "https://newsapi.org/v2/everything?q=";

// Call the fetchNews function with "India" as the initial query when the page loads
window.addEventListener("load", () => fetchNews("India"));

// Function to reload the window
function reload() {
    window.location.reload();
}

// Asynchronous function to fetch news data based on a given query
async function fetchNews(query) {
    // Use the fetch function to make a GET request to the News API
    // The query and API key are included in the URL
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    
    // Convert the response data to JSON format
    const data = await res.json();
    
    // Call the bindData function to display the news articles on the page
    bindData(data.articles);
    // This will create copies of a template for each article, allowing them to be displayed individually.
}
// Binds the fetched data from the News API into HTML elements on the DOM

function bindData(articles) {
    // Get a reference to the HTML container where news cards will be displayed
    const cardsContainer = document.getElementById("cards-container");

    // Get a reference to the HTML template for a news card
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear the existing content within the cards container
    cardsContainer.innerHTML = "";

    // Loop through each article in the provided array
    articles.forEach((article) => {
        // Check if the current article has a valid image URL
        // If not, skip this article and move to the next iteration
        if (!article.urlToImage) return;

        // Clone the content of the news card template
        const cardClone = newsCardTemplate.content.cloneNode(true);

        // Call the function to fill data into the cloned card
        fillDataInCard(cardClone, article);

        // Append the filled card clone to the cards container
        cardsContainer.appendChild(cardClone);
    });
}


// This function takes in a cloned card element and an article object as parameters.
function fillDataInCard(cardClone, article) {
    // Finding specific elements within the cloned card using querySelector.
    const newsImg = cardClone.querySelector("#news-img");       // Finding the image element.
    const newsTitle = cardClone.querySelector("#news-title");   // Finding the title element.
    const newsSource = cardClone.querySelector("#news-source"); // Finding the source element.
    const newsDesc = cardClone.querySelector("#news-desc");     // Finding the description element.

    // Setting the source URL of the image from the article object.
    newsImg.src = article.urlToImage;
    // Setting the title of the news from the article object.
    newsTitle.innerHTML = article.title;
    // Setting the description of the news from the article object.
    newsDesc.innerHTML = article.description;

    // Converting the published date of the article to a readable string in the Asia/Jakarta time zone.
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    // Creating a string that combines the source name and the formatted date.
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Adding a click event listener to the first child element of the card (likely the whole card element).
    cardClone.firstElementChild.addEventListener("click", () => {
        // Opening the URL of the article in a new browser tab.
        window.open(article.url, "_blank");
    });
}

// This variable stores the currently selected navigation item.
let curSelectedNav = null;

// This function is called when a navigation item is clicked.
function onNavItemClick(id) {
    // Call the fetchNews function with the provided id to fetch news related to the selected item.
    fetchNews(id);

    // Get the clicked navigation item by its id.
    const navItem = document.getElementById(id);

    // Remove the "active" class from the previously selected navigation item (if any).
    curSelectedNav?.classList.remove("active");

    // Update the currently selected navigation item and add the "active" class to it.
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Get references to the search button and search text input.
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// Add a click event listener to the search button.
searchButton.addEventListener("click", () => {
    // Get the search query from the search text input.
    const query = searchText.value;

    // If the query is empty, do nothing.
    if (!query) return;

    // Call the fetchNews function with the search query to fetch relevant news.
    fetchNews(query);

    // Remove the "active" class from the previously selected navigation item (if any),
    // and reset the currently selected navigation item to null.
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
