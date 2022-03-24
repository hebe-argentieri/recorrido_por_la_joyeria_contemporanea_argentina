/* 
 Clase Interfaz
 contacto: nodos-dsnn.com.ar?sl
 licencia: GPL
 actualizacion: 2020-07-23 17:55:25.872098
*/

var Interfaz = {
  activar : function(fid){
    this.setear_titulo();
    this.setear_acciones(V.bod);
    this.setear_teclas();
  },
  setear_titulo : function(){
    let t = $('title').text();
    $('title').html(V.dat.titulo);
    $('#titulo').html(V.dat.titulo);
  },
  setear_teclas : function(){
    $(V.bod).keydown(function(ev){
      let teclas = {
        27 /* Esc */ : function(){ 
          $('#mn_destacados.activo .conmutar').click();
          $('#panel_flotante.activo .cerrar').click();
        }, 
        37: /* Left */ function(){ 
          $('#panel_flotante.activo .visor_secuencia .menu .anterior').click();
        },
        38: /* Top */ function(){},
        39: /* Right */ function(){ 
          $('#panel_flotante.activo .visor_secuencia .menu .siguiente').click();
        }, 
        40: /* Bottom */ function(){},
        77: /* m */ function(){
          $('#panel_flotante.activo .mn_grupo .siguiente').click();
        },
        78: /* n */ function(){
          $('#panel_flotante.activo .mn_grupo .anterior').click();
        },
      }
      var kc = (ev.keyCode ? ev.keyCode : ev.which);
      if(teclas.hasOwnProperty(kc)){
        teclas[kc]();
      }
    });
  },
  setear_acciones : function(cnt){
    let THIS = this;
    cnt = $(cnt === undefined ? THIS.id : cnt);
    let grp = $('[acc]',cnt);
    for(let i = 0; i< grp.length; i++) Acciones.activar(grp.eq(i));
  },
  mostrar_titulo_elemento : function(id, con_numero=true) {
    let s = $('<span>');
    let e = V.dat.elementos[id];

    if(con_numero){
      if(e.numero !== undefined){ 
        if(V.dat.cfg.mostrar_numero_en_titulo){
          s.append('<em>'+e.numero+'</em>');
        }
      }
    }
    if(e.titulo !== undefined){ s.append('<b>'+e.titulo+'</b>'); }
    if(e.subtitulo !== undefined){ s.append('<i>'+e.subtitulo+'</i>'); }
    return s;
  },
  mostrar_titulo_elemento_crono : function(id) {
    let s = $('<span>');
    let e = V.dat.elementos[id];
    let t = [];
    if(e.titulo !== undefined){ t.push(e.titulo); }
    if(e.subtitulo !== undefined){ t.push(e.subtitulo); }
    s.attr('title', Interfaz.mostrar_fecha_elemento(id));
    return s.html(t.join(' · '));
  },
  mostrar_fecha_elemento : function(id){
    let e = V.dat.elementos[id];
    let f = [];
    if(e.anno !== undefined){ f.push(e.anno); }
    if(e.mes !== undefined){ f.push(e.mes); }
    if(e.dia !== undefined){ f.push(e.dia); }
    return f.join('/');
  },
  abrir_elemento : function(id){
    let e = V.dat.elementos[id];
    let p = $('#panel_flotante');
    let c_act = 'activo';
    let c_blo = 'bloquear';
    $('.titulo', p).html(Interfaz.mostrar_titulo_elemento_crono(id));     
    let tf = Interfaz.mostrar_fecha_elemento(id);
    let ef = $('.fecha', p)
    ef.html(tf);     
    if(tf.length == 0){ ef.hide(); }else{ ef.show(); }
    $('.info', p).html(Interfaz.formatear_contenido(id));     
    p.css('background-color', V.dat.cfg.panel_flotante.color_fondo);
    
    p.addClass(c_act);
    V.bod.addClass(c_blo);

    $('.cerrar', p).on({
        click: function(){ 
          p.removeClass(c_act);
          V.bod.removeClass(c_blo);
          $('.info', p).html('');
          $('.mn_utiles', p).html('');
          $('.titulo', p).html('');     
          $('.subtitulo', p).html('');
          $('.bloque.actual').removeClass('actual');
      }
    });
    let mu = $('.mn_utiles');
    if(Interfaz.cantidad_de_elementos_de_grupo(e.grupo) == 0){
      mu.html('');
    }else if(e.grupo == 'z'){
      mu.html('');
    }else{
      mu.html($('#plantilla_menu_grupo').html());
      $('.mn_grupo', mu).addClass(e.grupo);
      $('.mn_grupo .anterior', mu).on({
          click: function(){ 
          Interfaz.abrir_elemento_de_grupo(e.grupo, id, -1);
        }
      });
      $('.mn_grupo .siguiente', mu).on({
          click: function(){ 
          Interfaz.abrir_elemento_de_grupo(e.grupo, id, 1);
        }
      });
    }
  },
  formatear_contenido : function(id){
    let c = V.dat.elementos[id].contenido;
    let h = $('<div>');
    let r = './info/media/'+id+'/';
    for(let i in c){
      let v, b, l, im;
      v = c[i];
      if(v[0] == 'video'){
        b = $($('#plantilla_visor_video').html());
        $('video source', b).eq(0).attr('src', r+v[1])
        h.append(b);
      }
      if(v[0] == 'secuencia'){
        b = $($('#plantilla_visor_secuencia').html());
        l = $('.lista', b).eq(0);
        im = $('.imagen img', b).eq(0);
        l.data('imagenes', V.dat.secuencias[id]);
        h.append(b);

        $('.anterior', b).eq(0).on({
          click: function(){
            ver_imagen(l.data('actual') - 1)            
          }
        });

         $('.siguiente', b).eq(0).on({
          click: function(){
            ver_imagen(l.data('actual') + 1)            
          }
        });
        let ver_imagen = function(n){
          if(n < 0){ n = l.data('imagenes').length-1; };
          l.data('actual', n % l.data('imagenes').length);
          im.attr('src', r+l.data('imagenes')[l.data('actual')]);
        }
        let em = $('.menu', b);
        if(l.data('imagenes').length <= 1){ em.hide(); }else{ em.show(); }
        ver_imagen(0);
      }
      if(v[0] == 'texto'){
        b = $($('#plantilla_visor_texto').html());
        b.html(marked(V.dat.textos[v[1]]));
        h.append(b);
      }
    }
    return h;
  },
  cantidad_de_elementos_de_grupo : function(e){
    let g = $('#mn_grafico .'+e);
    return g.length;
  },
  abrir_elemento_de_grupo : function(e, k, d){
    let g = $('#mn_grafico .'+e);
    for(let i=0; i < g.length; i++){
      if(g.eq(i).attr('id') == k){
        let n = i+d;
        if(n == g.length) n = 0;
        if(n < 0) n = g.length-1;

        g.eq(n).find('a').click();
        return;
      }
    }
  },
  activar_elemento : function(id, estado=true){
    let c_act = 'actual';
    $('#mn_grafico .bloque').removeClass(c_act);
    if(estado){
      $('#'+id).addClass(c_act);
    }
  },
};
