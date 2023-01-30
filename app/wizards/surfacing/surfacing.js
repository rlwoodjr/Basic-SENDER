function populateSurfaceToolForm() {
  $("#gcode").empty();

  if (localStorage.getItem("lastSurfacingTool")) {
    var data = JSON.parse(localStorage.getItem("lastSurfacingTool"));
  } else {
    var data = {
      surfaceDiameter: 22,
      surfaceStepover: 40,
      surfaceFeedrate: 800,
      surfaceX: 200,
      surfaceY: 300,
      surfaceDepth: 3,
      surfaceRPM: 1000,
      surfaceZSafe: 10,
      surfaceUnits:'mm',
    };
  }
  $("#surfaceDiameter").val(data.surfaceDiameter);
  $("#surfaceStepover").val(data.surfaceStepover);
  $("#surfaceFeedrate").val(data.surfaceFeedrate);
  $("#surfaceX").val(data.surfaceX);
  $("#surfaceY").val(data.surfaceY);
  $("#surfaceDepth").val(data.surfaceDepth);
  $("#surfaceRPM").val(data.surfaceRPM);
  $("#surfaceZSafe").val(data.surfaceZSafe);
  $("#surfaceUnits").val(data.surfaceUnits);

  var $radios = $("input:radio[name=surfaceType]");
  $radios.filter("[value=" + data.surfaceType + "]").prop("checked", true);

  let unitValue = document.getElementById("surfaceUnits");
  let unitAppend = document.getElementsByClassName("append");

  if (unitValue.value=='in') {

    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='mm'){
        unitAppend[i].textContent = "inch";
      }else if(unitAppend[i].innerHTML=='mm/min'){
        unitAppend[i].textContent = "inch/min";
      }
    }
  } else {
    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='inch'){
        unitAppend[i].textContent = "mm";
      }else if(unitAppend[i].innerHTML=='inch/min'){
        unitAppend[i].textContent = "mm/min";
      }
    }
  }

  Metro.dialog.open("#surfacingDialog");
}

function createSurfaceGcode() {
  var data = {
    surfaceDiameter: $("#surfaceDiameter").val(),
    surfaceStepover: $("#surfaceStepover").val(),
    surfaceFeedrate: $("#surfaceFeedrate").val(),
    surfaceX: $("#surfaceX").val(),
    surfaceY: $("#surfaceY").val(),
    surfaceDepth: $("#surfaceDepth").val(),
    surfaceType: $("input[name='surfaceType']:checked").val(),
    surfaceRPM: $('#surfaceRPM').val(),
    surfaceZSafe: $('#surfaceZSafe').val(),
    surfaceUnits: $('#surfaceUnits').val(),
  };
  console.log(data);
  localStorage.setItem("lastSurfacingTool", JSON.stringify(data));

  let unitTag = 'mm'
  let feedTag = 'mm/min'
  let gcodeTag ='G21'
   if ($('#surfaceUnits').val()=='in') {
     unitTag = 'inch'
     feedTag = 'inches/min'
     gcodeTag ='G20'

  }


  var startpointX = 0 + data.surfaceDiameter / 2;
  var endpointX = data.surfaceX - data.surfaceDiameter / 2;

  var startpointY = 0 + data.surfaceDiameter / 2;
  var endpointY = data.surfaceY - data.surfaceDiameter / 2;

  var lineOver = data.surfaceDiameter * (data.surfaceStepover / 100);

  var gcode =
    `; Surfacing / Flattening Operation
; Endmill Diameter: ` +
    data.surfaceDiameter +` `+
    unitTag +`
; Stepover: ` +
    data.surfaceStepover +
    `%, Feedrate: ` +
    data.surfaceFeedrate + ` ` +
    feedTag +`
; X: ` +
    data.surfaceX +
    `, Y: ` +
    data.surfaceY +
    `, Z: ` +
    data.surfaceDepth +
    `
G54; Work Coordinates
`+ gcodeTag +`; `+ unitTag +`-mode
G90; Absolute Positioning
M3 S` + data.surfaceRPM + `; Spindle On
G4 P1.8 ; Wait for spindle to come up to speed
G0 Z` + data.surfaceZSafe + `
G0 X0 Y0
G1 F` +
    data.surfaceFeedrate + `\n`;

  var reverse = false;

  if (!reverse) {
    gcode +=
      `G0 X` +
      startpointX +
      ` Y` +
      startpointY +
      ` Z` + data.surfaceZSafe + `\n
G1 X` +
      startpointX +
      ` Y` +
      startpointY +
      ` Z-` +
      data.surfaceDepth +
      `\n`;
  } else {
    gcode +=
      `G0 X` +
      endpointX +
      ` Y` +
      startpointY +
      ` Z` + data.surfaceZSafe + `\n
G1 X` +
      endpointX +
      ` Y` +
      startpointY +
      ` Z-` +
      data.surfaceDepth +
      `\n`;
  }

  for (i = startpointY; i.toFixed(4) < endpointY; i += lineOver) {
    if (!reverse) {
      gcode += `G1 Y` + i.toFixed(4) + `\n`;
      gcode += `G1 X` + startpointX + ` Y` + i.toFixed(4) + ` Z-` + data.surfaceDepth + `\n`;
      gcode += `G1 X` + endpointX + ` Y` + i.toFixed(4) + ` Z-` + data.surfaceDepth + `\n`;
      reverse = true;
    } else {
      gcode += `G1 Y` + i.toFixed(4) + `\n`;
      gcode += `G1 X` + endpointX + ` Y` + i.toFixed(4) + ` Z-` + data.surfaceDepth + `\n`;
      gcode += `G1 X` + startpointX + ` Y` + i.toFixed(4) + ` Z-` + data.surfaceDepth + `\n`;
      reverse = false;
    }
  }

  if (!reverse) {
    gcode += `G1 Y` + endpointY + `\n`;
    gcode += `G1 X` + startpointX + ` Y` + endpointY + ` Z-` + data.surfaceDepth + `\n`;
    gcode += `G1 X` + endpointX + ` Y` + endpointY + ` Z-` + data.surfaceDepth + `\n`;
    reverse = true;
  } else {
    gcode += `G1 Y` + endpointY + `\n`;
    gcode += `G1 X` + endpointX + ` Y` + endpointY + ` Z-` + data.surfaceDepth + `\n`;
    gcode += `G1 X` + startpointX + ` Y` + endpointY + ` Z-` + data.surfaceDepth + `\n`;
    reverse = false;
  }

  gcode += `G0 Z` + data.surfaceZSafe + `\n`;

  // Framing Pass
  gcode += `; Framing pass\n`;
  gcode += `G0 X` + startpointX + ` Y` + startpointY + `Z` + data.surfaceZSafe + `\n`; // position at start point
  gcode += `G1 Z-` + data.surfaceDepth + `\n`; // plunge
  gcode += `G1 X` + startpointX + ` Y` + endpointY + `Z-` + data.surfaceDepth + `\n`; // Cut side
  gcode += `G0 Z` + data.surfaceZSafe + `\n`;
  gcode += `G0 X` + endpointX + ` Y` + endpointY + `\n`; // position at start point
  gcode += `G1 Z-` + data.surfaceDepth + `\n`; // plunge
  gcode += `G1 X` + endpointX + ` Y` + startpointY + `Z-` + data.surfaceDepth + `\n`; // Cut side
  gcode += `G0 Z` + data.surfaceZSafe + `\n`;
  gcode += `G0 X0 Y0\n`;
  gcode += `M5 S0\n`;

  editor.session.setValue(gcode);
  parseGcodeInWebWorker(gcode)
  printLog("<span class='fg-red'>[ Surfacing Wizard ] </span><span class='fg-green'>GCODE Loaded</span>")

  // console.log(gcode);
  //
  // $("#gcode").html(gcode.replace(/(?:\r\n|\r|\n)/g, "<br>"));
}



function populateRoundingToolForm() {
  $("#gcode").empty();

  if (localStorage.getItem("lastRoundingTool")) {
    var data = JSON.parse(localStorage.getItem("lastRoundingTool"));
  } else {
    var data = {
      roundingDiameter: 6.35,
      roundingStepover: 40,
      roundingFeedrate: 1500,
      roundingX: 200,
      roundingStartA: 165,
      roundingFinishA: 150,
      roundingDepth: 3,
      roundingZSafe: 10,
      roundUnits:'mm',
    };
  }
  $("#roundDiameter").val(data.roundingDiameter);
  $("#roundStepover").val(data.roundingStepover);
  $("#roundFeedrate").val(data.roundingFeedrate);
  $("#roundX").val(data.roundingX);
  $("#roundStartA").val(data.roundingStartA);
  $("#roundFinishA").val(data.roundingFinishA);
  $("#roundDepth").val(data.roundingDepth);
  $("#roundZSafe").val(data.roundingZSafe);
  $("#roundUnits").val(data.roundUnits);

  var $radios = $("input:radio[name=surfaceType]");
  $radios.filter("[value=" + data.surfaceType + "]").prop("checked", true);

  let unitValue = document.getElementById("roundUnits");
  let unitAppend = document.getElementsByClassName("append");

  if (unitValue.value=='in') {

    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='mm'){
        unitAppend[i].textContent = "inch";
      }else if(unitAppend[i].innerHTML=='mm/min'){
        unitAppend[i].textContent = "inch/min";
      }
    }
  } else {
    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='inch'){
        unitAppend[i].textContent = "mm";
      }else if(unitAppend[i].innerHTML=='inch/min'){
        unitAppend[i].textContent = "mm/min";
      }
    }
  }

  Metro.dialog.open("#roundingDialog");
}


function createRoundingGcode() {
  var data = {
    roundingDiameter: $("#roundDiameter").val(),
    roundingStepover: $("#roundStepover").val(),
    roundingFeedrate: $("#roundFeedrate").val(),
    roundingX: $("#roundX").val(),
    roundingStartA: $("#roundStartA").val(),
    roundingFinishA: $("#roundFinishA").val(),
    roundingDepth: $("#roundDepth").val(),
    roundingZSafe: $("#roundZSafe").val(),
    roundUnits: $('#roundUnits').val(),

  };
  //console.log(data);
  localStorage.setItem("lastRoundingTool", JSON.stringify(data));


  var RoundingStepOver=parseFloat(data.roundingStepover)/100.0
  var rotationCount=Math.ceil(data.roundingX/(data.roundingDiameter*RoundingStepOver));
  var passCount= Math.floor(0.5*(data.roundingStartA-data.roundingFinishA)/data.roundingDepth);
  var passRadius=parseFloat(data.roundingStartA)/2.0
  var passDepth=parseFloat(data.roundingDepth)
  var Xvalue=parseFloat(data.roundingX)
  var FinishRadius=parseFloat(data.roundingFinishA)/2.0
  var FR= parseFloat(data.roundingFeedrate)
  var ZSafe=parseFloat(data.roundingZSafe)


  let unitTag = 'mm'
  let feedTag = 'mm/min'
  let gcodeTag ='G21'
   if ($('#roundUnits').val()=='in') {
     unitTag = 'inches'
     feedTag = 'inches/min'
     gcodeTag ='G20'

  }


  //console.log(data);
  var gcode =
`; Surfacing / Rounding Operation
; Endmill Diameter: ` +  data.roundingDiameter + ` `+ unitTag +`
; Stepover: ` + data.roundingStepover + `%
; Feedrate: ` + data.roundingFeedrate +` `+ feedTag + `
; X Length: ` +  data.roundingX +` `+ unitTag +`
; Start Diameter: ` + data.roundingStartA + ` ` + unitTag + `
; Project Diameter: ` + data.roundingFinishA + ` ` +unitTag +`

G54; Work Coordinates
`+ gcodeTag +`; `+ unitTag +`-mode
G90; Absolute Positioning
M3 S1000 ;Spindle On
G4 P1.8 ; Wait for spindle to come up to speed\n`

  gcode +=`G0 Z` + (passRadius+ZSafe) + `\n`
  gcode += `G0 X0 A0\n`
  gcode +=`G0 Z`+ (passRadius) +`\n` 

  for(i=0;i<passCount;i++){
    gcode +=`G1 Z`+ (passRadius-passDepth*(i+1)) + ` F`+ FR +`\n`;
    gcode += 'G1 X' + Xvalue + ` A` + rotationCount*360 + `\n`;
    gcode += `G92 A0 ; reset A0\n`
    gcode += `G0 Z` + (passRadius+ZSafe) + ` A0\n`
    gcode += 'G0 X0\n'
    gcode += `G0 Z`+ (passRadius) +`\n`

  }

  if(passRadius-passDepth*passCount>FinishRadius){  // partial pass depth if needed
      gcode +=`G1 Z`+ (FinishRadius).toFixed(4) + ` F`+ FR +`\n`;
      gcode += 'G1 X' + Xvalue + ` A` + rotationCount*360 + `\n`;
      gcode += `G92 A0 ; reset A0\n`
      gcode += `G0 Z` + (passRadius+ZSafe) + ` A0\n`
      gcode += 'G0 X0\n'
  }

  gcode += `G0 Z`+ (passRadius+ZSafe).toFixed(4) +`\n`;
  gcode += `G0 X0 A0\n`;
  gcode += `M5 S0\n`;

  console.log(gcode);

  editor.session.setValue(gcode);
  parseGcodeInWebWorker(gcode)
  printLog("<span class='fg-red'>[ Rounding Wizard ] </span><span class='fg-green'>GCODE Loaded</span>")

}


function changeSurfaceUnits(){


  let unitValue = document.getElementById("surfaceUnits");
  let unitAppend = document.getElementsByClassName("append");


  if (unitValue.value=='in') {

    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='mm'){
        unitAppend[i].textContent = "inch";
      }else if(unitAppend[i].innerHTML=='mm/min'){
        unitAppend[i].textContent = "inch/min";
      }
    }
    $("#surfaceDiameter").val(($("#surfaceDiameter").val()/25.4).toFixed(4));
    $("#surfaceFeedrate").val(($("#surfaceFeedrate").val()/25.4).toFixed(4));
    $("#surfaceX").val(($("#surfaceX").val()/25.4).toFixed(4));
    $("#surfaceY").val(($("#surfaceY").val()/25.4).toFixed(4));
    $("#surfaceDepth").val(($("#surfaceDepth").val()/25.4).toFixed(4));
    $("#surfaceZSafe").val(($("#surfaceZSafe").val()/25.4).toFixed(4));


  } else {
    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='inch'){
        unitAppend[i].textContent = "mm";
      }else if(unitAppend[i].innerHTML=='inch/min'){
        unitAppend[i].textContent = "mm/min";
      }
      
    }
    $("#surfaceDiameter").val(($("#surfaceDiameter").val()*25.4).toFixed(3));
    $("#surfaceFeedrate").val(($("#surfaceFeedrate").val()*25.4).toFixed(3));
    $("#surfaceX").val(($("#surfaceX").val()*25.4).toFixed(3));
    $("#surfaceY").val(($("#surfaceY").val()*25.4).toFixed(3));
    $("#surfaceDepth").val(($("#surfaceDepth").val()*25.4).toFixed(3));
    $("#surfaceZSafe").val(($("#surfaceZSafe").val()*25.4).toFixed(3));
  }

  
}



function changeRoundUnits(){


  let unitValue = document.getElementById("roundUnits");
  let unitAppend = document.getElementsByClassName("append");


  if (unitValue.value=='in') {

    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='mm'){
        unitAppend[i].textContent = "inch";
      }else if(unitAppend[i].innerHTML=='mm/min'){
        unitAppend[i].textContent = "inch/min";
      }
    }
    $("#roundDiameter").val(($("#roundDiameter").val()/25.4).toFixed(4));
    $("#roundFeedrate").val(($("#roundFeedrate").val()/25.4).toFixed(4));
    $("#roundX").val(($("#roundX").val()/25.4).toFixed(4));
    $("#roundStartA").val(($("#roundStartA").val()/25.4).toFixed(4));
    $("#roundFinishA").val(($("#roundFinishA").val()/25.4).toFixed(4));
    $("#roundDepth").val(($("#roundDepth").val()/25.4).toFixed(4));
    $("#roundZSafe").val(($("#roundZSafe").val()/25.4).toFixed(4));








  } else {
    for (let i = 0; i < unitAppend.length; i++) {
      if(unitAppend[i].innerHTML=='inch'){
        unitAppend[i].textContent = "mm";
      }else if(unitAppend[i].innerHTML=='inch/min'){
        unitAppend[i].textContent = "mm/min";
      }
      
    }
    $("#roundDiameter").val(($("#roundDiameter").val()*25.4).toFixed(3));
    $("#roundFeedrate").val(($("#roundFeedrate").val()*25.4).toFixed(3));
    $("#roundX").val(($("#roundX").val()*25.4).toFixed(3));
    $("#roundStartA").val(($("#roundStartA").val()*25.4).toFixed(4));
    $("#roundFinishA").val(($("#roundFinishA").val()*25.4).toFixed(4));
    $("#roundDepth").val(($("#roundDepth").val()*25.4).toFixed(3));
    $("#roundZSafe").val(($("#roundZSafe").val()*25.4).toFixed(3));
  }

  
}