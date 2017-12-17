#pragma strict

var MyGestore   : gestore;
var MyGestPezzi : Gest_Pezzi;
var indriga   : int;
var objriga   : GameObject[];
var imgriga   : UnityEngine.UI.Image[];
var coloririga : int[];
private var x1 : float;
private var x2 : float;
private var y1 : float;
private var y2 : float;
private var Hped : float;
private var Wped : float;

function Inizializza() {
 x1 = MyGestore.baseBlocks.transform.position.x;
 y1 = MyGestore.baseBlocks.transform.position.y;
 y2 = MyGestore.rifHBlocks.transform.position.y;
 x2 = MyGestore.rifLBlocks.transform.position.x;
 
 Hped = (y2-y1)/20.0;
 Wped = (x2-x1)/10.0;
 
//  Debug.Log("x1 _ "+x1);  Debug.Log("x2 _ "+x2);  Debug.Log("y1 _ "+y1);  Debug.Log("y2 _ "+y2);
  
  for (var i=0; i<objriga.length; i++) {
//   objriga[i].RectTransform.
  
   objriga[i].transform.position.y=y1+indriga*Hped;
   objriga[i].transform.position.x=x1+i*Wped;
   imgriga[i].color = MyGestore.dammicolore(0);
   coloririga[i]=0;
   objriga[i].SetActive(false);
  }
}

function dimmiY() : float {
 return objriga[0].transform.position.y+Hped/2.0;
}

function testoccupato(ind : int) {
 var res : boolean= false;
   if (objriga[ind].activeSelf) { res = true; }
 return res;
}

function completa() : boolean {
 var res : boolean = true;
  for (var i=0; i<objriga.length; i++) { if (!objriga[i].activeSelf) {res = false;} }
 return res;
}

function innestapos(ind : int) {
 objriga[ind].SetActive(true);
 imgriga[ind].color = MyGestore.dammicolore(MyGestPezzi.pezzocorrente.indcolore);
 coloririga[ind]=MyGestPezzi.pezzocorrente.indcolore;
}

function sbianca() {
  for (var i=0; i<imgriga.length; i++) { imgriga[i].color = Color.white;  }
}

function trasparenta(trasp : float) {
  for (var i=0; i<imgriga.length; i++) { imgriga[i].color.a = trasp;  }
}


function resettariga() {
 for (var i=0; i<objriga.length; i++) { objriga[i].SetActive(false);}
}

