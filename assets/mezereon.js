document.addEventListener('DOMContentLoaded', function() {
  if (!window.mz) {
    return
  }
  if (mz.context.filterShow) {
    // placeholder
  }
  var buttons = jQuery('#currencies li a');
  buttons.click(function() {
    togglePrice()
  });
  function togglePrice() {
    var shopCurrency = mz.context.shopCurrency;
    var cookieCurrency = Currency.cookie.read();
    var price = document.querySelectorAll('[data-facet-name="price"]');
    if (shopCurrency != cookieCurrency) {
      price.forEach(x => x.classList.add("mz-hidden"));
    } else {
      price.forEach(x => x.classList.remove("mz-hidden"));
    }
  }
  function afterUpdate() {
    var shopCurrency = mz.context.shopCurrency;
    var cookieCurrency = Currency.cookie.read();
    Currency.convertAll(shopCurrency, cookieCurrency)
    togglePrice()
  }
  if (mz.app && mz.app.$bus) {
    mz.app.$bus.on('after-update', afterUpdate)
  }
})
