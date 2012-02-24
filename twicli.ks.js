var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>twicli</name>
    <name lang="ja">twicli</name>
    <description>twicli plugin</description>
    <description lang="ja">twicli plugin</description>
    <version>0.1</version>
    <updateURL>http://github.com/mooz/keysnail/raw/master/plugins/hello-plugin.ks.js</updateURL>
    <iconURL>http://github.com/mooz/keysnail/raw/master/plugins/icon/hello-plugin.icon.png</iconURL>
    <author mail="" homepage="http://10sr.jottit.com">10sr</author>
    <license>NYSL</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Usage ===
            Nothing.
    ]]></detail>
    </KeySnailPlugin>;

function loadScript(s){
    window.content.location.href = "javascript:" + encodeURIComponent(s);
}

function twicliSwitchTL(){
    loadScript("switchTL()");
}

function twicliSwitchReply(){
    loadScript("switchReply()");
}

function twicliSwitchUser(){
    prompt.reader({
        message : "User:",
        callback : function(user){
        loadScript("switchUser(\"" + user + "\")");
        }
    });
}

plugins.withProvides(function (provide) {
    provide("twicli-switch-TL", twicliSwitchTL, "switch to tl");
    provide("twicli-switch-reply", twicliSwitchReply, "switch to tl");
    provide("twicli-switch-user", twicliSwitchUser, "switch to tl");
}, PLUGIN_INFO);

