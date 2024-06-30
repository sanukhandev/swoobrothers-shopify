document.addEventListener('DOMContentLoaded', function() {
  if (!window.mz) {
    return
  }
  if (mz.context.filterShow) {
    // placeholder
  }
  function afterUpdate() {
    console.log(mz.shopCurrency);
    // placeholder
  }
  if (mz.app && mz.app.$bus) {
    mz.app.$bus.on('after-update', afterUpdate)
  }
})
