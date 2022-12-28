$(document).ready(function() {

  $("#flashController").on("change", function() {
    if (this.value == "interface") {
      $("#flash-tool-machine-row").hide();
      $("#flash-tool-door-row").hide();
      $("#flash-tool-interface-fw-row").show();
      if ($("#interfaceFirmwareVer").val() == "custom") {
        $("#flash-tool-custom-row").show();
      } else {
        $("#flash-tool-custom-row").hide();
      }
      $("#customFirmwareSet").html("Please select the Interface Firmware binary file you want to flash");
    } else {
      $("#flash-tool-machine-row").show();
      $("#flash-tool-door-row").show();
      $("#flash-tool-interface-fw-row").hide();
      $("#flash-tool-custom-row").hide();
      $("#customFirmwareSet").html("Please select the Grbl Firmware hex file you want to flash");
    }
  });

  $("#grblAxesCount").on("change", function() {
    if (this.value == "custom") {
      $("#flash-tool-door-row").hide();
      $("#flash-tool-custom-row").show();
      $("#customFirmwareSet").html("Please select the Grbl Firmware hex file you want to flash");
    } else {
      $("#flash-tool-door-row").show();
      $("#flash-tool-custom-row").hide();
    }
  });

  $("#interfaceFirmwareVer").on("change", function() {
    if (this.value == "custom") {
      $("#flash-tool-custom-row").show();
      $("#customFirmwareSet").html("Please select the Interface Firmware binary file you want to flash");
    } else {
      $("#flash-tool-custom-row").hide();
    }
  });



  // var fileOpen = document.getElementById('firmwareBin');
  // if (fileOpen) {
  //   fileOpen.addEventListener('change', readEspFirmwareFile, false);
  // }

  function readEspFirmwareFile() {
    console.log("Sending")
    var form = document.getElementById('customFirmwareForm');
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status == 200) {
        $("#customFirmwareSet").html(xhr.response)
      }
    };
    // Add any event handlers here...
    xhr.open('POST', '/uploadCustomFirmware', true);
    xhr.send(formData);
  }

});

function populateGrblBuilderToolForm() {
  Metro.dialog.open("#grblFlashDialog");
}

// install bobscnc hex files
function installFirmware(){

 
  if ($("#flashController").val() =="E3") {
    var filename= "E3.hex"
  }else if($("#flashController").val() =="E4"){
    var filename= "E4.hex"
  }else if($("#flashController").val() =="E3SS"){
    var filename= "E3SS.hex"
  }else if($("#flashController").val() =="E4SS"){
    var filename= "E4SS.hex"
  }else if($("#flashController").val() =="Evo3"){
    var filename= "Evolution3.hex"
  }else if($("#flashController").val() =="Evo4"){
    var filename= "Evolution4.hex"
  }else if($("#flashController").val() =="Evo5"){
    var filename= "Evolution5.hex"
  }else if($("#flashController").val() =="Revo"){
    var filename= "Revolution.hex"
  }else if($("#flashController").val() =="KL733"){
    var filename= "KL733.hex"
  }else if($("#flashController").val() =="KL744"){
    var filename= "KL744.hex"
  }else if($("#flashController").val()=="KL744E"){
    var filename= "KL744E.hex"
  }else if($("#flashController").val()=="QuantumMini"){
    var filename= "QuantumMini.hex"
  }else if($("#flashController").val()=="Quantum"){
    var filename= "Quantum.hex"
  }else if($("#flashController").val()=="QuantumMax"){
    var filename = "QuantumMax.hex"
  }

  var data = {
    port: $("#portUSB2").val(),
    file: filename,
    board: "uno",
    customImg: false
    }

    socket.emit('flashGrbl', data)

  } 


// erase eeprom (eeprom.hex) on bobscnc controller before loading hex file
function startFlash(){
  var data = {
    port: $("#portUSB2").val(),
    file: "eepromclear.hex",
    board: "uno",
    customImg: false
    }
  
    socket.emit('flashGrbl', data)

    
    setTimeout(function() {
      closePort(); // load firmware
    }, 2000);
  

  setTimeout(function() {
    installFirmware(); // load firmware
  }, 10000);

}


