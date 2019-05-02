(function($) {
    var options = {
      highlightStyle: "default",
      highlightLines: true,
      navigation: {
        scroll: false,
        touch: false,
        click: false
      },
      ratio: "4:3",
      slideNumberFormat: '%current%',
      countIncrementalSlides: false
    };
    if (typeof $.urlParam !== 'undefined' && $.urlParam("source")) {
        options.sourceUrl = $.urlParam("source");
    }
    remark.create(options);
})((typeof jQuery !== 'undefined' ? jQuery : (window.jQuery = {})));
