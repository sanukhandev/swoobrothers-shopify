// This JavaScript file should be included in your theme

document.addEventListener('DOMContentLoaded', function() {

    // Check if the multi-currency feature is enabled
    if (typeof Shopify === 'undefined' || !Shopify.shop_currency || !Currency) {
        return;
    }

    // Pick your format here: money_format or money_with_currency_format
    Currency.format = Shopify.currency_format == "money_format" ? 'money_format' : 'money_with_currency_format';

    var shopCurrency = Shopify.shop_currency;

   console.log(shopCurrency);
  console.log('loading');

    /* Sometimes merchants change their shop currency, let's tell our JavaScript file */
    Currency.moneyFormats[shopCurrency].money_with_currency_format = Shopify.money_with_currency_format;
    Currency.moneyFormats[shopCurrency].money_format = Shopify.money_format;

    var cookieCurrency = Currency.cookie.read();

    // Fix for customer account pages.
    jQuery('span.money span.money').each(function() {
        jQuery(this).parents('span.money').removeClass('money');
    });

    // Saving the current price.
    jQuery('span.money').each(function() {
        jQuery(this).attr('data-currency-' + shopCurrency, jQuery(this).html());
    });

    // Select all your currencies buttons.
    var buttons = jQuery('#currencies li a');

    // If there's no cookie or it's the shop currency.
    if (cookieCurrency == null || cookieCurrency === shopCurrency) {
        buttons.removeClass('selected');
        jQuery('#currencies a[data-currency=' + shopCurrency + ']').addClass('selected');
        Currency.currentCurrency = shopCurrency;
    } else {
        Currency.convertAll(shopCurrency, cookieCurrency);
        buttons.removeClass('selected');
        jQuery('#currencies a[data-currency=' + cookieCurrency + ']').addClass('selected');
    }

    // When customer clicks on a currency button.
    buttons.click(function() {
        buttons.removeClass('selected');
        jQuery(this).addClass('selected');
        var newCurrency = jQuery(this).attr('data-currency');
        Currency.convertAll(Currency.currentCurrency, newCurrency);
        jQuery('.selected-currency').text(newCurrency);
        Currency.cookie.write(newCurrency);
    });

    // For options.
    var original_selectCallback = window.selectCallback;
    window.selectCallback = function(variant, selector) {
        original_selectCallback(variant, selector);
        Currency.convertAll(shopCurrency, jQuery('#currencies a.selected').attr('data-currency'));
        jQuery('.selected-currency').text(Currency.currentCurrency);
    };

    jQuery('body').on('ajaxCart.afterCartLoad', function(cart) {
        Currency.convertAll(shopCurrency, jQuery('#currencies a.selected').attr('data-currency'));
        jQuery('.selected-currency').text(Currency.currentCurrency);
    });

    jQuery('.selected-currency').text(Currency.currentCurrency);
});
