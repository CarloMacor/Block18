#pragma strict

var Mygestore        : gestore;
var MyGest_righe     : Gest_Righe;
var LiPezzi          : LoPezzo[];
var indpezzocorrente : int =0;
var pezzocorrente    : LoPezzo;
var nextpezzo        : LoPezzo;
var attivo           : boolean=false;
var superdown        : boolean;
var righefatteSuper  : int;

var objBonusDown     : GameObject;
var txtBonusDown     : UnityEngine.UI.Text;

private var deltaTimeBonus : float = 0.5;
private var TimeBonus      : float = 0.0;
private var vedoBonusdown  : boolean = false;





function IntroduciNuovopezzo() {
 superdown = false;  righefatteSuper = 0; 
 indpezzocorrente= Random.Range(0,16);
 // indpezzocorrente= 15;
 for (var i=0; i<LiPezzi.length; i++) {LiPezzi[i].spegni();}
 pezzocorrente = LiPezzi[indpezzocorrente];
 pezzocorrente.soteggiaColore();
 pezzocorrente.accendi();
 poscorrenteIniziale();
}


function testconnext() {
 MyGest_righe.resetPanel();
// indpezzocorrente = 13;
 pezzocorrente = LiPezzi[indpezzocorrente];
 pezzocorrente.accendi();
 poscorrenteIniziale();
}


function Attivasuperdown() {
 superdown = true; objBonusDown.SetActive(true); vedoBonusdown = true; TimeBonus = 0.0; txtBonusDown.text = "+"+(righefatteSuper+(Mygestore.fase1-1)*4); 
}

function Update () {
 if (Mygestore.inpausaGame) { return; }
 if (Mygestore.inpausaRiga) { return; }
 if (Mygestore.inpausaSXDX) { return; }
 if (Mygestore.inpausaGameOver) { return; }
 
 
 
 if (attivo) {
  if (superdown) {pezzocorrente.posy = pezzocorrente.posy-Mygestore.Hped; righefatteSuper++; TimeBonus=0.0; txtBonusDown.text = "+"+(righefatteSuper+(Mygestore.fase1-1)*4);  }
            else {pezzocorrente.posy = pezzocorrente.posy-Time.deltaTime*Mygestore.velocita;}
  pezzocorrente.posiziona();
  // test contatto con il fondo
  MyGest_righe.ContattoRighe();
 }
 else   poscorrenteIniziale();
 
  if (vedoBonusdown) {
   TimeBonus = TimeBonus + Time.deltaTime; 
   if (TimeBonus> deltaTimeBonus) {
    vedoBonusdown= false; objBonusDown.SetActive(false); 
//    if (Mygestore.inpausaBoost) Debug.Log("B");
    Mygestore.PuntiPartita = Mygestore.PuntiPartita + (righefatteSuper+(Mygestore.fase1-1)*4);  
   }
  }

}

function poscorrenteIniziale() {
 if (pezzocorrente==null) {return;}
 pezzocorrente.azzeraRot();
 MyGest_righe.rigacontrollata= 21;
// Debug.Log("Iniz "+pezzocorrente.tipo);
 
 switch (pezzocorrente.tipo) {
  case 1 : case 2 : pezzocorrente.posxMod = 5; break;
  case 3 : case 4 : pezzocorrente.posxMod = 3; break;
  case 5 : case 6 : case 7 :  pezzocorrente.posxMod = 4; break;
  case 8 :  pezzocorrente.posxMod = 3; break;
  case 9 :  pezzocorrente.posxMod = 4; break;
  case 10:  pezzocorrente.posxMod = 4; break;
  case 11:  pezzocorrente.posxMod = 5; break;
  case 12: case 13: case 14:   pezzocorrente.posxMod = 4; break;
  case 15:  pezzocorrente.posxMod = 3; break;
  case 16:  pezzocorrente.posxMod = 3; break;
  default :   pezzocorrente.posxMod = 0; break;
 }
 
 pezzocorrente.posy = Mygestore.y2;
 pezzocorrente.posx = Mygestore.x1+pezzocorrente.posxMod*Mygestore.Wped;
 pezzocorrente.posiziona();
 if (pezzocorrente.posy>0) {attivo = true;}
}

function pezzoToSx() {
 if (Mygestore.inpausaGameOver) {return;}
 if (pezzocorrente==null) {return;} pezzocorrente.spostaSxDx(1); 
}

function pezzoToDx() {
 if (Mygestore.inpausaGameOver) {return;}
 if (pezzocorrente==null) {return;} pezzocorrente.spostaSxDx(2); 
}

function RuotaSx()   {
 if (Mygestore.inpausaGameOver) {return;}
 if (pezzocorrente==null) {return;} pezzocorrente.ruotaPz(1);    
}

function RuotaDx()   {
 if (Mygestore.inpausaGameOver) {return;}
 if (pezzocorrente==null) {return;} pezzocorrente.ruotaPz(-1);   
}

