/* Clase Acciones
 * nodos(2015)
 */

var Acciones = {

  activar : function(oj){
    var THIS = this;
    var dat = oj.attr('acc').split(';');
    if(THIS.acc[dat[0]] != undefined){
      if(dat[1] === 'iniciar'){
        THIS.acc[dat[0]](dat.slice(2), oj)
      }else{
        oj.on(dat[1],function(e){
          THIS.acc[dat[0]](dat.slice(2), e)
        });
      }
    }else{
      console.log('ERROR: acción inexistente: ', dat[0]);
    }
  },
  acc : {
    menu_previo: function(l, e){
      let cnt = $(e);
      let lista = $('<ul>');
      let b, i, k, a, d, p;
      for(i in V.dat.menu_previo){
        k = V.dat.menu_previo[i];
        d = V.dat.elementos[k];
        b = $($('#plantilla_item_menu_previo').html());
        b.data('clave', k);
        $('b', b).eq(0).html(d.titulo);
        $('a', b).eq(0).attr('href', '#'+k);
        $('.icono', b).eq(0).addClass(d.icono);
        b.css('width', d.ancho+'%');
        p = $('<li>');
        p.attr('id', k);
        lista.append(p.html(b));
      }
      cnt.html(lista);  
    },
    menu_cronologico: function(l, e){
      let cnt = $(e);
      let i, k, anio, mes;
      let crono = {};
      for(i in V.dat.menu_cronologico){
        k = V.dat.menu_cronologico[i];
        anio = V.dat.elementos[k].anno
        mes = V.dat.elementos[k].mes
        if(crono[anio] === undefined){
          crono[anio] = [[],[],[],[],[],[],[],[],[],[],[],[]];
        }
        crono[anio][mes-1].push(k);
      }
      let j, t, a;
      let lista = $('<ul>');
      for(anio in crono){
        let li_anio = $('<li>');
        li_anio.append($('<b class="anio">').html(anio));
        let l_mes = $('<ul class="meses">');
        let va = crono[anio];
        for(let h in va){
          let k = va[h][0];
          if(k !== undefined){
            let cnt = $('<div>');
            for(let g in va[h]){
              let item = $('<div class="item">')
              let kk = va[h][g];
              item.addClass('elemento');
              item.attr('clave', kk);
              if(V.dat.cfg.menu_cronologico.mostrar_fecha){
                t = Interfaz.mostrar_fecha_elemento(kk);
              }else{
                t = Interfaz.mostrar_titulo_elemento_crono(kk);
              }
              a = $('<a>').html(t);
              a.attr('href', '#'+kk);

              a.on({
                click: function(ev){
                  ev.preventDefault();
                  Interfaz.activar_elemento(kk);
                  return false;
                },
                mouseover: function(ev){
                  ev.preventDefault();
                  Interfaz.activar_elemento(kk);
                  return false;
                },
                mouseleave: function(ev){
                  ev.preventDefault();
                  Interfaz.activar_elemento(kk, false);
                  return false;
                },
              });
              item.append(a);
              cnt.append(item);
            }

            l_mes.append($('<li>').append(cnt));
          }else{
            l_mes.append($('<li class="vacio">'));
          }
        } 
        li_anio.append(l_mes);

        lista.append(li_anio)

      }
      cnt.html(lista);
    },
    menu_grafico: function(l, e){
      setTimeout(function(){
        let cnt = $(e);
        let lista = $('<ul>');
        let i, k, t, a, b, img, d;
        for(i in V.dat.menu_cronologico){
          k = V.dat.menu_cronologico[i];
          d = V.dat.elementos[k];
          t = Interfaz.mostrar_titulo_elemento(k);
          b = $($('#plantilla_item_menu_grafico').html());
          b.data('clave', k);
          //b.attr('title', k);
          $('.imagen', b).eq(0).css('background-image', 'url(./info/media/'+k+'/0.png)')
          $('a', b).eq(0).attr('href', '#'+k);
          if(V.dat.cfg.mostrar_numero_en_titulo){
            $('em', b).eq(0).html(d.numero);
          }
          $('b', b).eq(0).html(d.titulo);
          $('i', b).eq(0).html(d.subtitulo);
          $('.icono', b).eq(0).addClass(d.icono);
          b.addClass(d.grupo);
          b.css('width', d.ancho+'%');
          b.attr('id', k);
          lista.append($('<li>').html(b))
        }
        cnt.html(lista);

        $('li .bloque').on({
          click: function(ev){
            ev.preventDefault();
            let k = $(this).data('clave');
            Interfaz.activar_elemento(k);
            Interfaz.abrir_elemento(k);
            return false;
          }
        })

        let ee_crono = $('#mn_cronologico .elemento');
        let py, ev, aj;
        let mng_py = $('#mn_grafico').position().top;
        for(let ei=0; ei < ee_crono.length; ei++){
          ev = ee_crono.eq(ei);
          py = ev.position().top;
          aj = 70;
          $('#'+ev.attr('clave')).css('top', (py-mng_py-aj)+'px')
        }

      }, 500);

    },
    menu_destacados: function(l, e){
      let cnt = $(e);
      let lista = $('<ul>');
      let i, k, t, a, p;
      for(i in V.dat.menu_destacado){
        k = V.dat.menu_destacado[i];
        t = Interfaz.mostrar_titulo_elemento(k);
        a = $('<a>').html(t);
        a.attr('href', '#'+k);
        p = $('<li>');
        lista.append(p.html(a));
      }
      cnt.html(lista);
    },
    conmutar_visibilidad:function(l, e){
      let cnt = $(e);
      let par = cnt.parent();
      let c_act = 'activo';
      cnt.on({
        click: function(){
          par.toggleClass(c_act);
        }
      })

    },
  }
};
