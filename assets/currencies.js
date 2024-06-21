// currencies.js

// Define the Currency object if not already defined
if (typeof Currency === "undefined") {
    var Currency = {};
}

// Currency.cookie utility for handling currency cookies
Currency.cookie = {
    configuration: {
        expires: 365,
        path: "/",
        domain: window.location.hostname
    },
    name: "currency",
    write: function(currency) {
        jQuery.cookie(this.name, currency, this.configuration);
    },
    read: function() {
        return jQuery.cookie(this.name);
    },
    destroy: function() {
        jQuery.cookie(this.name, null, this.configuration);
    }
};

// Currency money formats for various currencies
Currency.moneyFormats = {
    USD: { money_format: "${{amount}}", money_with_currency_format: "${{amount}} USD" },
    EUR: { money_format: "&euro;{{amount}}", money_with_currency_format: "&euro;{{amount}} EUR" },
    GBP: { money_format: "&pound;{{amount}}", money_with_currency_format: "&pound;{{amount}} GBP" },
    // Add more currency formats here as needed
};

// Utility function for formatting money
Currency.formatMoney = function(amount, format) {
    if (typeof Shopify.formatMoney === "function") {
        return Shopify.formatMoney(amount, format);
    }
    if (typeof amount === "string") {
        amount = amount.replace(".", "");
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var defaultFormat = format || "${{amount}}";

    function defaultOption(value, defaultValue) {
        return (typeof value === "undefined") ? defaultValue : value;
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ",");
        decimal = defaultOption(decimal, ".");

        if (isNaN(number) || number == null) {
            return 0;
        }

        number = (number / 100.0).toFixed(precision);
        var parts = number.split(".");
        var integerPart = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands);
        var decimalPart = parts[1] ? (decimal + parts[1]) : "";
        return integerPart + decimalPart;
    }

    switch (defaultFormat.match(placeholderRegex)[1]) {
        case "amount":
            value = formatWithDelimiters(amount, 2);
            break;
        case "amount_no_decimals":
            value = formatWithDelimiters(amount, 0);
            break;
        case "amount_with_comma_separator":
            value = formatWithDelimiters(amount, 2, ".", ",");
            break;
        case "amount_no_decimals_with_comma_separator":
            value = formatWithDelimiters(amount, 0, ".", ",");
            break;
    }

    return defaultFormat.replace(placeholderRegex, value);
};

// Currency conversion logic
Currency.currentCurrency = "";
Currency.format = "money_with_currency_format";

Currency.convert = function(amount, fromCurrency, toCurrency) {
    // Add conversion logic here (e.g., via exchange rates)
    // For simplicity, assume a conversion rate of 1:1 for now
    return amount;
};

Currency.convertAll = function(fromCurrency, toCurrency, selector, format) {
    jQuery(selector || "span.money").each(function() {
        if (jQuery(this).attr("data-currency") === toCurrency) {
            return;
        }
        if (jQuery(this).attr("data-currency-" + toCurrency)) {
            jQuery(this).html(jQuery(this).attr("data-currency-" + toCurrency));
        } else {
            var amount = 0;
            var fromFormat = Currency.moneyFormats[fromCurrency][format || Currency.format] || "{{amount}}";
            var toFormat = Currency.moneyFormats[toCurrency][format || Currency.format] || "{{amount}}";

            if (fromFormat.indexOf("amount_no_decimals") !== -1) {
                amount = Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g, ""), 10) * 100, fromCurrency, toCurrency);
            } else {
                if (fromCurrency === "JOD" || fromCurrency === "KWD" || fromCurrency === "BHD") {
                    amount = Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g, ""), 10) / 10, fromCurrency, toCurrency);
                } else {
                    amount = Currency.convert(parseInt(jQuery(this).html().replace(/[^0-9]/g, ""), 10), fromCurrency, toCurrency);
                }
            }

            var formattedAmount = Currency.formatMoney(amount, toFormat);
            jQuery(this).html(formattedAmount);
            jQuery(this).attr("data-currency-" + toCurrency, formattedAmount);
        }
        jQuery(this).attr("data-currency", toCurrency);
    });

    this.currentCurrency = toCurrency;
    this.cookie.write(toCurrency);
};

// Ensure jQuery.cookie plugin is available
if (typeof jQuery.cookie === "undefined") {
    // Include jQuery.cookie plugin code here if necessary
}
