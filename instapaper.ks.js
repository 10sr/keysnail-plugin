var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>instapaper</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/instapaper.ks.js</updateURL>
    <description>Post current page to instapaper</description>
    <version>0.3.3</version>
    <author mail="" homepage="http://10sr.github.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.8.3</minVersion>
    <include>main</include>
    <detail><![CDATA[
        === Usage ===
    ]]></detail>
    </KeySnailPlugin>;

function postWithComment(tab){
  var cmfunc = plugins.options["instapaper.initial_comment_function"] ||
      function(){
        return "";
      };
  prompt.reader({
    message : "Instapaper comment:",
    initialInput : content.document.getSelection() + cmfunc(),
    callback : function(cm){ postTab(tab, cm); }
  });
}

function postTab(tab, cm){
  var url = tab.linkedBrowser.contentWindow.location.href;
  var title = tab.label;
  var username = "";
  var password = "";
  var passwordManager = (Cc["@mozilla.org/login-manager;1"].
                         getService(Ci.nsILoginManager));
  var logins = passwordManager.findLogins({}, "https://www.instapaper.com",
                                          "", null);
  for (var i = 0; i < logins.length; i++) {
    if (logins[i].username != "") {
      username = logins[i].username;
      password = logins[i].password;
      break;
    }
  }

  display.echoStatusBar("Instapaper: adding \"" + url + "\"...");
  util.requestGet("https://www.instapaper.com/api/add", {
    params : {
      // username : encodeURIComponent(username),
      // password : encodeURIComponent(password),
      url : encodeURIComponent(url),
      title : encodeURIComponent(title),
      selection : encodeURIComponent(cm)
    },
    header : {
      Authorization : "Basic " + window.btoa(username + ":" + password)
    },
    callback : function(xhr){
      display.echoStatusBar(xhr.status);
      if (xhr.readyState === 4 && Math.floor(xhr.status / 100) === 2) {
        try {
        display.showPopup("Instapaper", "Page \"" + title +
                          "\" added successfully.");
        } catch (e) {
          // ad-hoc fix for windows which throws error on showPopup
        }
        display.echoStatusBar("Instapaper: adding \"" + url +
                              "\"...done.");
        plugins.options["instapaper.close_after_post"] &&
          gBrowser.removeTab(tab);
      }else{
        display.showPopup(
          "Instapaper",
          xhr.status.toString() + " " + xhr.statusText
        );
        gBrowser.selectedTab = gBrowser.addTab(
          "http://www.instapaper.com/edit?url=" +
            encodeURIComponent(url) +
            "&title=" + encodeURIComponent(title) +
            "&summary=" + encodeURIComponent(cm)
        );
      }
    },
  });
}

plugins.withProvides(function (provide) {
  provide("instapaper-post-page", function(){
    postTab(gBrowser.selectedTab, "");
  }, "post page");
  provide("instapaper-post-page-with-comment", function(){
    postWithComment(gBrowser.selectedTab);
  }, "post page and comment");
}, PLUGIN_INFO);
