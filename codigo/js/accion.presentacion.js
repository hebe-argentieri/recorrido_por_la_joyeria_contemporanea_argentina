/* 
 Inicialización
 contacto: nodos.dsnn@gmail.com
 licencia: GPL
 actualizacion: 2020-07-23 17:51:48.360952
*/

/* variables */
var V = {
  win : {},
  doc : {},
  htm : {},  
  bod : {},
  dat : {},
};

/* seteos */
_.templateSettings = {
  interpolate: /\<\[\=(.+?)\]\>/g,
  evaluate: /\<\[(.+?)\]\>/g,
  escape: /\<\[\-(.+?)\]\>/g,
};

/* inicializacion */
$(document).bind({
	ready : function(){
    V.win = $(window);
    V.doc = $(document);
    V.htm = $('html').eq(0);
    V.bod = $('body').eq(0);
    V.dat = YAML.parse(yml);
    Interfaz.activar();
  }
});
$(window).bind({
	load : function(){},
	resize : function(){},
	mouseenter : function(e){},
  beforeunload : function(){}
});