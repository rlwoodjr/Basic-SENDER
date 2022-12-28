$(document).ready(function() {
  var backupFileOpen = document.getElementById('grblBackupFile');
  if (backupFileOpen) {
    backupFileOpen.addEventListener('change', readGrblBackupFile, false);
  }
});

function readGrblBackupFile(evt) {
  var files = evt.target.files || evt.dataTransfer.files;
  loadGrblBackupFile(files[0]);
  document.getElementById('grblBackupFile').value = '';

}

function loadGrblBackupFile(f) {
  if (f) {
    // Filereader
    var r = new FileReader();
    // if (f.name.match(/.gcode$/i)) {
    r.readAsText(f);
    r.onload = function(event) {
      //var grblsettingsfile = this.result
      //console.log(this.result)
      var data = this.result.split("\n");
      for (i = 0; i < data.length; i++) {
        if (data[i].indexOf("$I=") == 0) {
          setMachineButton(data[i].split('=')[1])
        } else {
          var key = data[i].split('=')[0];
          var param = data[i].split('=')[1]
          $("#val-" + key.substring(1) + "-input").val(parseFloat(param))
          fixGrblHALSettings(key.substring(1)); // Fix GrblHAL Defaults
        }
      };

      checkifchanged();
      enableLimits(); // Enable or Disable
      displayDirInvert();
    }
  }
}

function backupGrblSettings() {
  var grblBackup = ""
  for (key in grblParams) {
    var key2 = key.split('=')[0].substr(1);

    if (grblSettingsTemplate2[key2] !== undefined) {
      var descr = grblSettingsTemplate2[key2].title
    } else {
      var descr = "unknown"
    }

    grblBackup += key + "=" + grblParams[key] + "  ;  " + descr + "\n"
  }
  if (laststatus.machine.name.length > 0) {
    grblBackup += "$I=" + laststatus.machine.name
  }
  var blob = new Blob([grblBackup], {
    type: "plain/text"
  });
  var date = new Date();
  if (laststatus.machine.name.length > 0) {
    invokeSaveAsDialog(blob, 'grbl-settings-backup-' + laststatus.machine.name + "-" + date.yyyymmdd() + '.txt');
  } else {
    invokeSaveAsDialog(blob, 'grbl-settings-backup-' + date.yyyymmdd() + '.txt');
  }

}

function grblSettings(data) {
  // console.log(data)
  var template = ``
  grblconfig = data.split('\n')
  for (i = 0; i < grblconfig.length; i++) {
    var key = grblconfig[i].split('=')[0];
    var param = grblconfig[i].split('=')[1]
    grblParams[key] = param
  }

  if (grblParams['$22'] == 1) {
    $('#homeBtn').attr('disabled', false)
    $('#gotoXzeroMpos').removeClass('disabled')
    $('#gotoYzeroMpos').removeClass('disabled')
    $('#gotoZzeroMpos').removeClass('disabled')
    $('#gotoAzeroMpos').removeClass('disabled')
    $('.PullOffMPos').html("-" + grblParams['$27'])
  } else {
    $('#homeBtn').attr('disabled', true)
    $('#gotoXzeroMpos').addClass('disabled')
    $('#gotoYzeroMpos').addClass('disabled')
    $('#gotoZzeroMpos').addClass('disabled')
    $('#gotoAzeroMpos').removeClass('disabled')
  }

  if (grblParams['$20'] == 0) {
    document.getElementById('softlimitsbtn').innerHTML = 'Soft' + '<br>' + 'Limits Off'
    $('#softlimiticon').removeClass('fg-green')
    $('#softlimiticon').addClass('fg-red')
}else{
    document.getElementById('softlimitsbtn').innerHTML = 'Soft' + '<br>' + 'Limits On'
    $('#softlimiticon').removeClass('fg-red')
    $('#softlimiticon').addClass('fg-green')
  }

  if (grblParams['$32'] == 1) {
    $('#enLaser').removeClass('alert').addClass('success').html('ON')
  } else {
    $('#enLaser').removeClass('success').addClass('alert').html('OFF')
  }

  updateToolOnSValues();

  if (localStorage.getItem('jogOverride')) {
    jogOverride(localStorage.getItem('jogOverride'))
  } else {
    jogOverride(100);
  }
}



function clearSettings() {
  Metro.dialog.create({
    title: "Are you sure?",
    content: "<div>Resetting the Grbl Settings will restore all the settings to factory defaults, but will keep other EEPROM settings intact. Would you like to continue?</div>",
    clsDialog: 'dark',
    actions: [{
        caption: "Yes",
        cls: "js-dialog-close success",
        onclick: function() {
          sendGcode('$RST=$');
          refreshGrblSettings()
        }
      },
      {
        caption: "Cancel",
        cls: "js-dialog-close",
        onclick: function() {
          refreshGrblSettings();
        }
      }
    ]
  });
}

function clearWCO() {
  Metro.dialog.create({
    title: "Are you sure?",
    content: "<div>Resetting the Work Coordinate Systems will erase all the coordinate system offsets currently stored in the EEPROM on the controller. Would you like to continue?</div>",
    clsDialog: 'dark',
    actions: [{
        caption: "Yes",
        cls: "js-dialog-close success",
        onclick: function() {
          sendGcode('$RST=#');
          refreshGrblSettings()
        }
      },
      {
        caption: "Cancel",
        cls: "js-dialog-close",
        onclick: function() {
          refreshGrblSettings();
        }
      }
    ]
  });
}

function clearEEPROM() {
  Metro.dialog.create({
    title: "Are you sure?",
    content: "<div>Resetting the EEPROM will erase all the Grbl Firmware settings from your controller, effectively resetting it back to factory defaults. Would you like to continue?</div>",
    clsDialog: 'dark',
    actions: [{
        caption: "Yes",
        cls: "js-dialog-close success",
        onclick: function() {
          sendGcode('$RST=*');
          refreshGrblSettings()
        }
      },
      {
        caption: "Cancel",
        cls: "js-dialog-close",
        onclick: function() {
          refreshGrblSettings();
        }
      }
    ]
  });
}

function updateToolOnSValues() {
  $(".ToolOnS1").html((parseInt(grblParams.$30) * 0.01).toFixed(0))
  $(".ToolOnS5").html((parseInt(grblParams.$30) * 0.05).toFixed(0))
  $(".ToolOnS10").html((parseInt(grblParams.$30) * 0.1).toFixed(0))
  $(".ToolOnS25").html((parseInt(grblParams.$30) * 0.25).toFixed(0))
  $(".ToolOnS50").html((parseInt(grblParams.$30) * 0.5).toFixed(0))
  $(".ToolOnS75").html((parseInt(grblParams.$30) * 0.75).toFixed(0))
  $(".ToolOnS100").html(parseInt(grblParams.$30).toFixed(0))
}