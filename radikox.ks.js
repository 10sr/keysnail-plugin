var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>radikox</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/radikox.ks.js</updateURL>
    <description>Controll radikox</description>
    <version>0.1</version>
    <author mail="" homepage="http://10sr.jottit.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Overview ===
            Controll radikox firefox extension from keysnail.
            Radikox installation is required.
            https://addons.mozilla.org/ja/firefox/addon/radikox/
            ]]></detail>
    </KeySnailPlugin>;

function togglePlayPause(){
    radikox.turn_power();
    radikox.power();
    displayInfo();
}

function pauseRadiko(){
    radikox.turn_power_off();
    radikox.power();
    displayInfo();
}

function playRadiko(){
    radikox.turn_power_on();
    radikox.power();
    displayInfo();
}

function isPlaying(){
    return document.getElementById ("radikox_menuitem_power").getAttribute ("checked") == "true";
}

function displayInfo(){
    if(isPlaying()){
        var i = getInfo(radikox.currentPlayer, radikox.currentStation)[0];
        display.prettyPrint("Radikox : " + 
                            radikox[radikox.currentPlayer].stationDict[radikox.currentStation] + 
                            (i ? " " + i : "") , {
                                timeout : 5 * 1000
                            });
    }else{
        display.prettyPrint("Radikox : Not Playing.", {
            timeout : 5 * 1000
        });
    }
}

function getInfo(p, s){
    if(p == "radiko"){
        var m = radikox.radiko.getProgInfo(s).match(/^([^\n]*)\n([^\n]*)/);
        return m ? [m[1], m[2]] : ["", ""];
    }else{
        return ["", ""];
    }
}

function changeStation(p, s){
    radikox.changeStation(p, s);
    if(!isPlaying()){
        playRadiko();
    }
    displayInfo();
}

function selectStation(){
    // var m = document.getElementById("radikox_menupopup");
    var ri = {};
    for (s in radikox.radiko.stationDict){
        ri[s] = getInfo("radiko", s);
    }
    var r = [[radikox.radiko.stationDict[s], ri[s][0], ri[s][1], s, "radiko"] for (s in radikox.radiko.stationDict)];
    var f = [[radikox.fukkou.stationDict[s], "", "", s, "fukkou"] for (s in radikox.fukkou.stationDict)];
    var n = [[radikox.nhk.stationDict[s], "", "", s, "nhk"] for (s in radikox.nhk.stationDict)];
    var a = r.concat(f, n);
    prompt.selector(
        {
            messsage : "Select station:",
            collection : a,
            header : ["Name", "Current Program", "Next Program", "Key", "Player"],
            width : [20, 30, 30, 10, 10],
            callback : function(i){
                changeStation(a[i][4], a[i][3]);
            }
        }
    );
}

plugins.withProvides(function (provide) {
    provide("radikox-play-pause", togglePlayPause, "radikox toggle play/pause");
    provide("radikox-play", playRadiko, "radikox play");
    provide("radikox-pause", pauseRadiko, "radikox pause");
    provide("radikox-select-station", selectStation, "radikox select station with selector");
    provide("radikox-display-info", displayInfo, "radikox display info");
}, PLUGIN_INFO);
