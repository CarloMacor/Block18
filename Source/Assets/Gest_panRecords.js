#pragma strict

var MyGestore  : gestore;
var objrif1    : GameObject;
var objrif2    : GameObject;
private var x1 : float;
private var x2 : float;
private var y1 : float;
private var y2 : float;
var indtxt     : UnityEngine.UI.Text[];
var txtvalrec  : UnityEngine.UI.Text[];
var txtdaterec : UnityEngine.UI.Text[];

var txtptlast   : UnityEngine.UI.Text;
var txtdatelast : UnityEngine.UI.Text;


function AttivaPanRecords() {
 x1 = objrif1.transform.position.x;
 x2 = objrif2.transform.position.x;
 y2 = objrif1.transform.position.y;
 y1 = objrif2.transform.position.y;
 var Deltay : float;
 Deltay = y2-y1;

 var Offy : float = Deltay /10.0;
 for (var i=0; i<10; i++) {
  indtxt[i].text = ""+(i+1);
  indtxt[i].gameObject.transform.position.y = y2-Offy*i;
  indtxt[i].gameObject.transform.position.x = x1;
  
  txtvalrec[i].text = MyGestore.records[i].ToString("n0");
  txtvalrec[i].gameObject.transform.position.y = y2-Offy*i;
  txtvalrec[i].gameObject.transform.position.x = (x2+x1)/2.0;
  
  if (MyGestore.records[i]>=0) {txtdaterec[i].text = ""+MyGestore.datarecords[i];} else {txtdaterec[i].text = "";}
  txtdaterec[i].gameObject.transform.position.y = y2-Offy*i;
  txtdaterec[i].gameObject.transform.position.x = x2;
  
  txtptlast.text   = ""+MyGestore.lastPunteggio;
  txtdatelast.text = ""+MyGestore.lastDatePunteggio;

 }
 
 txtptlast.gameObject.transform.position.x = (x2+x1)/2.0;;
 txtdatelast.gameObject.transform.position.x = x2;

}

