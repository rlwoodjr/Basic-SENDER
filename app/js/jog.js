var allowContinuousJog = false;
var continuousJogRunning = false;
var jogdist = 10;

var jogDistTmm ='0.025'
var jogDistSmm ='0.1'
var jogDistMmm = '3'
var jogDistLmm = '25'

var jogDistTin = '0.001'
var jogDistSin = '0.01'
var jogDistMin = '0.1'
var jogDistLin ='1'




var jogRateX = 4000
var jogRateY = 4000
var jogRateZ = 2000
var jogRateA = 4000

function jogOverride(newVal) {
  if (grblParams.hasOwnProperty('$110')) {
    jogRateX = (grblParams['$110'] * (newVal / 100)).toFixed(0);
    jogRateY = (grblParams['$111'] * (newVal / 100)).toFixed(0);
    jogRateZ = (grblParams['$112'] * (newVal / 100)).toFixed(0);
    jogRateA = (grblParams['$111'] * (newVal / 100)).toFixed(0);
    

  }
  if (grblParams.hasOwnProperty('$113')) {
    jogRateA = (grblParams['$113'] * (newVal / 100)).toFixed(0);
  }
  localStorage.setItem('jogOverride', newVal);
}

function setADist(newADist) {
  $("#distAAxislabel").html("A: " + newADist + " deg")
  jogdistA = newADist;
}

function mmMode() {
  unit = "mm";
  localStorage.setItem('unitsMode', unit);

  $('#dist01label').html(jogDistTmm)  
  $('#dist1label').html(jogDistSmm)
  $('#dist10label').html(jogDistMmm)
  $('#dist100label').html(jogDistLmm)
  jogdist=jogDistMmm
  $('.distbtn').removeClass('bd-openbuilds')
  $('#dist10').addClass('bd-openbuilds')
  $('.jogdist').removeClass('fg-openbuilds')
  $('.jogdist').addClass('fg-gray')
  $('#dist10label').removeClass('fg-gray')
  $('#dist10label').addClass('fg-openbuilds')

  if (typeof object !== 'undefined') {
    if (object.userData.inch) {
      if (typeof redrawGrid === "function") { // Check if function exists, because in Mobile view it does not
        redrawGrid(object.userData.bbbox2.min.x * 25.4, object.userData.bbbox2.max.x * 25.4, object.userData.bbbox2.min.y * 25.4, object.userData.bbbox2.max.y * 25.4, false);
      }
    } else {
      if (typeof redrawGrid === "function") { // Check if function exists, because in Mobile view it does not
        redrawGrid(object.userData.bbbox2.min.x, object.userData.bbbox2.max.x, object.userData.bbbox2.min.y, object.userData.bbbox2.max.y, false);
      }
    }
  } else {
    if (typeof redrawGrid === "function") { // Check if function exists, because in Mobile view it does not
      redrawGrid(xmin, xmax, ymin, ymax, false);
    }
  }
}

function inMode() {
  unit = "in";
  localStorage.setItem('unitsMode', unit);
  $('#dist01label').html(jogDistTin)
  $('#dist1label').html(jogDistSin)
  $('#dist10label').html(jogDistMin)
  $('#dist100label').html(jogDistLin)
  jogdist=jogDistMin*25.4
  $('.distbtn').removeClass('bd-openbuilds')
  $('#dist10').addClass('bd-openbuilds')
  $('.jogdist').removeClass('fg-openbuilds')
  $('.jogdist').addClass('fg-gray')
  $('#dist10label').removeClass('fg-gray')
  $('#dist10label').addClass('fg-openbuilds')

  if (typeof object !== 'undefined') {
    if (object.userData.inch) {
      if (typeof redrawGrid === "function") { // Check if function exists, because in Mobile view it does not
        redrawGrid(object.userData.bbbox2.min.x, object.userData.bbbox2.max.x, object.userData.bbbox2.min.y, object.userData.bbbox2.max.y, true);
      }
    } else {
      if (typeof redrawGrid === "function") { // Check if function exists, because in Mobile view it does not
        redrawGrid(object.userData.bbbox2.min.x / 25.4, object.userData.bbbox2.max.x / 25.4, object.userData.bbbox2.min.y / 25.4, object.userData.bbbox2.max.y / 25.4, true);
      }
    }
  } else {
    if (typeof redrawGrid === "function") { // Check if function exists, because in Mobile view it does not
      redrawGrid(xmin / 25.4, xmax / 25.4, ymin / 25.4, ymax / 25.4, true);
    }
  }

}

function cancelJog() {
  socket.emit('stop', {
    stop: false,
    jog: true,
    abort: false
  })
  continuousJogRunning = false;
}


$(document).ready(function() {



  // get jog feed rates
  if (localStorage.getItem('SlowJog')) {
    $('#setSlowJog').val(localStorage.getItem('SlowJog'))
  }else{
    $('#setSlowJog').val(1)
  }

  if (localStorage.getItem('normalJog')) {
    $('#setNormalJog').val(localStorage.getItem('normalJog'))
  }else{
    $('#setNormalJog').val(20)
    jogOverride(20);

  }

  if (localStorage.getItem('FastJog')) {
    $('#setFastJog').val(localStorage.getItem('FastJog'))
  }else{
    $('#setFastJog').val(60)
  }


  // get jog distances mm
  if (localStorage.getItem('mmTinyJog')) {
    $('#setTinyJogmm').val(localStorage.getItem('mmTinyJog'))
    jogDistTmm = localStorage.getItem('mmTinyJog')
  }


  if (localStorage.getItem('mmSmallJog')) {
    $('#setSmallJogmm').val(localStorage.getItem('mmSmallJog'))
    jogDistSmm = localStorage.getItem('mmSmallJog')
  }

  if (localStorage.getItem('mmMediumJog')) {
    $('#setMediumJogmm').val(localStorage.getItem('mmMediumJog'))
    jogDistMmm = localStorage.getItem('mmMediumJog')
  }

  if (localStorage.getItem('mmLargeJog')) {
    $('#setLargeJogmm').val(localStorage.getItem('mmLargeJog'))
    jogDistLmm = localStorage.getItem('mmLargeJog')
  }

  // get jog distances inches
  if (localStorage.getItem('inTinyJog')) {
    $('#setTinyJogin').val(localStorage.getItem('inTinyJog'))
    jogDistTin = localStorage.getItem('inTinyJog')
  }

  if (localStorage.getItem('inSmallJog')) {
    $('#setSmallJogin').val(localStorage.getItem('inSmallJog'))
    jogDistSin = localStorage.getItem('inSmallJog')
  }

  if (localStorage.getItem('inMediumJog')) {
    $('#setMediumJogin').val(localStorage.getItem('inMediumJog'))
    jogDistMin = localStorage.getItem('inMediumJog')
  }

  if (localStorage.getItem('inLargeJog')) {
    $('#setLargeJogin').val(localStorage.getItem('inLargeJog'))
    jogDistLin = localStorage.getItem('inLargeJog')
  }

  if (localStorage.getItem('continuousJog')) {
    if (JSON.parse(localStorage.getItem('continuousJog')) == true) {
      $('#jogTypeContinuous').prop('checked', true)
      allowContinuousJog = true;
      $('.distbtn').hide()
    } else {
      $('#jogTypeContinuous').prop('checked', false)
      allowContinuousJog = false;
      $('.distbtn').show();
    }
  }

  $('#jogTypeContinuous').on('click', function() {
    if ($(this).is(':checked')) {
      localStorage.setItem('continuousJog', true);
      allowContinuousJog = true;
      $('.distbtn').hide();
    } else {
      localStorage.setItem('continuousJog', false);
      allowContinuousJog = false;
      $('.distbtn').show();
    }
    // console.log(document.activeElement)
    document.activeElement.blur();
  });

  if (localStorage.getItem('unitsMode')) {
    if (localStorage.getItem('unitsMode') == "mm") {
      mmMode()
      $('#mmMode').click()
    } else if (localStorage.getItem('unitsMode') == "in") {
      inMode();
      $('#inMode').click()
    }
  } else {
    // default to inches
    inMode();
    $('#inMode').click()
  }

 


  $(document).mousedown(function(e) {
  }).mouseup(function(e) {
    // Added to cancel Jog moves even when user moved the mouse off the button before releasing
    if (allowContinuousJog) {
      if (continuousJogRunning) {
        cancelJog()
      }
    }
  }).mouseleave(function(e) {
  });

  $("#xPosDro").click(function() {
    $("#xPos").hide()
    $("#xPosDro").addClass("drop-shadow");
    if (unit == "mm") {
      $("#xPosInput").show().focus().val(laststatus.machine.position.work.x)
    } else if (unit == "in") {
      $("#xPosInput").show().focus().val((laststatus.machine.position.work.x / 25.4).toFixed(3))
    }
  });

  $("#xPosInput").blur(function() {
    $("#xPosDro").removeClass("drop-shadow");
    $("#xPos").show()
    $("#xPosInput").hide()
  });

  $('#xPosInput').on('keypress', function(e) {
    console.log(e)
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#xPos").show()
      $("#xPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
        if (e.shiftKey) {
          sendGcode("G21\nG10 P0 L20 X" + $("#xPosInput").val());
        } else {
          sendGcode("$J=G90 G21 X" + $("#xPosInput").val() + " F" + jogRateX);
        }

      } else if (unit == "in") {
        if (e.shiftKey) {
          sendGcode("G21\nG10 P0 L20 X" + ($("#xPosInput").val() * 25.4));
        } else {
          sendGcode("$J=G90 G20 X" + $("#xPosInput").val() + " F" + jogRateX);
        }
      }
    }
  });

  $("#yPosDro").click(function() {
    $("#yPos").hide()
    $("#yPosDro").addClass("drop-shadow");
    if (unit == "mm") {
      $("#yPosInput").show().focus().val(laststatus.machine.position.work.y)
    } else if (unit == "in") {
      $("#yPosInput").show().focus().val((laststatus.machine.position.work.y / 25.4).toFixed(3))
    }
  });

  $("#yPosInput").blur(function() {
    $("#yPos").show()
    $("#yPosDro").removeClass("drop-shadow");
    $("#yPosInput").hide()
  });

  $('#yPosInput').on('keypress', function(e) {
    if (e.which === 13) {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#yPos").show()
      $("#yPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
        if (e.shiftKey) {
          sendGcode("G21\nG10 P0 L20 Y" + $("#yPosInput").val());
        } else {
          sendGcode("$J=G90 G21 Y" + $("#yPosInput").val() + " F" + jogRateY);
        }
      } else if (unit == "in") {
        if (e.shiftKey) {
          sendGcode("G21\nG10 P0 L20 Y" + ($("#yPosInput").val() * 25.4));
        } else {
          sendGcode("$J=G90 G20 Y" + $("#yPosInput").val() + " F" + jogRateY);
        }
      }
    }
  });

  $("#zPosDro").click(function() {
    $("#zPos").hide()
    $("#zPosDro").addClass("drop-shadow");
    if (unit == "mm") {
      $("#zPosInput").show().focus().val(laststatus.machine.position.work.z)
    } else if (unit == "in") {
      $("#zPosInput").show().focus().val((laststatus.machine.position.work.z / 25.4).toFixed(3))
    }
  });

  $("#zPosInput").blur(function() {
    $("#zPos").show()
    $("#zPosDro").removeClass("drop-shadow");
    $("#zPosInput").hide()
  });

  $('#zPosInput').on('keypress', function(e) {
    if (e.which === 13) {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#zPos").show()
      $("#zPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
        if (e.shiftKey) {
          sendGcode("G21\nG10 P0 L20 Z" + $("#zPosInput").val());
        } else {
          sendGcode("$J=G90 G21 Z" + $("#zPosInput").val() + " F" + jogRateZ);
        }
      } else if (unit == "in") {
        if (e.shiftKey) {
          sendGcode("G21\nG10 P0 L20 Z" + ($("#zPosInput").val() * 25.4));
        } else {
          sendGcode("$J=G90 G20 Z" + $("#zPosInput").val() + " F" + jogRateZ);
        }
      }
    }
  });



  $("#aPosDro").click(function() {
    $("#aPos").hide()
    $("#aPosDro").addClass("drop-shadow");
    $("#aPosInput").show().focus().val(laststatus.machine.position.work.a)
  });

  $("#aPosInput").blur(function() {
    $("#aPos").show()
    $("#aPosDro").removeClass("drop-shadow");
    $("#aPosInput").hide()
  });

  $('#aPosInput').on('keypress', function(e) {
    if (e.which === 13) {
      //Disable textbox to prevent multiple submit
      $(this).attr("disabled", "disabled");
      $("#aPos").show()
      $("#aPosInput").hide()
      //Enable the textbox again if needed.
      $(this).removeAttr("disabled");
      if (unit == "mm") {
          sendGcode("G21\nG10 P0 L20 A" + $("#aPosInput").val());
      } else if (unit == "in") {
         sendGcode("G21\nG10 P0 L20 A" + $("#aPosInput").val());
      }
    }
  });



  $('#dist01').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = jogDistTmm
    } else if (unit == "in") {
      jogdist = jogDistTin*25.4
    }
    
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist01').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist01label').removeClass('fg-gray')
    $('#dist01label').addClass('fg-openbuilds')

    
  })

  $('#dist1').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = jogDistSmm
    } else if (unit == "in") {
      jogdist = jogDistSin*25.4
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist1').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist1label').removeClass('fg-gray')
    $('#dist1label').addClass('fg-openbuilds')
  })

  $('#dist10').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = jogDistMmm
    } else if (unit == "in") {
      jogdist =jogDistMin*25.4
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist10').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist10label').removeClass('fg-gray')
    $('#dist10label').addClass('fg-openbuilds')
  })

  $('#dist100').on('click', function(ev) {
    if (unit == "mm") {
      jogdist = jogDistLmm
    } else if (unit == "in") {
      jogdist = jogDistLin*25.4
    }
    $('.distbtn').removeClass('bd-openbuilds')
    $('#dist100').addClass('bd-openbuilds')
    $('.jogdist').removeClass('fg-openbuilds')
    $('.jogdist').addClass('fg-gray')
    $('#dist100label').removeClass('fg-gray')
    $('#dist100label').addClass('fg-openbuilds')
  })

  $('#gotozeroWPos').on('click', function(ev) {
    var jogString=[null];
     sendGcode('G21 G90');
     
     if($("#XAxisDisplay").is(':checked')){jogString+=" X0"}
     if($("#YAxisDisplay").is(':checked')){jogString+=" Y0"}
     if($("#AAxisDisplay").is(':checked')){jogString+=" A0"}
     sendGcode('G0'+ jogString);
     if($("#ZAxisDisplay").is(':checked')){sendGcode('G0 Z0')}

  });

  $('#gotoXzeroMpos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 X-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 X0');
    }
  });

  $('#gotoYzeroMpos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Y-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Y0');
    }
  });

  $('#gotoZzeroMpos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Z-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Z0');
    }
  });

  $('#gotoAzeroMpos').on('click', function(ev) {
      sendGcode('G53 G0 A0');

  });

  $('#gotozeroZmPosXYwPos').on('click', function(ev) {
    var jogString=[null];
    if (grblParams['$22'] == 1) {
      if($("#ZAxisDisplay").is(':checked')){sendGcode('G53 G0 Z-' + grblParams["$27"])}
    } else {
      sendGcode('G53 G0 Z0');
    }
    if($("#XAxisDisplay").is(':checked')){jogString+=" X0"}
    if($("#YAxisDisplay").is(':checked')){jogString+=" Y0"}
    if($("#AAxisDisplay").is(':checked')){jogString+=" A0"}
    sendGcode('G53 G0'+ jogString);
  });

  $('#gotozeroMPos').on('click', function(ev) {
    if (grblParams['$22'] == 1) {
      sendGcode('G53 G0 Z-' + grblParams["$27"]);
      sendGcode('G53 G0 X-' + grblParams["$27"] + ' Y-' + grblParams["$27"]);
    } else {
      sendGcode('G53 G0 Z0');
      sendGcode('G53 G0 X0 Y0');
    }
  });

 




  $('.xM').on('touchstart mousedown', function(ev) {
    console.log(ev)
    if (ev.which > 1) {// Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "X-";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseFloat(laststatus.machine.position.offset.x) + parseFloat(laststatus.machine.position.work.x))) - 0.005
          distance = distance.toFixed(4);
          if (distance < 0.005) {
            toastJogWillHit("X-");
          }
        }

        if (distance >= 0.005) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateX + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.xM').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('X', '-' + jogdist, jogRateX);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.xM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.xP').on('touchstart mousedown', function(ev) {
    // console.log("xp down")
    if (ev.which > 1) {
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }

    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "X";
        var distance = 1000;
        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var maxdistance = parseInt(grblParams.$130)
          // Positive move:
          distance = (maxdistance - (parseFloat(laststatus.machine.position.offset.x) + parseFloat(laststatus.machine.position.work.x))) - 0.005
          distance = distance.toFixed(4);
          if (distance < 0.005) {
            toastJogWillHit("X+");
          }
        }
        if (distance >= 0.005) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateX + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.xP').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('X', jogdist, jogRateX);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.xP').on('touchend mouseup', function(ev) {
    // console.log("xp up")
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.yM').on('touchstart mousedown', function(ev) {
    if (ev.which > 1) { // Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "Y-";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseFloat(laststatus.machine.position.offset.y) + parseFloat(laststatus.machine.position.work.y))) - 0.005
          distance = distance.toFixed(4);
          if (distance < 0.005) {
            toastJogWillHit("Y-");
          }
        }

        if (distance >= 0.005) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateY + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.yM').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('Y', '-' + jogdist, jogRateY);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.yM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.yP').on('touchstart mousedown', function(ev) {
    if (ev.which > 1) { // Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "Y";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var maxdistance = parseInt(grblParams.$131)
          // Positive move:
          distance = (maxdistance - (parseFloat(laststatus.machine.position.offset.y) + parseFloat(laststatus.machine.position.work.y))) - 0.005
          distance = distance.toFixed(4);
          if (distance < 0.005) {
            toastJogWillHit("Y+");
          }
        }

        if (distance >= 0.005) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateY + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('#yP').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('Y', jogdist, jogRateY);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.yP').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.zM').on('touchstart mousedown', function(ev) {
    if (ev.which > 1) { // Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "Z-";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$132)
          var maxdistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseFloat(laststatus.machine.position.offset.z) + parseFloat(laststatus.machine.position.work.z))) - 0.005
          distance = distance.toFixed(4);
          if (distance < 0.005) {
            toastJogWillHit("Z-");
          }
        }

        if (distance >= 0.005) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateZ + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.zM').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('Z', '-' + jogdist, jogRateZ);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.zM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.zP').on('touchstart mousedown', function(ev) {
    if (ev.which > 1) { // Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "Z";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var maxdistance = 0; // Grbl all negative coordinates
          // Positive move:
          distance = (maxdistance - (parseFloat(laststatus.machine.position.offset.z) + parseFloat(laststatus.machine.position.work.z))) - 0.005
          distance = distance.toFixed(4);
          if (distance < 0.005) {
            toastJogWillHit("Z+");
          }
        }

        if (distance >= 0.005) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateZ + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.zP').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('Z', jogdist, jogRateZ);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.zP').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });


  // Jogging A axis

$('.aM').on('touchstart mousedown', function(ev) {
  if (ev.which > 1) { // Ignore middle and right click
    return
  }
  ev.preventDefault();
  var hasSoftLimits = false;
  if (Object.keys(grblParams).length > 0) {
    if (parseInt(grblParams.$20) == 1) {
      hasSoftLimits = true;
    }
  }
  if (allowContinuousJog) { // startJog();
    if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
      var direction = "A-";
      var distance = 360;

      if (distance >= 1) {
        socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateA + "\n");
        continuousJogRunning = true;
        waitingForStatus = true;
        $('.aM').click();
      }
    } else {
      toastJogNotIdle();
    }
  } else {
    jog('A', '-' + jogdist, jogRateA);
  }
  $('#runNewProbeBtn').addClass("disabled")
  $('#confirmNewProbeBtn').removeClass("disabled")
});
$('.aM').on('touchend mouseup', function(ev) {
  ev.preventDefault();
  if (allowContinuousJog) {
    cancelJog()
  }
});

  $('.aM').on('touchstart mousedown', function(ev) {
    if (ev.which > 1) { // Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "A-";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$133)
          var maxdistance = 0; // Grbl all negative coordinates
          // Negative move:
          distance = (mindistance + (parseFloat(laststatus.machine.position.offset.a) + parseFloat(laststatus.machine.position.work.a))) - 1
          distance = distance.toFixed(3);
          if (distance < 1) {
            toastJogWillHit("A-");
          }
        }

        if (distance >= 1) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateA + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.aM').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('A', '-' + jogdistA, jogRateA);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.aM').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });

  $('.aP').on('touchstart mousedown', function(ev) {
    if (ev.which > 1) { // Ignore middle and right click
      return
    }
    ev.preventDefault();
    var hasSoftLimits = false;
    if (Object.keys(grblParams).length > 0) {
      if (parseInt(grblParams.$20) == 1) {
        hasSoftLimits = true;
      }
    }
    if (allowContinuousJog) { // startJog();
      if (!waitingForStatus && laststatus.comms.runStatus == "Idle" || laststatus.comms.runStatus == "Door:0") {
        var direction = "A";
        var distance = 1000;

        if (hasSoftLimits) {
          // Soft Limits is enabled so lets calculate maximum move distance
          var mindistance = parseInt(grblParams.$133)
          var maxdistance = 0; // Grbl all negative coordinates
          // Positive move:
          distance = (maxdistance - (parseFloat(laststatus.machine.position.offset.a) + parseFloat(laststatus.machine.position.work.a))) - 1
          distance = distance.toFixed(3);
          if (distance < 1) {
            toastJogWillHit("A+");
          }
        }

        if (distance >= 1) {
          socket.emit('runCommand', "$J=G91 G21 " + direction + distance + " F" + jogRateA + "\n");
          continuousJogRunning = true;
          waitingForStatus = true;
          $('.aP').click();
        }
      } else {
        toastJogNotIdle();
      }
    } else {
      jog('A', jogdist, jogRateA);
    }
    $('#runNewProbeBtn').addClass("disabled")
    $('#confirmNewProbeBtn').removeClass("disabled")
  });
  $('.aP').on('touchend mouseup', function(ev) {
    ev.preventDefault();
    if (allowContinuousJog) {
      cancelJog()
    }
  });


  $('#homeBtn').on('click', function(ev) {
    home();
  })

  $('#chkSize').on('click', function() {
    var bbox2 = new THREE.Box3().setFromObject(object);
    console.log('bbox for Draw Bounding Box: ' + object + ' Min X: ', (bbox2.min.x), '  Max X:', (bbox2.max.x), 'Min Y: ', (bbox2.min.y), '  Max Y:', (bbox2.max.y));
    var feedrate = 5000
    if (laststatus.machine.firmware.type === 'grbl') {
      var moves = `
        $J=G90G21X` + (bbox2.min.x).toFixed(3) + ` Y` + (bbox2.min.y).toFixed(3) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.max.x).toFixed(3) + ` Y` + (bbox2.min.y).toFixed(3) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.max.x).toFixed(3) + ` Y` + (bbox2.max.y).toFixed(3) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.min.x).toFixed(3) + ` Y` + (bbox2.max.y).toFixed(3) + ` F` + feedrate + `\n
        $J=G90G21X` + (bbox2.min.x).toFixed(3) + ` Y` + (bbox2.min.y).toFixed(3) + ` F` + feedrate + `\n
        `;
    } else {
      var moves = `
       G90\n
       G0 X` + (bbox2.min.x).toFixed(3) + ` Y` + (bbox2.min.y).toFixed(3) + ` F` + feedrate + `\n
       G0 X` + (bbox2.max.x).toFixed(3) + ` Y` + (bbox2.min.y).toFixed(3) + ` F` + feedrate + `\n
       G0 X` + (bbox2.max.x).toFixed(3) + ` Y` + (bbox2.max.y).toFixed(3) + ` F` + feedrate + `\n
       G0 X` + (bbox2.min.x).toFixed(3) + ` Y` + (bbox2.max.y).toFixed(3) + ` F` + feedrate + `\n
       G0 X` + (bbox2.min.x).toFixed(3) + ` Y` + (bbox2.min.y).toFixed(3) + ` F` + feedrate + `\n
       G90\n`;
    }
    socket.emit('runJob', {
      data: moves,
      isJob: false,
      fileName: ""
    });
  });

});

function changeStepSize(dir) {
  if (jogdist == 0.1 || jogdist == 0.0254) {
    if (dir == 1) {
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist1').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist1label').removeClass('fg-gray')
      $('#dist1label').addClass('fg-openbuilds')
    }
    if (dir == -1) {
      // do nothing
    }
  } else if (jogdist == 1 || jogdist == 0.254) {
    if (dir == 1) {
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist10').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist10label').removeClass('fg-gray')
      $('#dist10label').addClass('fg-openbuilds')
    }
    if (dir == -1) {
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist01').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist01label').removeClass('fg-gray')
      $('#dist01label').addClass('fg-openbuilds')
    }
  } else if (jogdist == 10 || jogdist == 2.54) {
    if (dir == 1) {
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist100').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist100label').removeClass('fg-gray')
      $('#dist100label').addClass('fg-openbuilds')
    }
    if (dir == -1) {
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist1').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist1label').removeClass('fg-gray')
      $('#dist1label').addClass('fg-openbuilds')
    }
  } else if (jogdist == 100 || jogdist == 25.4) {
    if (dir == 1) {
      // do nothing
    }
    if (dir == -1) {
      $('.distbtn').removeClass('bd-openbuilds')
      $('#dist10').addClass('bd-openbuilds')
      $('.jogdist').removeClass('fg-openbuilds')
      $('.jogdist').addClass('fg-gray')
      $('#dist10label').removeClass('fg-gray')
      $('#dist10label').addClass('fg-openbuilds')
    }
  }

}

function jog(dir, dist, feed = null) {
  if (feed) {
    socket.emit('jog', dir + ',' + dist + ',' + feed);
  } else {
    socket.emit('jog', dir + ',' + dist);
  }
}

function jogXY(xincrement, yincrement, feed = null) {
  var data = {
    x: xincrement,
    y: yincrement,
    feed: feed
  }
  socket.emit('jogXY', data);
}

function home() {
  if (laststatus != undefined && laststatus.machine.firmware.type == 'grbl') {
    sendGcode('$H')
  } else if (laststatus != undefined && laststatus.machine.firmware.type == 'smoothie') {
    sendGcode('G28')
  }
}

function toastJogWillHit(axis) {
  printLog("<span class='fg-red'>[ jog ] </span><span class='fg-red'>Unable to jog toward " + axis + ", will hit soft-limit</span>")
  var toast = Metro.toast.create;
  toast("Unable to jog toward " + axis + ", will hit soft-limit", null, 1000, "bg-darkRed fg-white")
}

function toastJogNotIdle(axis) {
  printLog("<span class='fg-red'>[ jog ] </span><span class='fg-red'>Please wait for machine to be Idle, before jogging</span>")
  var toast = Metro.toast.create;
  toast("Please wait for machine to be Idle, before jogging. Try again once it is Idle", null, 1000, "bg-darkRed fg-white")
}

// only send zero for shown axes
function SetActiveZeros(){
   var jogString =[null] 

  if($("#XAxisDisplay").is(':checked')){jogString=" X0"}
  if($("#YAxisDisplay").is(':checked')){jogString+=" Y0"}
  if($("#ZAxisDisplay").is(':checked')){jogString+=" Z0"}
  if($("#AAxisDisplay").is(':checked')){jogString+=" A0"}

  sendGcode( 'G10 P0 L20'+jogString)
  

}


$('#lowJog').on('click', function(ev) {

  $('.spdbtn').removeClass('bd-openbuilds')
  $('#lowJog').addClass('bd-openbuilds')
  $('.jogspd').removeClass('fg-openbuilds')
  $('.jogspd').addClass('fg-gray')
  $('#lowlabel').removeClass('fg-gray')
  $('#lowlabel').addClass('fg-openbuilds')
  jogOverride($('#setSlowJog').val());
})


$('#normalJog').on('click', function(ev) {

  $('.spdbtn').removeClass('bd-openbuilds')
  $('#normalJog').addClass('bd-openbuilds')
  $('.jogspd').removeClass('fg-openbuilds')
  $('.jogspd').addClass('fg-gray')
  $('#normallabel').removeClass('fg-gray')
  $('#normallabel').addClass('fg-openbuilds')
  jogOverride($('#setNormalJog').val());
})



$('#highJog').on('click', function(ev) {

  $('.spdbtn').removeClass('bd-openbuilds')
  $('#highJog').addClass('bd-openbuilds')
  $('.jogspd').removeClass('fg-openbuilds')
  $('.jogspd').addClass('fg-gray')
  $('#highlabel').removeClass('fg-gray')
  $('#highlabel').addClass('fg-openbuilds')
  jogOverride($('#setFastJog').val());

})


$('#rapidJog').on('click', function(ev) {

  $('.spdbtn').removeClass('bd-openbuilds')
  $('#rapidJog').addClass('bd-openbuilds')
  $('.jogspd').removeClass('fg-openbuilds')
  $('.jogspd').addClass('fg-gray')
  $('#rapidlabel').removeClass('fg-gray')
  $('#rapidlabel').addClass('fg-openbuilds')
  jogOverride(100);

})

// jog feed reate for slow, normal, and fast as a precentage of rapid (100%)
function setJogS(){
  localStorage.setItem('SlowJog',$('#setSlowJog').val())
  jogOverride($('#setSlowJog').val());
}

function setJogN(){
  localStorage.setItem('normalJog',$('#setNormalJog').val())
  jogOverride($('#setNormalJog').val());
}

function setJogF(){
  localStorage.setItem('FastJog',$('#setFastJog').val())
  jogOverride($('#setFastJog').val());

}

//Jog distances Tiny, Small, Meduim, and Large for mm and inches

function setJogTmm() {
  localStorage.setItem('mmTinyJog',$('#setTinyJogmm').val())
  $('#dist01label').html($('#setTinyJogmm').val());
  var distclass = $('#dist01label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist01label').text());
  jogDistTmm = parseFloat($('#dist01label').text());
  }
function setJogSmm() {
  localStorage.setItem('mmSmallJog',$('#setSmallJogmm').val())
  $('#dist1label').html($('#setSmallJogmm').val())
  var distclass = $('#dist1label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist1label').text());
  jogDistSmm = parseFloat($('#dist1label').text());
}
function setJogMmm() {
  localStorage.setItem('mmMediumJog',$('#setMediumJogmm').val())
  $('#dist10label').html($('#setMediumJogmm').val());
  var distclass = $('#dist10label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist10label').text());
  jogDistMmm = parseFloat($('#dist10label').text());
}
function setJogLmm() {
  localStorage.setItem('mmLargeJog',$('#setLargeJogmm').val())
  $('#dist100label').html($('#setLargeJogmm').val());
  var distclass = $('#dist100label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist100label').text());
  jogDistLmm = parseFloat($('#dist100label').text());
}



function setJogTin() {
  localStorage.setItem('inTinyJog',$('#setTinyJogin').val())
  $('#dist01label').html($('#setTinyJogin').val());
  var distclass = $('#dist01label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist01label').text())*25.4;
  jogDistTin = parseFloat($('#dist01label').text());
}
function setJogSin() {
  localStorage.setItem('inSmallJog',$('#setSmallJogin').val())
  $('#dist1label').html($('#setSmallJogin').val());
  var distclass = $('#dist1label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist1label').text())*25.4;
  jogDistSin = parseFloat($('#dist1label').text());
}
function setJogMin() {
  localStorage.setItem('inMediumJog',$('#setMediumJogin').val())
  $('#dist10label').html($('#setMediumJogin').val());
  var distclass = $('#dist10label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist10label').text())*25.4;
  jogDistMin = parseFloat($('#dist10label').text());
}

function setJogLin() {
  localStorage.setItem('inLargeJog',$('#setLargeJogin').val())
  $('#dist100label').html($('#setLargeJogin').val());
  var distclass = $('#dist100label').attr("class");
  var classtext=distclass.includes("fg-openbuilds");
  if(classtext) jogdist=parseFloat($('#dist100label').text())*25.4;
  jogDistLin = parseFloat($('#dist100label').text());
}




