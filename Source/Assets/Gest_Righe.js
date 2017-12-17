#pragma strict

var MyGestore      : gestore;
var MyGest_Pezzi   : Gest_Pezzi;
var Lerighe_gest   : Gest_baseriga[];
var pezcorr        : LoPezzo;                   
var y1base         : float;
var y2alto         : float;
var rigacontrollata : int;
var locrigaPz       : int;
var DeltaH          : float;
var y1rif           : float;
private var deltaTimeriga : float = 0.6;
private var TimerigaSmonto : float = 0.0;
private var rigaInSmonto : int;
private var DeltaTimePz : float = 1.0;

private var vedobonusPz : boolean = false;
private var TimePzFondo : float = 2.0;
private var PzInFondo   : int;

var bonusRigaobj    : GameObject;
var bonusRigatxt    : UnityEngine.UI.Text;

var bonusPzobj    : GameObject;
var bonusPztxt    : UnityEngine.UI.Text;

private var numrighetoboost : int=0;
private var inboostarighe   : boolean=false;


function InizializzaRighe() {
 for (var i=0; i<Lerighe_gest.length; i++) { Lerighe_gest[i].Inizializza(); }
}

function Update () {
 if (MyGestore.inpausaRiga) { TimerigaSmonto = TimerigaSmonto + Time.deltaTime; Lerighe_gest[rigaInSmonto].trasparenta(1-(TimerigaSmonto/deltaTimeriga));
  if (TimerigaSmonto>deltaTimeriga) { 
     SmontaRiga(rigaInSmonto); 
     MyGestore.inpausaRiga=false;  
     Lerighe_gest[rigaInSmonto].trasparenta(1.0); 
     bonusRigaobj.SetActive(false);
     Controllarigacompleta(); 
     if (inboostarighe) { boostaSingolaRiga(); }
  }
 } // in pausa riga
 if (vedobonusPz) { TimePzFondo = TimePzFondo + Time.deltaTime;  if (TimePzFondo>DeltaTimePz) { vedobonusPz=false; bonusPzobj.SetActive(false); } }
}







function dammivalriga(ind : int) : int {
 var res : int =0;
 var param : int;
 for (var i=0; i<Lerighe_gest[ind].objriga.length; i++) {
  if (Lerighe_gest[ind].objriga[i].activeSelf) {
   param = 1;
   if (i==0) {param =1;} else { for (var j=1; j<=i; j++) { param = param*10;} }
   res = res+param;
  }
 }
 return res;
}

function assegnavalriga(ind: int, valore : int) {
 var param : int;
 for (var i=0; i<Lerighe_gest[ind].objriga.length; i++) {
  param = valore % 10;  valore = valore / 10;
  if (param==1) {Lerighe_gest[ind].objriga[i].SetActive(true);} else {Lerighe_gest[ind].objriga[i].SetActive(false);}
 }
}



function dammicoloririga1(ind : int) : int {
 var res : int =0;
 var param : int;
 for (var i=0; i<5; i++) {
  if (Lerighe_gest[ind].objriga[i].activeSelf) {
   param = Lerighe_gest[ind].coloririga[i];
   if (i==0) {param =Lerighe_gest[ind].coloririga[i];} else { for (var j=1; j<=i; j++) { param = param*10;} }
   res = res+param;
  }
 }
 return res;
}

function dammicoloririga2(ind : int) : int {
 var res : int =0;
 var param : int;
 for (var i=5; i<Lerighe_gest[ind].objriga.length; i++) {
  if (Lerighe_gest[ind].objriga[i].activeSelf) {
   param = Lerighe_gest[ind].coloririga[i];
   if (i==5) {param =Lerighe_gest[ind].coloririga[i];} else { for (var j=1; j<=(i-5); j++) { param = param*10;} }
   res = res+param;
  }
 }
 return res;
}







function assegnacoloreriga1(ind: int, valore : int) {
 var param : int;
 for (var i=0; i<5; i++) {
  param = valore % 10;  valore = valore / 10;
  Lerighe_gest[ind].coloririga[i] = param;
  Lerighe_gest[ind].imgriga[i].color = MyGestore.dammicolore(param);
 }
}


function assegnacoloreriga2(ind: int, valore : int) {
 var param : int;
 for (var i=5; i<Lerighe_gest[ind].objriga.length; i++) {
  param = valore % 10;  valore = valore / 10;
  Lerighe_gest[ind].coloririga[i] = param;
  Lerighe_gest[ind].imgriga[i].color = MyGestore.dammicolore(param);
 }
}



function testContactSxDx() : boolean {
 var res : boolean = false;
  if (TestContact(locrigaPz)) { res = true; }
 return res;
}


function ContattoRighe() {
 pezcorr = MyGest_Pezzi.pezzocorrente;    y1base = MyGestore.y1; y2alto = MyGestore.y1;
 y1rif = pezcorr.posy - y1base;
 DeltaH = MyGestore.Hped;
 locrigaPz = y1rif / DeltaH;
 if (TestContact(locrigaPz)) {  
   pezcorr.spegni(); 
   if ((locrigaPz+1)<Lerighe_gest.length) {FondiaRigaPzCorrente(locrigaPz+1);  MyGest_Pezzi.IntroduciNuovopezzo(); } 
                                     else {rottoschema();}  }
  else { if (y1base>pezcorr.posy) { pezcorr.spegni(); FondiaRigaPzCorrente(0);  MyGest_Pezzi.IntroduciNuovopezzo(); } }
}

function resetPanel() {
 for (var i=0; i<Lerighe_gest.length; i++) {Lerighe_gest[i].resettariga(); }
}



function TestContact(rig : int) {
 var res : boolean = false;
  switch (pezcorr.tipo) {
     
   case 1 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod)) {res=true;}  
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1)) {res=true;}  break;
      case 1 : case 3 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod)) {res=true;}  
                        if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod)) {res=true;}  }   break;
     }  break;   
   
   case 2 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))   {res=true;}   
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1)) {res=true;}  
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2)) {res=true;}     break;
      case 1 : case 3 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))   {res=true;}   
                        if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod)) {res=true;}   }
                        if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod)) {res=true;}   } break;
     }  break;

      
   case 3 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))   {res=true;}   
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1)) {res=true;}    
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2)) {res=true;}     
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+3)) {res=true;}    break;
      case 1 : case 3 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))   {res=true;}   
                        if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))   {res=true;}   } 
                        if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))   {res=true;}   } 
                        if ((rig+3)<Lerighe_gest.length)  {if (Lerighe_gest[rig+3].testoccupato(pezcorr.posxMod))   {res=true;}   }   break;
     }  break;


   case 4 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}     
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))   {res=true;}    
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))   {res=true;}     
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+3))   {res=true;}    
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+4))   {res=true;}                           break;
      case 1 : case 3 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}   
                        if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))   {res=true;}    } 
                        if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))   {res=true;}    } 
                        if ((rig+3)<Lerighe_gest.length)  {if (Lerighe_gest[rig+3].testoccupato(pezcorr.posxMod))   {res=true;}    } 
                        if ((rig+4)<Lerighe_gest.length)  {if (Lerighe_gest[rig+4].testoccupato(pezcorr.posxMod))   {res=true;}    }   break;
     }  break;

 
            
   case 5 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}     
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;}  
               if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))       {res=true;} 
                                                  if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }
          break;
      case 1 : case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
               if ((rig+1)<Lerighe_gest.length)  { if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))       {res=true;} 
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }
               if ((rig+2)<Lerighe_gest.length)  { if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;}  }  
          break;
     }  break;
      
      
   case 6 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}
                        if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}
                                                           if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))   {res=true;} }
          break;
      case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                      if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}}
      break;    
          
      case 1 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))       {res=true;} 
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}} 
            break;
      case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}    
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))   {res=true;}
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} }   
       break;                  
     }  break;

      
      
                  
   case 7 :
     switch (pezcorr.modrot) {
      case 3 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                        if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))       {res=true;} 
                                                           if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}  
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                      if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} }
      break;    
          
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}  
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} } 
            break;
      case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}    
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }     
       break;                  
     }  break;


   case 8 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;}    
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}   
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}   
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}  }   
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}   
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}  }       
            if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;}    
                                               if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))   {res=true;}  } 
      break;    
          
      case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}    
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}    
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;}   
               if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}  }   
            break;
      case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}      
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}   
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }     
                if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;}  }     
       break;                  
     }  break;


  case 9 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}  
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}   }
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} } 
            if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;} }       
      break;    
          
      case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;} }  
            break;
      case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }   
                if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;}  
                                                   if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;}  } 
       break;                  
     }  break;                        




  case 10 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;} 
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}  }
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}}       
            if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;}
                                               if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;}} 
      break;    
          
      case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;}
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}} 
            break;
      case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} }     
                if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;} 
                                                   if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;} } 
       break;                  
     }  break;                        
            
                                     
                                                            
                                                                                                            
   case 11 :
     switch (pezcorr.modrot) {
      case 0 : case 1 : case 2 : case 3 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                                          if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
             if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                                if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }
          break;
     }  break;                                                          
       
                                                                                                                                                                                                                                                                                                                      
  case 12 :
     switch (pezcorr.modrot) {
      case 0 : case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                         if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                         if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;} 
         if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                            if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}
                                            if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;} }
          break;
      case 1 : case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                         if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
         if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                            if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} }
         if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;} 
                                            if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;} }
          break;
     }  break;                                                          
 

                                            
  case 13 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}   }
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
               if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} } 
            if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;} }        
      break;    
          
      case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;} } 
            break;
      case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}  
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }  
                if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;} 
                                                   if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;}  } 
       break;                  
     }  break;                        
        
                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                      
  case 14 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;}  
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}   }
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}  
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;}  
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} }   
            if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))     {res=true;}  
                                               if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;} } 
      break;    
          
      case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} } 
            break;
      case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}   
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }   
                if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;}  } 
       break;                  
     }  break;                        
                        
   
 case 15 :
     switch (pezcorr.modrot) {
      case 0 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;} 
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }       
          break;
      case 1 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
            if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} 
                                               if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} }  
            if ((rig+2)<Lerighe_gest.length)  {if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod+1))     {res=true;} }     
      break;    
          
      case 2 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))       {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+2))     {res=true;}  
                if (rig>0) { if (Lerighe_gest[rig-1].testoccupato(pezcorr.posxMod+1))     {res=true;}   } else {res=true;}
                
            break;
      case 3 :  if (rig>0) { if (Lerighe_gest[rig-1].testoccupato(pezcorr.posxMod))     {res=true;}   } else {res=true;}
                             if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))     {res=true;} 
                             if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
                 if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))     {res=true;} } 
                
       break;                  
     }  break;                                   

   case 16 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod))       {res=true;}     
                        if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;}  
               if ((rig+1)<Lerighe_gest.length)  {if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;} 
                                                  if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+2))     {res=true;}  }
          break;
      case 1 : case 3 :  if (Lerighe_gest[rig].testoccupato(pezcorr.posxMod+1))     {res=true;} 
               if ((rig+1)<Lerighe_gest.length)  { if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod))       {res=true;} 
                                                   if (Lerighe_gest[rig+1].testoccupato(pezcorr.posxMod+1))     {res=true;}  }
               if ((rig+2)<Lerighe_gest.length)  { if (Lerighe_gest[rig+2].testoccupato(pezcorr.posxMod))       {res=true;}  }  
          break;
     }  break;
      
   
   
  }  // tipo pezzo
 return res;
}


function rottoschema() {
 // usare in quanto i pezzi sono sopra lo schema quindi game over.
 MyGestore.aprigameOverBoosts(false); // in modo da non avere il continue game
}




function FondiaRigaPzCorrente(rig : int) {
 if (rig>=0) {
  mandaPoints(); 
  MyGestore.suonaInd(4);
 
  switch (pezcorr.tipo) {
   case 1 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);    break;
      case 1 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);
                        if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); } else {rottoschema();}  break;
     }  break;

   case 2 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                        Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);   break;
      case 1 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);
                        if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); } else {rottoschema();} 
                        if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); } else {rottoschema();}  break;
     }  break;
  
   case 3 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                        Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);  Lerighe_gest[rig].innestapos(pezcorr.posxMod+3); break;
      case 1 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);
                        if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); } else {rottoschema();} 
                        if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); } else {rottoschema();}
                        if ((rig+3)<Lerighe_gest.length)  {Lerighe_gest[rig+3].innestapos(pezcorr.posxMod); } else {rottoschema();}  break;
     }  break;

   case 4 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                        Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);  Lerighe_gest[rig].innestapos(pezcorr.posxMod+3); 
                        Lerighe_gest[rig].innestapos(pezcorr.posxMod+4);                        break;
      case 1 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);
                        if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); } else {rottoschema();} 
                        if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); } else {rottoschema();}
                        if ((rig+3)<Lerighe_gest.length)  {Lerighe_gest[rig+3].innestapos(pezcorr.posxMod); } else {rottoschema();}  
                        if ((rig+4)<Lerighe_gest.length)  {Lerighe_gest[rig+4].innestapos(pezcorr.posxMod); } else {rottoschema();}  break;
     }  break;
      
   case 5 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+2); 
               if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }
                 else {rottoschema();}       
          break;
      case 1 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);
               if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }
                 else {rottoschema();} 
               if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); }   else {rottoschema();} 
          break;
     }  break;
      
   case 6 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                        if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }
                         else {rottoschema();} 
          break;
      case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                      if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);}
                         else {rottoschema();}       
      break;    
          
      case 1 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);} 
                 else {rottoschema();} 
            break;
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
       break;                  
     }  break;
      
   case 7 :
     switch (pezcorr.modrot) {
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                        if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }
                         else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                      if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);}
                         else {rottoschema();}       
      break;    
          
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);} 
                 else {rottoschema();} 
            break;
      case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
       break;                  
     }  break;

   case 8 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod+2); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);
                                               Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);  }
                         else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);} else {rottoschema();}       
            if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1);}
               else {rottoschema();}       
      break;    
          
      case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);}  else {rottoschema();} 
            break;
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
                if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
       break;                  
     }  break;

  case 9 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);
                                               Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);  }
                         else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);} else {rottoschema();}       
            if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod);} else {rottoschema();}       
      break;    
          
      case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);}  else {rottoschema();} 
            break;
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
                if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); } 
              else {rottoschema();} 
       break;                  
     }  break;                        

  case 10 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);
                                               Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);  }
                         else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);} else {rottoschema();}       
            if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod);Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1);} 
              else {rottoschema();}       
      break;    
          
      case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);} 
                 else {rottoschema();} 
            break;
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
                if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); } 
              else {rottoschema();} 
       break;                  
     }  break;                        
                                    
   case 11 :
     switch (pezcorr.modrot) {
      case 0 : case 1 : case 2 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
             if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);  }
                         else {rottoschema();} 
          break;
     }  break;                                                          
                                                                                                            
  case 12 :
     switch (pezcorr.modrot) {
      case 0 : case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);  Lerighe_gest[rig].innestapos(pezcorr.posxMod+2); 
         if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);
                                            Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2); }
                         else {rottoschema();} 
          break;
      case 1 : case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);  
         if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }
                         else {rottoschema();} 
         if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); }
                         else {rottoschema();} 
          break;
     }  break;                                                          
 
                                            
  case 13 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);
                                               Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);  }
                         else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);} else {rottoschema();}       
            if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod);}      else {rottoschema();}       
      break;    
          
      case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);} 
                 else {rottoschema();} 
            break;
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
                if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); } 
              else {rottoschema();} 
       break;                  
     }  break;                        
                                                                                                                                  
  case 14 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod);
                                               Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2);  }
                         else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);} else {rottoschema();}       
            if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1);}      else {rottoschema();}       
      break;    
          
      case 2 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);} 
                 else {rottoschema();} 
            break;
      case 3 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod);  Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }     else {rottoschema();} 
                if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1); } 
              else {rottoschema();} 
       break;                  
     }  break;                        
                                      
 case 15 :
     switch (pezcorr.modrot) {
      case 0 :  Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig].innestapos(pezcorr.posxMod+2); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }                     else {rottoschema();} 
          break;
      case 1 : Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
            if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1);} else {rottoschema();}       
            if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod+1);}      else {rottoschema();}       
      break;    
          
      case 2 :  if (rig>0){Lerighe_gest[rig-1].innestapos(pezcorr.posxMod+1); }
                Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
                Lerighe_gest[rig].innestapos(pezcorr.posxMod+2);
            break;
      case 3 :  if (rig>0) { Lerighe_gest[rig-1].innestapos(pezcorr.posxMod);  }
                Lerighe_gest[rig].innestapos(pezcorr.posxMod); Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
                if ((rig+1)<Lerighe_gest.length) { Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); }      else {rottoschema();}   
       break;                  
     }  break;                                                                
     
 case 16 :
     switch (pezcorr.modrot) {
      case 0 : case 2 : Lerighe_gest[rig].innestapos(pezcorr.posxMod);    Lerighe_gest[rig].innestapos(pezcorr.posxMod+1); 
               if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+2); }
                 else {rottoschema();}       
          break;
      case 1 : case 3 : Lerighe_gest[rig].innestapos(pezcorr.posxMod+1);
               if ((rig+1)<Lerighe_gest.length)  {Lerighe_gest[rig+1].innestapos(pezcorr.posxMod); Lerighe_gest[rig+1].innestapos(pezcorr.posxMod+1); }
                 else {rottoschema();} 
               if ((rig+2)<Lerighe_gest.length)  {Lerighe_gest[rig+2].innestapos(pezcorr.posxMod); }   else {rottoschema();} 
          break;
     }  break;
      
     
                                            
  }
 }
 Controllarigacompleta(); 
}

function mandaPoints() {
 var ptloc : int=0;
 
 switch (pezcorr.tipo) {
  case 1 : ptloc = 2; break;
  case 2 : case 6 : case 7 : ptloc = 3; break;
  case 3 : case 5 : case 8 : case 9 : case 11 : case 15 : case 16 : ptloc = 4; break;
  case 4 : case 10 : case 13 : case 14 : ptloc = 5; break;
  case 12: ptloc = 6; break;
 }
 
 
 // ptloc = ptloc + MyGest_Pezzi.righefatteSuper;
 
 ptloc = ptloc + (MyGestore.fase1-1)*5+MyGestore.fase2;

 bonusPzobj.transform.position.y = pezcorr.posy+MyGestore.Hped*3;
 bonusPzobj.transform.position.x = pezcorr.gameObject.transform.position.x;
 bonusPztxt.text = "+"+ptloc;
 vedobonusPz = true;
 bonusPzobj.SetActive(true);
 TimePzFondo = 0.0;
 
 MyGestore.PuntiPartita = MyGestore.PuntiPartita + ptloc; 
}


function dammivalbonusriga() : int {
 return (10+(MyGestore.fase1-1)*30+MyGestore.fase2*4);
}

function SmontaRiga(rig : int) {
 var ptloc : int= dammivalbonusriga();
 var locobj : GameObject;
 
 if (!inboostarighe) { MyGestore.PuntiPartita = MyGestore.PuntiPartita + ptloc;  }
 
 Lerighe_gest[rig].resettariga();
 for (var i=rig; i<Lerighe_gest.length-1; i++) {
  for (var j=0; j<Lerighe_gest[i].objriga.length; j++) {
    locobj = Lerighe_gest[i].objriga[j];
    locobj.SetActive(Lerighe_gest[i+1].objriga[j].activeSelf); 
    
    Lerighe_gest[i].coloririga[j] = Lerighe_gest[i+1].coloririga[j];
    Lerighe_gest[i].imgriga[j].color    = MyGestore.dammicolore(Lerighe_gest[i].coloririga[j]); 
   }
  Lerighe_gest[i+1].resettariga();
 }
//  MyGestore.inpausaRiga = false;
}

function boostaRiga(numric : int) {
    inboostarighe = true;
    numrighetoboost = numric;
    MyGestore.AzzeraVel();
    boostaSingolaRiga();
}

function boostaSingolaRiga() {
  if (numrighetoboost>0) {
  
   bonusPzobj.transform.position.y = MyGestore.y1+MyGestore.Hped;
   bonusPzobj.transform.position.x = MyGestore.x2+MyGestore.Wped;
   bonusPztxt.text = ""+numrighetoboost;
   bonusPzobj.SetActive(true);
  
  
    MyGestore.inpausaRiga = true;
    TimerigaSmonto = 0.0;
    Lerighe_gest[0].sbianca();
    rigaInSmonto = 0;
    MyGestore.AzzeraVel();
    numrighetoboost --;
  } else {inboostarighe = false; bonusPzobj.SetActive(false); }
}




function  Controllarigacompleta() {
 if (MyGestore.inpausaRiga) {return;}

 var i : int;
 for (i=0; i<Lerighe_gest.length; i++) {
  if (Lerighe_gest[i].completa()) {
    MyGestore.inpausaRiga = true;
    MyGestore.suonaInd(3);
    TimerigaSmonto = 0.0;
    Lerighe_gest[i].sbianca();
    rigaInSmonto = i;
    MyGestore.IncrementaVel();
    bonusRigatxt.text = "+"+dammivalbonusriga();
    bonusRigaobj.SetActive(true);
    bonusRigaobj.transform.position.y = Lerighe_gest[i].dimmiY();
    MyGestore.fase3++;  MyGestore.updateDX();
   break;
  }
 }

} 

