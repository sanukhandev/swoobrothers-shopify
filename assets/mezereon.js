document.addEventListener('DOMContentLoaded', function() {
  if (!window.mz) {
    return
  }
  if (mz.context.filterShow) {
    // placeholder
  }
  function afterUpdate() {
    var shopCurrency = mz.context.shopCurrency;
    var cookieCurrency = Currency.cookie.read();
    Currency.convertAll(shopCurrency, cookieCurrency)
    var price = document.querySelector('[data-facet-name="price"]');
    if (shopCurrency != cookieCurrency) {
      price.classList.add("mz-hidden");
    } else {
      price.classList.remove("mz-hidden");
    }
  }
  if (mz.app && mz.app.$bus) {
    mz.app.$bus.on('after-update', afterUpdate)
  }
})
