#pragma strict

var Mygestore        : gestore;
var txt_puntiGame    : UnityEngine.UI.Text;
var txt_puntiRec     : UnityEngine.UI.Text;


function FixedUpdate () {
  if  (Mygestore.PuntiPartita>Mygestore.lastrecords) {Mygestore.lastrecords=Mygestore.PuntiPartita;}
     
  txt_puntiGame.text = Mygestore.PuntiPartita.ToString("n0");
  txt_puntiRec.text = Mygestore.lastrecords.ToString("n0");

}