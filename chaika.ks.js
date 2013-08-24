var PLUGIN_INFO =
        <KeySnailPlugin>
        <name>chaika</name>
        <description>chaika keysnail plugin</description>
        <version>0.1</version>
        <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/chaika.ks.js</updateURL>
        <author homepage="http://10sr.github.com">10sr</author>
        <license>NYSL 0.9982</license>
        <minVersion>1.0</minVersion>
        <include>main</include>
        <detail><![CDATA[
                === Usage ===

            chaika

        ]]></detail>
    </KeySnailPlugin>;

function evalCode(s){
    window.loadURI("javascript:" + encodeURIComponent(s));
}

function openPostWindow(res){
    var curl = window.content.location.href;
    var kurl = curl.replqce(/http:.*thread\/(.*\/).*/, "chaika://post/$1");
    // window.content.location.href = kurl;
    window.loadURI(kurl);
}

function randomizePort(){
    util.setIntPref("extensions.chaika.server_port.firefox",
                    8800 + Math.floor(Math.random() * 30));
}

function reloadPage(){
    window.BrowserReload();
}


function readFind(){
    function find(s){
        evalCode("Nodes.findBoxText.value='" + s + "';" +
                 "FindBox.find();");
        // evalCode("FindBox.show()");
    }

    prompt.reader({
        message : "Search word?",
        callback : function(s){
            find(s);
        }
    });
}

function showAll(){
    evalCode("ThreadDocument.showAll()");
}

function getBaseURL(){
    // http://127.0.0.1:8803/thread/http://anago.2ch.net/test/read.cgi/
    // applism/1376548627/l10
    // =>
    // http://127.0.0.1:8803/thread/http://anago.2ch.net/test/read.cgi/
    // applism/1376548627
    return window.content.location.href.match(
            /^[^/]*\/\/[^/]*\/[^/]*\/[^/]*\/\/[^/]*\/[^/]*\/[^/]*\/[^/]*\/[^/]*/
    );
}

function showLatest50(){
    window.loadURI(getBaseURL + "/l50");
}

plugins.withProvides(function (provide) {
    // provide("instapaper-post-page-with-comment", function(){
    //     postWithComment(gBrowser.selectedTab);
    // }, "post page and comment");
    provide("chaika-find", readFind, "chaika find");
    provide("chaika-post", openPostWindow, "chaika post");
    provide("chaika-show-all", showAll, "chaika show all");
    provide("chaika-show-latest-50", showLatest50, "chaika show latest 50");
}, PLUGIN_INFO);