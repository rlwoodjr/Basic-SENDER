function manualcontrolPanel() {
  $('#manualControlPanel').show()
  $('#troubleshootingPanel').hide()
}


function troubleshootingPanel() {
  $('#manualControlPanel').hide()
  $('#troubleshootingPanel').show()
  $('#lastLineRan').html(localStorage.getItem('gcodeLineNumber'))


}


  $('#XAxisDisplay').change(function() {
    axisDisplayChange()
  });

  $('#YAxisDisplay').change(function() {
    axisDisplayChange()
  });

  $('#ZAxisDisplay').change(function() {
    axisDisplayChange()
  });

  $('#AAxisDisplay').change(function() {
    axisDisplayChange()
  });



 //set which axis to display
$(document).ready(function() {
  var X = (localStorage.getItem('XaxisDRO')) 
  var Y = (localStorage.getItem('YaxisDRO')) 
  var Z =  (localStorage.getItem('ZaxisDRO'))
  var A = (localStorage.getItem('AaxisDRO')) 

$('#checkSizeDisplay').hide()


if (X!='false'){
    $('#XAxisDisplay').prop('checked',true) 
  }else{
    $('#XAxisDisplay').prop('checked',false) 
  }

  if (Y!='false'){
    $('#YAxisDisplay').prop('checked',true) 
  }else{
    $('#YAxisDisplay').prop('checked',false) 
  }

  if (Z!='false'){
    $('#ZAxisDisplay').prop('checked',true) 
  }else{
    $('#ZAxisDisplay').prop('checked',false) 
  }
  
  if (A!='true'){
    $('#AAxisDisplay').prop('checked',false) 
  }else if (A!='false'){
    $('#AAxisDisplay').prop('checked',true) 
  }else{
  $('#AAxisDisplay').prop('checked',false) 
}



  
  axisDisplayChange()

 
});


 // show/hide axes jog displays
function axisDisplayChange(){

    if($("#XAxisDisplay").is(':checked')){
      localStorage.setItem('XaxisDRO', "true");
      $("#xPosSetZ").show();
      $("#xPosDro").show();
      $("#xPosGT").show();
      $("#xP").show();
      $("#xM").show();
     }else if($("#XAxisDisplay").is(':checked')===false){
      localStorage.setItem('XaxisDRO', "false");
      $("#xPosSetZ").hide();
      $("#xPosDro").hide();
      $("#xPosGT").hide();
      $("#xP").hide();
      $("#xM").hide();
      }
         
    if($("#YAxisDisplay").is(':checked')){
      localStorage.setItem('YaxisDRO', "true");
      $("#yPosSetZ").show();
      $("#yPosDro").show();
      $("#yPosGT").show();
      $("#yP").show();
      $("#yM").show();
     }else if($("#YAxisDisplay").is(':checked')===false){
      localStorage.setItem('YaxisDRO', "false");
      $("#yPosSetZ").hide();
      $("#yPosDro").hide();
      $("#yPosGT").hide();
      $("#yP").hide();
      $("#yM").hide();
      }
     

    if($("#ZAxisDisplay").is(':checked')){
      localStorage.setItem('ZaxisDRO', "true");
      $("#zPosSetZ").show();
      $("#zPosDro").show();
      $("#zPosGT").show();
      $("#zP").show();
      $("#zM").show();
     }else if($("#ZAxisDisplay").is(':checked')===false){
      localStorage.setItem('ZaxisDRO', "false");
      $("#zPosSetZ").hide();
      $("#zPosDro").hide();
      $("#zPosGT").hide();
      $("#zP").hide();
      $("#zM").hide();
     }

    if($("#AAxisDisplay").is(':checked')){
      localStorage.setItem('AaxisDRO', "true");
      $("#aPosSetZ").show();
      $("#aPosDro").show();
      $("#aPosGT").show();
      $("#aP").show();
      $("#aM").show();
     }else if($("#AAxisDisplay").is(':checked')===false){
      localStorage.setItem('AaxisDRO', "false");
      $("#aPosSetZ").hide();
      $("#aPosDro").hide();
      $("#aPosGT").hide();
      $("#aP").hide();
      $("#aM").hide();
     }

}