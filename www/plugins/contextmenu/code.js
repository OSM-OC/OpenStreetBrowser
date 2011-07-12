var contextmenu_timer;
var contextmenu_pos;

function contextmenu_rightclick(e) {
  clearTimeout(contextmenu_timer);

  var e = (e) ? e : ((window.event) ? window.event : "");
  if (e.pageX || e.pageY) {
    var posx = e.pageX;
    var posy = e.pageY;
  }
  else if (e.clientX || e.clientY) {
    var posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  var map_div=document.getElementById("map");
  var offsetx = map_div.offsetLeft;
  var offsety = map_div.offsetTop;

  contextmenu_pos=map.getLonLatFromPixel(new OpenLayers.Pixel(posx-offsetx, posy-offsety)).transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));

  var contextmenu=document.getElementById("contextmenu");
  contextmenu.style.display="block";
  var contextWidth = contextmenu.offsetWidth;
  var contextHeight = contextmenu.offsetHeight;
  var contextmenu_pointer = document.getElementById("contextmenu_pointer");
  if(posx >= (window.innerWidth-contextWidth)) {
    posx-=contextWidth;
    contextmenu_pointer.style.borderLeft="none";
    contextmenu_pointer.style.borderRight="2px solid black";
    contextmenu_pointer.style.left="";
    contextmenu_pointer.style.right="-2px";
  } else {
    contextmenu_pointer.style.borderLeft="2px solid black";
    contextmenu_pointer.style.borderRight="none";
    contextmenu_pointer.style.left="-2px";
    contextmenu_pointer.style.right="";

  }
  if(posy >= (window.innerHeight-contextHeight)) {
    posy-=contextHeight;
    contextmenu_pointer.style.borderTop="none";
    contextmenu_pointer.style.borderBottom="2px solid black";
    contextmenu_pointer.style.top="";
    contextmenu_pointer.style.bottom="-2px";
  } else {
    contextmenu_pointer.style.borderTop="2px solid black";
    contextmenu_pointer.style.borderBottom="none";
    contextmenu_pointer.style.top="-2px";
    contextmenu_pointer.style.bottom="";
  }
  contextmenu.style.top=posy+"px";
  contextmenu.style.left=posx+"px";
}

function contextmenu_mouseout(e) {
  var e = (e) ? e : ((window.event) ? window.event : "");
  var reltar = (e.relatedTarget) ? e.relatedTarget : e.toElement;
  var contextmenu=document.getElementById("contextmenu");

  if (typeof(contextmenu.contains)=="object") {
    var nu = !(contextmenu.contains(reltar));
  } else {
    var nu = !!(contextmenu.compareDocumentPosition(reltar)&2);
  }

  if (nu) {
    contextmenu_timer=window.setTimeout("document.getElementById('contextmenu').style.display='none'",500);
  }
}

// hide the context menu
function contextmenu_hide() {
  document.getElementById('contextmenu').style.display='none';
}

function contextmenu_entry(cell, options, fun) {
  // contextmenu_fire is called, when entry is selected in list
  this.contextmenu_fire=function() {
    // called saved function
    this.fun(contextmenu_pos);

    // hide the contextmenu
    contextmenu_hide();
  }

  // constructor
  this.fun=fun;
  this.cell=cell;
  this.options=options;

  // create entry in menu
  cell.onclick=this.contextmenu_fire.bind(this);
  cell.innerHTML="<img src=\""+this.options.img+"\" border=\"0\" title=\"\"> "+this.options.text;
}

function contextmenu_add(img, text, fun, options) {
  // add a row to the table of the contextmenu
  var tab=document.getElementById("contextmenu_table");
  var row=tab.insertRow(tab.rows.length);
  var cell=document.createElement("td");
  cell.className="contextmenu_entry";
  row.appendChild(cell);

  if(!options)
    options={};
  options.img=img;
  options.text=text;

  // create the entry as a contextmenu_entry
  var entry=new contextmenu_entry(cell, options, fun);

  // return entry
  return entry;
}

function contextmenu_init() {
  map.div.oncontextmenu = function noContextMenu(e) {
    contextmenu_rightclick(e);
    return false; //cancel the right click of brower
  };
}

register_hook("init", contextmenu_init);