#pragma strict
import System.IO;

var menuobj     : GameObject;
var gameobj     : GameObject;

var exitPannello     : GameObject;
var gameoverPannello : GameObject;
var PanGetBoostObj   : GameObject;

var baseBlocks  : GameObject;
var rifHBlocks  : GameObject;
var rifLBlocks  : GameObject;

var MyGest_Righe  : Gest_Righe;
var MyGest_Pezzi  : Gest_Pezzi;

var Donnina1  : GameObject;
var Donnina2  : GameObject;

var RifDxUp   : GameObject;
var RifDxDown : GameObject;
var imgOverDx : UnityEngine.UI.Image;
var txtfase1Dx : UnityEngine.UI.Text;
private var DeltaYDx : float;
var Gest_Donnina1 : Gest_Donnina;
var Gest_Donnina2 : Gest_Donnina;

var x1 : float;
var x2 : float;
var y1 : float;
var y2 : float;
var Hped : float;
var Wped : float;
var velocita    : float;
var velocitamin : float;
var velocitamax : float;
var deltavelocita : float;
var inpausaGame : boolean;
var inpausaRiga : boolean;
var inpausaSXDX : boolean;
var inpausaBoost2 : boolean;
var inpausaGameOver : boolean;


var PuntiPartita : int;
// var MyRecords    : int[];
var lastrecords  : int;
var lastPunteggio : int;
var MyDateRecords : String[];
var lastDatePunteggio : String;

var fase1        : int;
var fase2        : int;
var fase3        : int;

var BonusPointsObj : GameObject[];
var BonusPointsTxt : UnityEngine.UI.Text[];
var botGoOn        : GameObject;

var soundOn        : boolean;
var botSound       : GameObject;

var records        : int[];
var datarecords    : String[];
var PanRecordObj   : GameObject;
var MyGest_panRecords : Gest_panRecords;

var imgvelsotto    : UnityEngine.UI.Image;
var imgvelrossa    : UnityEngine.UI.Image;
private var Deltavelimg : float;
private var Hvelimg     : float;
var numBoosts           : int;
var botContinuaBoosts   : UnityEngine.UI.Button;
var botUsaBoosts1       : UnityEngine.UI.Button;
var botUsaBoosts2       : UnityEngine.UI.Button;
var botGameOverAccept   : UnityEngine.UI.Button;
// var txtBoostsavailable  : UnityEngine.UI.Text;
var txtBoostOnBut       : UnityEngine.UI.Text;
var txtBoostOnmenu      : UnityEngine.UI.Text;
var GameOvered          : boolean = true;
var botMenu             : UnityEngine.UI.Button[];

var LiSounder           : AudioSource[];



function Start () {
  exitPannello.SetActive(false);
  gameoverPannello.SetActive(false);
  PanRecordObj.SetActive(false);
  PanGetBoostObj.SetActive(false);
  menuobj.SetActive(true);
  gameobj.SetActive(false);
  
  
  
  numBoosts = 5;
  txtBoostOnBut.text = ""+numBoosts;
  txtBoostOnmenu.text = ""+numBoosts;

  togliBonusptGrafici();
  DeltaYDx = RifDxUp.transform.position.y-RifDxDown.transform.position.y;
//  Debug.Log("Y  "+DeltaYDx);  Debug.Log("Y0 "+RifDxDown.transform.position.y);  Debug.Log("Y1 "+RifDxUp.transform.position.y);

  impostavelocita();



  Deltavelimg = imgvelsotto.rectTransform.rect.width;
  Hvelimg      = imgvelsotto.rectTransform.rect.height;
  UpdateBarraVel();

  updateDX();

//  Debug.Log("x1 "+baseBlocks.transform.position.x);  Debug.Log("x2 "+rifLBlocks.transform.position.x);
//  Debug.Log("y1 "+baseBlocks.transform.position.y);  Debug.Log("y2 "+rifHBlocks.transform.position.y);

 x1 = baseBlocks.transform.position.x;
 y1 = baseBlocks.transform.position.y;
 y2 = rifHBlocks.transform.position.y;
 x2 = rifLBlocks.transform.position.x;
 
 Hped = (y2-y1)/20.0;
 Wped = (x2-x1)/10.0;

 inpausaGame = false;
 botGoOn.SetActive(false);
 inpausaSXDX = false;
 inpausaRiga = false;
 inpausaBoost2 = false;
 inpausaGameOver= false;
 
 PuntiPartita = 0;
 lastrecords  = records[0];
 
 MyGest_Righe.InizializzaRighe();
 
 restFasi();
 soundOn = true; botSound.SetActive(true);
 
 ApriGame();
 ApriRecords();

 lastrecords  = records[0];
 impostavelocita();
 
 updateDX();
  
 if (GameOvered) {botMenu[1].interactable=false;} else {botMenu[1].interactable=true;}
 
}

function impostavelocita() {
 if (fase1<2) {
   velocitamin = DeltaYDx/ 4.2f;
   velocitamax = velocitamin*1.9f;
   deltavelocita = (velocitamax-velocitamin)/40.0f;
   velocita = velocitamin;
//   Debug.Log("V "+velocita);
  }
  else
 {
   velocitamin = DeltaYDx/ 3.8f;
   velocitamax = velocitamin*2.0f;
   deltavelocita = (velocitamax-velocitamin)/30.0f;
   velocita = velocitamin;
  }  
}


function IncrementaVel() {
Debug.Log("V up "+velocita);
 velocita = velocita+deltavelocita;
 if (velocita>velocitamax) {velocita=velocitamax;}
 UpdateBarraVel();
}

function UpdateBarraVel() {
 var param : float = (velocita-velocitamin)/(velocitamax-velocitamin);
 imgvelrossa.rectTransform.sizeDelta.x = param*Deltavelimg;
// Debug.Log("Z2 "+param*Deltavelimg);

}


function cambiatonumBoost() {
  txtBoostOnBut.text = ""+numBoosts;
  txtBoostOnmenu.text = ""+numBoosts;
 // txtBoostsavailable.text = ""+numBoosts;
}  


function AzzeraVel() {
  velocita = velocitamin;
  UpdateBarraVel();
}

function testIncF3() {
 fase3++; updateDX();
}

function togliBonusptGrafici() {
 var i : int;
 for (i=0; i<BonusPointsObj.length; i++) { BonusPointsObj[i].SetActive(false); }
}

function updateDX() {
 var don1 : boolean = true;
 var ddDonnina : int = 5;
 if (fase3>ddDonnina)       {fase2++; fase3 = fase3-ddDonnina;  }
 if ((fase1 % 2)==1) {don1 = true;} else {don1 = false;}
 if (don1) { if (fase2>4) { fase1++; fase2=0; fase3 =0; } }
      else { if (fase2>3) { fase1++; fase2=0; fase3 =0; } }
 if ((fase1 % 2)==1) {don1 = true;} else {don1 = false;}
 if (don1) {Donnina1.SetActive(true); Donnina2.SetActive(false); Gest_Donnina1.imposta(fase2,fase3); } 
      else {Donnina1.SetActive(false); Donnina2.SetActive(true); Gest_Donnina2.imposta(fase2,fase3);}
 
 imgOverDx.transform.localScale.y = (fase3/(ddDonnina*1.0f));
 txtfase1Dx.text = ""+fase1;
}

function restFasi() {
 fase1 = 1; fase2 =0; fase3 =0;
 updateDX();
}

function OpenPannelloGetBoost(modo : boolean) {
 PanGetBoostObj.SetActive(modo);
}

function GotoMenu() {
 if (!inpausaGameOver) {
  inpausaGame = true;
  menuobj.SetActive(true);
  gameobj.SetActive(false);
  if (GameOvered) {botMenu[1].interactable=false;} else {botMenu[1].interactable=true;}
 }
 Salvatutto();
}

function ResumeGame() {
 inpausaGame = true;
 botGoOn.SetActive(true);
 menuobj.SetActive(false);
 gameobj.SetActive(true);
// ApriGame();
}

function NewGame() {
 PuntiPartita = 0;
 restFasi();
 lastrecords  = records[0];
 
// fase1=2; impostavelocita();

 updateDX();
// inpausaGame  = true;  botGoOn.SetActive(true);
 MyGest_Righe.resetPanel();
 MyGest_Pezzi.IntroduciNuovopezzo();
 menuobj.SetActive(false);
 gameobj.SetActive(true);
 gameoverPannello.SetActive(false);
 GameOvered = false;
 
 inpausaGame     = false;
 inpausaRiga     = false;
 inpausaSXDX     = false;
 inpausaBoost2    = false;
 inpausaGameOver = false;
 botGoOn.SetActive(false);
 
 Salvatutto();
}

function GoOn() {
 inpausaGame = false;
 botGoOn.SetActive(false);
}


function Update () {
 if (Input.GetKey(KeyCode.Escape)) {openExitPanel(); }  //  MyGestorePannelli.ApripanExit();
}

function mettimapusa() {
 if (!inpausaGameOver) {
  inpausaGame = true;
  botGoOn.SetActive(true);
 } 
 Salvatutto();
}


function chiudiProgramma() {   Salvatutto();   Application.Quit();  }	

function Salvatutto() {
 SalvaRecords();
 SalvaGame();
} 

function dammicolore(ind : int) : Color {
 var res : Color;
  switch(ind) {
  case 0 : res = Color.white;  break;
  case 1 : res = Color.green;  break;
  case 2 : res = Color.red;  break;
  case 3 : res = Color.cyan;  break;
  case 4 : res = Color(0.0,0.5,1.0,1.0);  break;
  case 5 : res = Color.yellow;  break;
  case 6 : res = Color(1.0,0.5,0.0,1.0);  break;
  case 7 : res = Color.magenta;  break;
 }
 return res;
}

public function SoundOn() {
 soundOn = true; botSound.SetActive(true);
}

public function SoundOff() {
 soundOn = false; botSound.SetActive(false);
}




 // -------------------------------------------


function SalvaRecords() {
 var filePath : String = "";
   #if UNITY_EDITOR
    filePath = "record.txt";
   #endif
   #if UNITY_IPHONE
    filePath =  Application.persistentDataPath +"/record.txt";
   #endif   
   #if UNITY_ANDROID
    filePath =  Application.persistentDataPath +"/record.txt";
   #endif   
   if (filePath!="")  {
    var sw : StreamWriter = new StreamWriter(filePath); 
    sw.WriteLine(""+lastPunteggio);  
    sw.WriteLine(""+lastDatePunteggio);  
     for (var i=0; i<records.length; i++) { sw.WriteLine(""+records[i]);  sw.WriteLine(""+datarecords[i]);}
    sw.Flush();    sw.Close();  // attualmente fisso ad Ita
   }
}

function ApriRecords() {
var filePath : String = "";
   #if UNITY_EDITOR
    filePath = "record.txt";
   #endif
   #if UNITY_IPHONE
    filePath =  Application.persistentDataPath +"/record.txt";
   #endif   
   #if UNITY_ANDROID
    filePath =  Application.persistentDataPath +"/record.txt";
   #endif   
   if (System.IO.File.Exists(filePath)) {
     var sr : StreamReader = new StreamReader(filePath);   
     if (sr!=null) {
      var line : String ;
      line = sr.ReadLine();  lastPunteggio     = int.Parse(line);
      lastDatePunteggio = sr.ReadLine();
       for (var i=0; i<records.length; i++) { line = sr.ReadLine();  records[i]     = int.Parse(line);
                                              line = sr.ReadLine();  datarecords[i] = line; }
      sr.Close();
     }
   }
//      Debug.Log("Open Records");

}
 // -------------------------------------------

public function SalvaGame() {
 var filePath : String = "";
   #if UNITY_EDITOR
    filePath = "game.txt";
   #endif
   #if UNITY_IPHONE
    filePath =  Application.persistentDataPath +"/game.txt";
   #endif   
   #if UNITY_ANDROID
    filePath =  Application.persistentDataPath +"/game.txt";
   #endif   
   if (filePath!="")  {
    var sw : StreamWriter = new StreamWriter(filePath); 
      sw.WriteLine(""+PuntiPartita);
      sw.WriteLine(""+fase1);
      sw.WriteLine(""+fase2);
      sw.WriteLine(""+fase3);
      sw.WriteLine(""+GameOvered);
      sw.WriteLine(""+soundOn);
      sw.WriteLine(""+numBoosts);
     for (var i=0; i<20; i++) { 
      sw.WriteLine(""+MyGest_Righe.dammivalriga(i));
      sw.WriteLine(""+MyGest_Righe.dammicoloririga1(i));
      sw.WriteLine(""+MyGest_Righe.dammicoloririga2(i));
     }
    sw.Flush();    sw.Close();  // attualmente fisso ad Ita
   
   }
  
}

function ApriGame() {
var filePath : String = "";
var locval : int;
   #if UNITY_EDITOR
    filePath = "game.txt";
   #endif
   #if UNITY_IPHONE
    filePath =  Application.persistentDataPath +"/game.txt";
   #endif   
   #if UNITY_ANDROID
    filePath =  Application.persistentDataPath +"/game.txt";
   #endif   
   if (System.IO.File.Exists(filePath)) {
     var sr : StreamReader = new StreamReader(filePath);   
     if (sr!=null) {
        MyGest_Righe.resetPanel();
        MyGest_Pezzi.IntroduciNuovopezzo();
     
     
      var line : String ;
      line = sr.ReadLine();  PuntiPartita = int.Parse(line);
      line = sr.ReadLine();  fase1 = int.Parse(line);
      line = sr.ReadLine();  fase2 = int.Parse(line);
      line = sr.ReadLine();  fase3 = int.Parse(line);
      line = sr.ReadLine();  GameOvered = boolean.Parse(line);
      line = sr.ReadLine();  soundOn = boolean.Parse(line);
      line = sr.ReadLine();  numBoosts = int.Parse(line);
      
      for (var i=0; i<20; i++) { 
        line = sr.ReadLine();  locval = int.Parse(line);
        MyGest_Righe.assegnavalriga(i,locval);
        line = sr.ReadLine();  locval = int.Parse(line);
        MyGest_Righe.assegnacoloreriga1(i,locval);
        line = sr.ReadLine();  locval = int.Parse(line);
        MyGest_Righe.assegnacoloreriga2(i,locval);
      }      
      sr.Close();
     }
     updateDX();
     cambiatonumBoost();
     if (soundOn) {SoundOn();} else {SoundOff();}     
   }
   
//   Debug.Log("Open game");
}

 // -------------------------------------------

function apriPanRecords(){
 PanRecordObj.SetActive(true);
 MyGest_panRecords.AttivaPanRecords();
}

function apriPanRecordsdaGameOver(){
 inpausaGameOver = false;
 GameOvered = true;
 GotoMenu(); 
 lastPunteggio = PuntiPartita;
 introduciRecord(lastPunteggio);
  // settare ultimo punteggio partita
  // e dire che e' finita la partita al gioco
 apriPanRecords();
 
}


public function chiudigameOverBoosts() {
  inpausaGameOver= false;
  gameoverPannello.SetActive(false);
}

function aprigameOverBoosts(modo : boolean) {
 if (!inpausaGameOver) {
  inpausaGameOver= true;
  gameoverPannello.SetActive(true);
  botContinuaBoosts.interactable = modo;
  botGameOverAccept.gameObject.SetActive(!modo);
//  txtBoostsavailable.text = ""+ numBoosts;
  if (numBoosts>0) {botUsaBoosts1.interactable =true;} else {botUsaBoosts1.interactable = false;}
  if (numBoosts>1) {botUsaBoosts2.interactable =true;} else {botUsaBoosts2.interactable = false;}
 }
}



function chiudiPanRecords(){
 PanRecordObj.SetActive(false);
}

function introduciRecord(valore : int) {
 var introdotto : boolean = false;
 for (var i=9; i>=0; i--) {
  if (valore>records[i]) {
    introdotto = true;
    if (i<9) { records[i+1] = records[i]; datarecords[i+1] = datarecords[i]; }
    records[i] = valore;
    datarecords[i] =   System.DateTime.Now.ToString("MM/dd/yy");
    lastDatePunteggio = datarecords[i];

  }
 }
 if (introdotto) {apriPanRecords();}
 Salvatutto();
}


public function usaboosts(numb : int) {
  chiudigameOverBoosts();
  if (numb ==  5) { numBoosts = numBoosts -1; }
  if (numb == 10) { numBoosts = numBoosts -2; }
  cambiatonumBoost();
  Salvatutto();
  MyGest_Righe.boostaRiga(numb);
}

public function Rater() {
 #if UNITY_IPHONE
      Application.OpenURL("http://itunes.com/apps/carlomacor");
 #endif
 #if UNITY_ANDROID 
      Application.OpenURL("market://details?id=com.macormap.block18plus");    
 #endif
}

public function openExitPanel() {
  exitPannello.SetActive(true);
}


public function closeExitPanel() {
  exitPannello.SetActive(false);
}

public function escidalgioco() {
 chiudiProgramma();
}

function VistoVideo1(ind : int) {
 PanGetBoostObj.SetActive(false);
 numBoosts = numBoosts+5;
 cambiatonumBoost();
 chiudigameOverBoosts();
 mettimapusa();
  Salvatutto();
// Debug.Log("Vedo video 1 ");
//  txtBoostsavailable.text = ""+ numBoosts;
  if (numBoosts>0) {botUsaBoosts1.interactable =true;} else {botUsaBoosts1.interactable = false;}
  if (numBoosts>1) {botUsaBoosts2.interactable =true;} else {botUsaBoosts2.interactable = false;}
 
 
}

function Acquisto1(ind : int) {
 PanGetBoostObj.SetActive(false);
 numBoosts = numBoosts+500;
 cambiatonumBoost();
 chiudigameOverBoosts();
 mettimapusa();
  Salvatutto();
 Debug.Log("Acquistato 1 ");
//  txtBoostsavailable.text = ""+ numBoosts;
  if (numBoosts>0) {botUsaBoosts1.interactable =true;} else {botUsaBoosts1.interactable = false;}
  if (numBoosts>1) {botUsaBoosts2.interactable =true;} else {botUsaBoosts2.interactable = false;}

}

function suonaInd(ind : int) {
  if (soundOn) {LiSounder[ind].Play();}
}


