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

function execScript(s){
    window.content.location.href = "javascript:" + encodeURIComponent(s);
}

function twicliSwitchTL(){
    execScript("switchTL()");
}

function twicliSwitchReply(){
    execScript("switchReply()");
}

function twicliSwitchUser(){
    prompt.reader({
        message : "User:",
        callback : function(user){
            execScript("switchUser(\"" + user + "\")");
        }
    });
}

function twicliSearch(){
    prompt.reader({
        message : "Search query:",
        callback : function(q){
            execScript("twsSearch(\"" + q + "\")");
        }
    });
}

function twicliUpdateList(){
    execScript("twlGetListStatus()");
}

plugins.withProvides(function (provide) {
    provide("twicli-switch-TL", twicliSwitchTL, "switch to tl");
    provide("twicli-switch-reply", twicliSwitchReply, "switch to tl");
    provide("twicli-switch-user", twicliSwitchUser, "switch to tl");
    // provide("twicli-search", twicliSearch, "switch to tl");
    // provide("twicli-update list", twicliUpdateList, "switch to tl");
}, PLUGIN_INFO);

