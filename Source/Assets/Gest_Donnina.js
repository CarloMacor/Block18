#pragma strict

var MyGestore  : gestore;
var tipo       : int;
var leImgOver  : UnityEngine.UI.Image[];
var leobjOver  : GameObject[];


function imposta(fase2 : int, fase3 : int) {
var i : int;
var locfase2 = fase2;
// Debug.Log("F2 "+fase2+" " +fase3);
 switch (tipo) {
  case 1 :
    if (locfase2>=4) {locfase2=3;}
    for (i=0; i<5; i++) {leobjOver[i].SetActive(true); leImgOver[i].color.a =1.0f; }   
    for (i=0; i<locfase2; i++) {leobjOver[i].SetActive(false);}  
    if (fase2<4) {leImgOver[locfase2].color.a =1.0f-0.18f*fase3;} else {leImgOver[locfase2].color.a = 0.0f;}
//    Debug.Log("alpha "+leImgOver[locfase2].color.a );
   break;
  case 2 : 
    if (locfase2>=3) {locfase2=2;}
    for (i=0; i<4; i++) {leobjOver[i].SetActive(true); leImgOver[i].color.a =1.0f;}   
    for (i=0; i<locfase2; i++) {leobjOver[i].SetActive(false);}   
    if (fase2<3) {leImgOver[locfase2].color.a =1.0f-0.18f*fase3;} else {leImgOver[locfase2].color.a = 0.0f;}
  break;
 }
}