// Example JavaScript for currency conversion
document.addEventListener("DOMContentLoaded", function() {
    // Exchange rates fetched from a reliable source
    const exchangeRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.75
    };
    
    // Default currency
    let currentCurrency = 'USD';

    // Function to update prices based on selected currency
    function updatePrices(currency) {
        const prices = document.querySelectorAll('.product-price');
        prices.forEach(priceElement => {
            const basePrice = parseFloat(priceElement.getAttribute('data-base-price'));
            const convertedPrice = (basePrice * exchangeRates[currency]).toFixed(2);
            priceElement.textContent = `${currency} ${convertedPrice}`;
        });
    }

    // Event listener for currency selector
    document.querySelector('#currency-selector').addEventListener('change', function(e) {
        currentCurrency = e.target.value;
        updatePrices(currentCurrency);
    });

    // Initial price update
    updatePrices(currentCurrency);
});
