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
  }
  if (mz.app && mz.app.$bus) {
    mz.app.$bus.on('after-update', afterUpdate)
  }
})
