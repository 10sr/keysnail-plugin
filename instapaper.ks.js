var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>instapaper</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/dig-url.ks.js</updateURL>
    <description>dig url</description>
    <version>0.1</version>
    <author mail="" homepage="http://10sr.jottit.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Usage ===
            Dig current url (or go up directory).
            For example, when viewing http://example.com/foo/bar you can go up to http://example.com/foo or http://example.com.
            ]]></detail>
    </KeySnailPlugin>;

function comment(tab){
    prompt.read("Instapaper comment:", function(cm){ post(tab, cm); });
}

function post(tab, cm){
    // var tab = gBrowser.selectedTab;
    var url = tab.linkedBrowser.contentWindow.location.href;
    var title = tab.label;
    var username = "8slashes+instapaper@gmail.com";
    var password = "";
    var passwordManager = (Cc["@mozilla.org/login-manager;1"].getService(Ci.nsILoginManager));
    var logins = passwordManager.findLogins({}, "http://www.instapaper.com", "", null);
    for (var i = 0; i < logins.length; i++) {
        if (logins[i].username == username) {
            password = logins[i].password;
            break;
        }
    }

    display.echoStatusBar("Instapaper: adding " + url + "...");
    util.httpPost("https://www.instapaper.com/api/add",
                  {
                      "username" : encodeURIComponent(username),
                      "password" : password,
                      "url" : encodeURIComponent(url),
                      "title" : encodeURIComponent(title),
                      "selection" : encodeURIComponent(cm),
                  },
                  function (xhr) {
                      display.echoStatusBar(xhr.status);
                      if (xhr.readyState == 4 && xhr.status == 201) {
                          // var title = decodeURIComponent(xhr.getResponseHeader("X-Instapaper-Title")); //超文字化けする
                          // try {
                          //     Components.classes['@mozilla.org/alerts-service;1'].
                          //         getService(Components.interfaces.nsIAlertsService).
                          //         showAlertNotification(null, "Instapaper", "Page " + title + " added successfully", false, '', null);
                          // } catch(e) {
                          //     // prevents runtime error on platforms that don't implement nsIAlertsService
                          // }
                          display.showPopup(Instapaper, "Page " + title + " added successfully.");
                          display.echoStatusBar("Instapaper: adding " + url + "...done.");
                          gBrowser.removeTab(tab);
                      } else{
                          display.echoStatusBar("Instapaper: Something wrong has happended!");
                          if (window.loadURI) {
                              loadURI("javascript:function%20iprl5(){var%20d=document,z=d.createElement('scr'+'ipt'),b=d.body,l=d.location;try{if(!b)throw(0);d.title='(Saving...)%20'+d.title;z.setAttribute('src',l.protocol+'//www.instapaper.com/j/mt8YO6Cuosmf?u='+encodeURIComponent(l.href)+'&t='+(new%20Date().getTime()));b.appendChild(z);}catch(e){alert('Please%20wait%20until%20the%20page%20has%20loaded.');}}iprl5();void(0)");
                          }
                      }
                  });
}

plugins.withProvides(function (provide) {
    provide("instapaper-post-page", function(){
        post(gBrowser.selectedTab, "");
    }, "post page");
    provide("instapaper-post-page-with-comment", function(){
        comment(gBrowser.selectedTab);
    }, "post page and comment");
}, PLUGIN_INFO);
