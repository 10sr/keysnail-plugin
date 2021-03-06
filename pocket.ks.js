var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>pocket</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/pocket.ks.js</updateURL>
    <description>pocket keysnail plugin</description>
    <version>0.1.4</version>
    <author mail="" homepage="http://10sr.github.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.8.3</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Usage ===
            Pocket client.
    ]]></detail>
    </KeySnailPlugin>;

const CONSUMER_KEY = "17747-cde16cb500e9b1e34bbd27d7";

const PREF_PREFIX = "extensions.keysnail.plugins.pocket.";

/////////////////////////////////////
// utilities

function setUnicharPref(key, value){
    return util.setUnicharPref(PREF_PREFIX + key, value);
}

function getUnicharPref(key){
    return util.getUnicharPref(PREF_PREFIX + key);
}

function decodeJSON(jsonstr){
    return util.safeEval("(" + jsonstr + ")");
}

function showPopup(body){
    return display.showPopup("Pocket", body);
}

/**
 * Request to getpocket.com.
 * @param {string} path Path to request.
 * @param {string} method Http method."POST" or "GET".
 * @param {object} opts Object of request parameter.
 */
function reqPocket(path, method, opts){
    const URL = "https://getpocket.com";
    opts = opts || {};
    opts.header = opts.header || {};
    opts.header["Content-Type"] =
        "application/x-www-form-urlencoded; charset=UTF=8";
    opts.header["X-Accept"] = "application/json";
    return util.request(method.toUpperCase(),
                        URL + path,
                        opts);
}

function reqPocketWithAuth(path, method, opts){
    var acctoken = getUnicharPref("access_token");
    if (! acctoken) {
        showPopup("Not authorized yet. Use \"pocket-authorize\".");
    } else {
        opts = opts || {};
        opts.params = opts.params || {};
        opts.params["consumer_key"] = CONSUMER_KEY;
        opts.params["access_token"] = acctoken;
        return reqPocket(path, method, opts);
    }
}

function authPocket(){
    function openAuthTab(redirecturi, reqtoken){
        window.openUILinkIn(
            "https://getpocket.com/auth/authorize?" +
                util.paramsToString({
                    request_token : reqtoken,
                    redirect_uri : redirecturi
                }) ,
            "tab");
    }

    function getAccToken(reqtoken){
        reqPocket(
            "/v3/oauth/authorize",
            "POST",
            {
                params : {
                    consumer_key : CONSUMER_KEY,
                    code : reqtoken
                },
                callback : function(xhr){
                    if (xhr.status == 200) {
                        var res = decodeJSON(xhr.responseText);
                        var acctoken = res.access_token;
                        var username = res.username;
                        setUnicharPref("access_token", acctoken);
                        setUnicharPref("username", username);
                        showPopup("Auth done as user " + username);
                    }
                }
            }
        );
    }

    function waitAuthAndGetAccToken(reqtoken){
        prompt.reader({
            message : "Emit after authorization finished",
            callback : function(text){
                getAccToken(reqtoken);
            }
        });
    }

    var redirect_uri = "https://github.com/mooz/keysnail/wiki";

    reqPocket(
        "/v3/oauth/request",
        "POST",
        {
            params : {
                consumer_key : CONSUMER_KEY,
                redirect_uri : encodeURIComponent(redirect_uri)
            },
            callback : function(xhr){
                if (xhr.status === 200) {
                    var reqtoken = decodeJSON(xhr.responseText)["code"];
                    waitAuthAndGetAccToken(reqtoken);
                    openAuthTab(redirect_uri, reqtoken);
                } else {
                    showPopup("Failed to authorize! " + xhr.responseText);
                }
            }
        }
    );
}

function addTab(tab){
    var url = tab.linkedBrowser.contentWindow.location.href;
    var title = tab.label;

    reqPocketWithAuth(
        "/v3/add",
        "POST",
        {
            params : {
                url : encodeURIComponent(url)
            },
            callback : function(xhr){
                if (xhr.status == 200) {
                    showPopup("Page \"" + title + "\" added successfully.");
                    // plugins.options["instapaper.close_after_post"] &&
                    //     gBrowser.removeTab(tab);
                } else {
                    showPopup("Posting \"" + title + "\" failed! " +
                              xhr.responseText);
                }
            }
        }
    );
}

////////////////////////////////////////////////////////////////////
// exts

function addCurrentTab(){
    addTab(gBrowser.selectedTab);
}

function retrieveData(params, func){
    params = params || {};
    reqPocketWithAuth(
        "/v3/get",
        "POST",
        {
            params : params,
            callback : function(xhr){
                if (xhr.status == 200) {
                    // alert(xhr.responseText);
                    func(xhr);
                } else {
                    showPopup("Failed to get data!");
                }
            }
        }
    );
}

function getLatest10(){
    retrieveData({
        count : "10",
        state : "unread"
    }, function(xhr){
        // TODO: use selector
        return;
    });
}

function getOpenLatest(){
    // get latest entry and delete it
    retrieveData({
        count : "1",
        state : "unread"
    }, function(xhr){
        var res = decodeJSON(xhr.responseText);
        if (res.status !== 1) {
            showPopup("Retrieve failed");
            return
        }
        for (var key in res.list) {
            var elem = res.list[key];
            if (elem) {
                if (elem["resolved_title"]) {
                    showPopup("Now opening \"" + elem["resolved_title"] + "\"");
                    window.openUILinkIn(elem["resolved_url"], "tab");
                } else if (elem["given_url"]) {
                    showPopup("Now opening \"" + elem["given_url"] + "\"");
                    window.openUILinkIn(elem["given_url"], "tab");
                } else {
                    showPopup("Cannot parse result");
                    window.alert(xhr.responseText);
                }
            }
        }
        return;
    });
}

plugins.withProvides(function (provide) {
    provide("pocket-authorize", authPocket, "Auth pocket");
    provide("pocket-add-current", addCurrentTab, "Add current page");
    provide("pocket-open-latest", getOpenLatest, "Open last saved page");
    provide("pocket-get-latest-10", getLatest10, "Get latest 10 data");
}, PLUGIN_INFO);
