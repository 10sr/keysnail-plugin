var PLUGIN_INFO =
        <KeySnailPlugin>
        <name>catch</name>
        <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/catch.ks.js</updateURL>
        <description>Post current page to catch</description>
        <version>0.1</version>
        <author mail="" homepage="http://10sr.github.com/">10sr</author>
        <license>NYSL</license>
        <minVersion>1.8.3</minVersion>
        <include>main</include>
        <detail><![CDATA[
                === Usage ===
        ]]></detail>
    </KeySnailPlugin>;

// function req(met, url, params){
//     util.request(met, "https://api.catch.com/v2/" + url, params);
// }

const AUTH_PREF = "extensions.keysnail.plugins.catch.auth.token";

function req(met, url, opts){
    // opts = opts || {};
    // opts.params = opts.params || {};
    // opts.params["bearer_token"] = util.getUnicharPref(pref_key) || "";

    // util.request(met, "https://api.catch.com/v2/" + url, opts); 

    var token = util.getUnicharPref(AUTH_PREF) || "";
    util.request(met, "https://api.catch.com/v2/" + url + "?" + "bearer_token=" + token, opts);
}

function get_token(){
    var username = "";
    var password = "";
    var passwordManager = (Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager));
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

function post_note(text, mode){
    req("POST", "notes.json", {
        params : {
            source : "catch.ks.js",
            text : text,
            mode : mode || "private"
        },
        callback : function(xhr){
            if(xhr.readyState === 4 && xhr.status === 200){
                display.showPopup("Catch", "post done");
            }else{
                display.showPopup("Catch", "error!" + xhr.status.toString());
            }
        }
    });
}

function get_notes(){
    req("GET", "notes.json", {
        callback : function(xhr){
            if(xhr.readyState === 4 && xhr.status === 200){
                display.showPopup("Catch", "post done");
                alert(xhr.responseText);
            }else{
                display.showPopup("Catch", "error!" + xhr.status.toString());
            }
        }
    });
}

function comment(tab){
    var cmfunc = plugins.options["catch.initial_comment_function"] || function(){
        return "";
    };
    prompt.reader({
        message : "Catch comment:",
        initialInput : content.document.getSelection() + cmfunc(),
        callback : function(cm){ post(tab, cm); }
    });
}

function post(){
    // var url = tab.linkedBrowser.contentWindow.location.href;
    var url = window.content.location.href;
    // var title = tab.label;
    var username = "";
    var password = "";
    var passwordManager = (Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager));
    var logins = passwordManager.findLogins({}, "https://catch.com", "", null);
    for (var i = 0; i < logins.length; i++) {
        if (logins[i].username != "") {
            username = logins[i].username;
            password = logins[i].password;
            break;
        }
    }

    // alert(username + password);
    display.echoStatusBar("Catch: adding \"" + url + "\"...");
    util.requestPost("https://api.catch.com/v3/streams/default", {
        params : {
            // username : encodeURIComponent(username),
            // password : encodeURIComponent(password),
            text : encodeURIComponent(url)
            // title : encodeURIComponent(title),
            // selection : encodeURIComponent(cm),
        },
        header : {
            Authorization : "Basic " + window.btoa(username + ":" + password)
        },
        callback : function(xhr){
            display.echoStatusBar(xhr.status);
            if (xhr.readyState === 4 && xhr.status === 200) {
                // var title = decodeURIComponent(xhr.getResponseHeader("X-Catch-Title")); //超文字化けする
                display.showPopup("Catch", "Page \"" + title + "\" added successfully.");
                display.echoStatusBar("Catch: adding \"" + url + "\"...done.");
                // plugins.options["catch.close_after_post"] && gBrowser.removeTab(tab);
                var json = util.safeEval("(" + xhr.responseText + ")");
                alert(json.user.auth_token);
            }else{
                display.showPopup("Catch", "failed!");
                // display.echoStatusBar("Catch: Something wrong has happended!");
                // gBrowser.selectedTab = gBrowser.addTab("http://www.catch.com/edit?url=" + encodeURIComponent(url) + 
                //                                        "&title=" + encodeURIComponent(title) + 
                //                                        "&summary=" + encodeURIComponent(cm));
            }
        }
    });
}

plugins.withProvides(function (provide) {
    provide("catch-authenticate", function(){
        get_token();
    }, "catch authenticate");
    provide("catch-post-url", function(){
        post();
    }, "post url");
    provide("catch-get-notes", function(){
        get_notes();
    }, "get notes");
}, PLUGIN_INFO);
