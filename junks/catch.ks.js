var PLUGIN_INFO =
        <KeySnailPlugin>
        <name>catch</name>
        <updateURL>
        https://raw.github.com/10sr/keysnail-plugin/master/catch.ks.js
    </updateURL>
    <description>Post current page to catch</description>
    <version>0.2</version>
    <author mail="" homepage="http://10sr.github.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.8.3</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Usage ===
    ]]></detail>
    </KeySnailPlugin>;

const AUTH_PREF = "extensions.keysnail.plugins.catch.auth.token";
const CATCH_URL = "https://api.catch.com/v3";

/**
 * Request to catch.com.
 * @param {string} met Http Method like "POST" or "GET".
 * @param {string} url URL like "/streams/default".
 * @param {object} opts Object for request. Have members like "header", "parmas"
 *     and "callback".
 */
function reqURL(met, url, opts){
    // var token = util.getUnicharPref(AUTH_PREF) || "";
    var uname = "";
    var passwd = "";
    var passwordManager = (Cc["@mozilla.org/login-manager;1"].
                           getService(Ci.nsILoginManager));
    var logins = passwordManager.findLogins({}, "https://catch.com", "", null);
    for (var i = 0; i < logins.length; i++) {
        if (logins[i].username != "") {
            uname = logins[i].username;
            passwd = logins[i].password;
            break;
        }
    }

    opts = opts || {};
    opts.header = opts.header || {};
    opts.header["Authorization"] = "Basic " + window.btoa(uname + ":" + passwd);

    // alert(username + password);
    met = met.toLowerCase();
    if (met == "get") {
        util.requestGet(CATCH_URL + url, opts);
    } else if (met == "post") {
        util.requestPost(CATCH_URL + url, opts);
    }
}

function _getToken(){
    var username = "";
    var password = "";
    var passwordManager = (Cc["@mozilla.org/login-manager;1"].
                           getService(Ci.nsILoginManager));
    var logins = passwordManager.findLogins({}, "https://catch.com", "", null);
    for (var i = 0; i < logins.length; i++) {
        if (logins[i].username != "") {
            username = logins[i].username;
            password = logins[i].password;
            break;
        }
    }
    display.echoStatusBar("Catch: authenticating...");
    util.request("POST", "https://api.catch.com/v2/user.json", {
        header : {
            Authorization : "Basic " + window.btoa(username + ":" + password)
        },
        callback : function(xhr){
            if (xhr.readyState === 4 && xhr.status === 200) {
                display.showPopup("Catch", "Authentication done.");
                display.echoStatusBar("Catch: Authenticating...done.");
                var json = util.safeEval("(" + xhr.responseText + ")");
                util.setUnicharPref(AUTH_PREF, json.user.auth_token);
            }else{
                display.showPopup("Catch", "Failed to authenticate!");
                display.echoStatusBar("Catch: Failed to authenticate!");
            }
        }
    });
}

/**
 * Post text to catch.com.
 * @param {string} text Text to post.
 */
function postNoteToDefault(text){
    reqURL("post", "/streams/default", {
        params : {
            text : encodeURIComponent(text)
        },
        callback : function(xhr){
            if(xhr.readyState === 4 && xhr.status === 200){
                display.showPopup("Catch", "Post done.");
                // var json = util.safeEval("(" + xhr.responseText + ")");
                // alert(json.user.auth_token);
            }else{
                display.showPopup("Catch", "Error! " + xhr.status.toString());
                // alert(xhr.responseText);
            }
        }
    });
}

/**
 * Post current tab with comment.
 */
function postCurrentTabWithComment(){
    var tab = gBrowser.selectedTab;
    var url = tab.linkedBrowser.contentWindow.location.href;
    var title = tab.label;
    prompt.reader({
        message : "Catch comment:",
        initialInput : window.content.document.getSelection(),
        callback : function(cm){
            postNoteToDefault([title, url, cm].join("\n"));
        }
    });
}

plugins.withProvides(function (provide) {
    provide("catch-post-url", function(){
        postCurrentTabWithComment();
    }, "Post current url and title to catch.com default streams with comment.");
}, PLUGIN_INFO);
