#pragma strict

var Mygestore    : gestore;
var MyGest_righe : Gest_Righe;
var tipo      : int;
var laimg     : UnityEngine.UI.Image;
var posxMod   : int;
var posx      : float;
var posy      : float;
var modrot    : int;
var offModx   : int;
var offMoUp   : int;
var indcolore : int;




function soteggiaColore() {
 indcolore = Random.Range(1,8);
 switch (indcolore) {
  case 0 : laimg.color = Color.white;  break;
  case 1 : laimg.color = Color.green;  break;
  case 2 : laimg.color = Color.red;  break;
  case 3 : laimg.color = Color.cyan;  break;
  case 4 : laimg.color = Color(0.0,0.5,1.0,1.0);  break;
  case 5 : laimg.color = Color.yellow;  break;
  case 6 : laimg.color = Color(1.0,0.5,0.0,1.0);  break;
  case 7 : laimg.color = Color.magenta;  break;
 }
}

function accendi() {this.gameObject.SetActive(true);}

function spegni()  {this.gameObject.SetActive(false);}

function posiziona() {
 this.gameObject.transform.position.x = Mygestore.x1+(posxMod+offModx)*Mygestore.Wped;
 this.gameObject.transform.position.y = posy+offMoUp*Mygestore.Hped;
}



function azzeraRot() {
  modrot =0;  offModx=0;  offMoUp=0;  eseguirot();
}

function eseguirot() {
// Debug.Log("R "+modrot+" T="+tipo);
 if  (modrot ==0) { offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z=0.0; }
 switch (tipo) {
  case 1 :  // ##
    switch (modrot) {
     case 1 : case 3 :  offModx=1;  offMoUp=0; this.gameObject.transform.eulerAngles.z=90.0; break;
     case 2 :           offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 0.0; break;
    }   break;

  case 2 :  // ###
    switch (modrot) {
     case 1 : case 3 :  offModx=1;  offMoUp=0; this.gameObject.transform.eulerAngles.z=90.0; break;
     case 2 :           offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 0.0; break;
    }   break;

  case 3 :  // ####
    switch (modrot) {
     case 1 : case 3 :  offModx=1;  offMoUp=0; this.gameObject.transform.eulerAngles.z=90.0; break;
     case 2 :           offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 0.0; break;
    }   break;
  
  case 4 :  // #####
    switch (modrot) {
     case 1 : case 3 :  offModx=1;  offMoUp=0; this.gameObject.transform.eulerAngles.z=90.0; break;
     case 2 :           offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 0.0; break;
    }   break;

  case 5 :  // ##
            //  ##
    switch (modrot) {
     case 1 :  case 3 : offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z=  0.0; break;
    }   break;

  case 6 : case 7 : // ##     ##
                    //  #     #
    switch (modrot) {
     case 1 :  offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=2;  offMoUp=2; this.gameObject.transform.eulerAngles.z=180.0; break;
     case 3 :  offModx=0;  offMoUp=2; this.gameObject.transform.eulerAngles.z=270.0; break;
    }   break;
      
  case 8 :  // ###
            //   #
    switch (modrot) {
     case 1 :  offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=3;  offMoUp=2; this.gameObject.transform.eulerAngles.z=180.0; break;
     case 3 :  offModx=0;  offMoUp=3; this.gameObject.transform.eulerAngles.z=270.0; break;
    }   break;
                  
  case 9 :  // ###
            // #
    switch (modrot) {
     case 1 :  offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=3;  offMoUp=2; this.gameObject.transform.eulerAngles.z=180.0; break;
     case 3 :  offModx=0;  offMoUp=3; this.gameObject.transform.eulerAngles.z=270.0; break;
    }   break;

  case 10: case 12: case 13: case 14:  // ###   ###   ###   ###
                                       // # #   ###   ##     ##
    switch (modrot) {
     case 1 :  offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=3;  offMoUp=2; this.gameObject.transform.eulerAngles.z=180.0; break;
     case 3 :  offModx=0;  offMoUp=3; this.gameObject.transform.eulerAngles.z=270.0; break;
    }   break;

  case 11 :    // ##
               // ##
    switch (modrot) {
     case 1 : case 2 : case 3 : offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 0.0; break;
    }   break;
    
  case 15 :  //  #
            //  ###
    switch (modrot) {
     case 1 :  offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=3;  offMoUp=1; this.gameObject.transform.eulerAngles.z=180.0; break;
     case 3 :  offModx=0;  offMoUp=2; this.gameObject.transform.eulerAngles.z=270.0; break;
    }   break;
                                    
  case 16 :  //  ##
            //  ##
    switch (modrot) {
     case 1 :  case 3 : offModx=2;  offMoUp=0; this.gameObject.transform.eulerAngles.z= 90.0; break;
     case 2 :  offModx=0;  offMoUp=0; this.gameObject.transform.eulerAngles.z=  0.0; break;
    }   break;

                                                                                                                                                                                                        
 }
 AggiustaModx();
 posiziona();
}

function ruotaPz(verso : int) {
 if (verso>0) {modrot++;} else {modrot--;}
 if (modrot>3) {modrot=0;}   if (modrot<0) {modrot=3;}
 eseguirot();
}


function AggiustaModx() {
 if (posxMod<0) {posxMod=0;}
 if (posxMod>9) {posxMod=9;}
 switch (tipo) {
  case 1 : // ##
    switch (modrot) {
     case 0 : case 2 : if (posxMod>8) {posxMod=8;}    break;
    }  break;

  case 2 : // ###
    switch (modrot) {
     case 0 : case 2 : if (posxMod>7) {posxMod=7;}    break;
    }  break;

  case 3 : // ####
    switch (modrot) {
     case 0 : case 2 : if (posxMod>6) {posxMod=6;}    break;
    }  break;
 
  case 4 : // #####
    switch (modrot) {
     case 0 : case 2 : if (posxMod>5) {posxMod=5;}    break;
    }  break;

  case 5 : // ##
           //  ##
    switch (modrot) {
     case 0 : case 2 : if (posxMod>7) {posxMod=7;}    break;
     case 1 : case 3 : if (posxMod>8) {posxMod=8;}    break;
    }  break;
   
  case 6 : case 7 : // ##   ##
                    //  #   #
    switch (modrot) {
     case 0 : case 1 : case 2 : case 3 : if (posxMod>8) {posxMod=8;}    break;
    }  break;

  case 8 : // ###
           //   #
    switch (modrot) {
     case 0 :  if (posxMod>7) {posxMod=7;}    break;
     case 1 :  if (posxMod>8) {posxMod=8;}    break;
     case 2 :  if (posxMod>7) {posxMod=7;}    break;
     case 3 :  if (posxMod>8) {posxMod=8;}    break;
    }  break;

  case 9 : // ###
           // #
    switch (modrot) {
     case 0 :  if (posxMod>7) {posxMod=7;}    break;
     case 1 :  if (posxMod>8) {posxMod=8;}    break;
     case 2 :  if (posxMod>7) {posxMod=7;}    break;
     case 3 :  if (posxMod>8) {posxMod=8;}    break;
    }  break;
                  
  case 10: case 12: case 13: case 14:// ###   ###   ###    ###
                                     // # #   ###   ##      ##
    switch (modrot) {
     case 0 :  if (posxMod>7) {posxMod=7;}    break;
     case 1 :  if (posxMod>8) {posxMod=8;}    break;
     case 2 :  if (posxMod>7) {posxMod=7;}    break;
     case 3 :  if (posxMod>8) {posxMod=8;}    break;
    }  break;

  case 11: // ###
           // # #
    switch (modrot) {
     case 0 : case 1 : case 2 : case 3 :  if (posxMod>8) {posxMod=8;}    break;
    }  break;
             
                                    
  case 15 : //  #
           //  ###
    switch (modrot) {
     case 0 :  if (posxMod>7) {posxMod=7;}    break;
     case 1 :  if (posxMod>8) {posxMod=8;}    break;
     case 2 :  if (posxMod>7) {posxMod=7;}    break;
     case 3 :  if (posxMod>8) {posxMod=8;}    break;
    }  break;                                                                                  
    
  case 16 : //  ##
           //  ##
    switch (modrot) {
     case 0 : case 2 : if (posxMod>7) {posxMod=7;}    break;
     case 1 : case 3 : if (posxMod>8) {posxMod=8;}    break;
    }  break;                                                                                                            
                                                                                                                                                                                                                                                                                                                            
 }
 
}


function spostaSxDx(modo : int) {
 var oldposxMod : int = posxMod;
 var spostato1 : boolean = false;
 if (modo==1) { posxMod --; }  if (modo==2) { posxMod ++; }
 AggiustaModx();
 if (oldposxMod!=posxMod) {spostato1 = true; }
 if (spostato1) {
  Mygestore.inpausaSXDX=true;
  if (MyGest_righe.testContactSxDx()) {posxMod=oldposxMod; }
  
  Mygestore.inpausaSXDX=false;
 }
 posiziona();
}
