(function(){
  var variants = [{
    icon:'icon-group',
    word:'an engaged following',
    copy:"Followgen helps you build an engaged audience on twitter that\'s relevant to your brand or interests"
  },
  {
    icon:'icon-bar-chart',
    word:'a measurable following',
    copy:'We help you measure how well you\'re doing on twitter with a weekly email, and stats dashboard that tell you the vital metrics'
  },{
    icon:'icon-search',
    word:'a targeted following',
    copy:'Target people who are interested in topics that are relevant to your brand or interests'
  },{
    icon:'icon-star',
    word:'a genuine following',
    copy:'Followgen targets real individuals. Not brands, and not spam-bots.'
  }
  ];

  function setVariant(v){
    $('.hero-icon').html('<i class="'+v.icon+'"></i>');
    $('span.hero-hotword').text(v.word);
    $('p.hero-copy').text(v.copy);
  }

  $(document).ready(function(){
    setVariant(variants[0]);
    var variant = 1;
    setInterval(function(){
      setVariant(variants[variant]);  
      variant = (variant==variants.length-1) ? 0 : variant+1;
    }, 8000);
  });
})();
