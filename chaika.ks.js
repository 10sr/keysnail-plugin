var PLUGIN_INFO =
        <KeySnailPlugin>
        <name>chaika</name>
        <description>chaika keysnail plugin</description>
        <version>0.1.2</version>
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
function randomizePort(){
    util.setIntPref("extensions.chaika.server_port.firefox",
                    8800 + Math.floor(Math.random() * 30));
}

function openPostWindow(res){
    var curl = window.content.location.href;
    var kurl = curl.replace(/http:.*thread\/(.*\/).*/, "chaika://post/$1");
    // window.content.location.href = kurl;
    window.content.location.href = kurl;
}

function reloadPage(){
    evalCode("ThreadDocument.reload()");
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

function showLatest50(){
    window.content.location.href = getBaseURL() + "/l50";
}

function showFirst10(){
    window.content.location.href = getBaseURL() + "/1-10";
}

function showAll(){
    evalCode("ThreadDocument.showAll()");
}


function enableDigest(){
    evalCode("Digest.enabled()");
}

function openInBrowser(){
    evalCode("ThreadDocument.showBrowser()");
}

function jumpTo(){
    prompt.reader({
        message : "Num to jump to",
        callback : function(s){
            if (s) {
                evalCode("ThreadDocument.DirectjumpTo(" + s + ")");
            }
        }
    });
}

function showLatest(){
    prompt.reader({
        message : "Num to show latest",
        callback : function(s){
            if (s) {
                window.content.location.href = getBaseURL() + "/l" + s;
            }
        }
    });
}

function openInChaika(){
    document.getElementById("chaika-thread-toolbaritem")._viewChaika();
}

function goToBorad(){
    window.content.location.href =
        window.content.document.
        getElementById("boardName").getAttribute("href");
}

function scrollToNew(){
    evalCode("ThreadDocument.scrollToNewRes()");
}

function findNextThread(){
    var aAddTab = true;
    var ti = window.document.getElementById("chaika-thread-toolbaritem");
    if (ti) {
        ti._findNextThread(aAddTab);
    }
}


plugins.withProvides(function (provide) {
    // provide("instapaper-post-page-with-comment", function(){
    //     postWithComment(gBrowser.selectedTab);
    // }, "post page and comment");
    provide("chaika-post", openPostWindow, "post");
    provide("chaika-reload", reloadPage, "reload");
    provide("chaika-find", readFind, "find");
    provide("chaika-show-latest-50", showLatest50, "show latest 50");
    provide("chaika-show-first-10", showFirst10, "show first 10");
    provide("chaika-show-all", showAll, "show all");
    provide("chaika-enable-digest", enableDigest, "enable digest");
    provide("chaika-open-in-browser", openInBrowser, "open in browser");
    provide("chaika-jump-to", jumpTo, "prompt num to jump to");
    provide("chaika-show-latest", showLatest, "prompt num and show latest");
    provide("chaika-find-next-thread", findNextThread, "prompt num and show latest");

    provide("chaika-open-in-chaika", openInChaika, "open in chaika");
    provide("chaika-goto-board", goToBorad, "go to ita");
    provide("chaika-scroll-to-new", scrollToNew, "scroll to new res");
}, PLUGIN_INFO);
