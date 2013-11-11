var PLUGIN_INFO =
<KeySnailPlugin>
    <name>shiitake stop</name>
    <name lang="ja">中止ボタンがしいたけに見えて困る</name>
    <description>You should take a little rest!</description>
    <description lang="ja">少し休んでみては…？</description>
    <version>0.3.3</version>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/shiitake.ks.js</updateURL>
    <author homepage="http://10sr.github.com">10sr</author>
    <iconURL>https://github.com/10sr/keysnail-plugin/raw/master/shiitake.png</iconURL>
    <provides> <ext>feedicon-toggle-style</ext><ext>feedicon-enable-style</ext><ext>feedicon-disable-style</ext> </provides>
    <license>MPL 1.1</license>
    <license lang="ja">NYSL</license>
    <minVersion>1.0</minVersion>
    <include></include>
    <detail><![CDATA[
=== Usage ===

    How about having a coffee break?

    Thanks https://addons.mozilla.org/ja/firefox/addon/4298/
    ]]></detail>
    <detail lang="ja"><![CDATA[
=== 使い方 ===

    つ旦

    感謝→ https://addons.mozilla.org/ja/firefox/addon/4298/
    ]]></detail>
</KeySnailPlugin>;

var feedIconStyle = <><![CDATA[
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);



/* Remove button shape and place in the location bar */

#urlbar-container + #feed-button,

#urlbar-container + #reload-button + #stop-button + #feed-button {

  -moz-appearance: none !important;

  border: 0 !important;

  background: white !important;

  box-shadow: white -10px 0 7px -2px !important;

  padding: 0 0 0 0px !important;

  margin: 4px 42px 4px -60px !important;

  position: fixed !important;

  z-index: 1 !important;

}

#urlbar-container + #reload-button + #stop-button + #feed-button {

  margin: 4px 64px 4px -82px !important;

}



/* Hover effect */

#urlbar-container + #feed-button:not(:hover) > image,

#urlbar-container + #reload-button + #stop-button + #feed-button:not(:hover) > image {

  opacity: 0.5;

}

#urlbar-container + #feed-button:not([disabled="true"]):not(:active):hover > image,

#urlbar-container + #reload-button + #stop-button + #feed-button:not([disabled="true"]):not(:active):hover > image {

  -moz-transition: opacity .3s ease-in;

}



/* Hide when no feeds */

#urlbar-container + #feed-button[disabled="true"],

#urlbar-container + #reload-button + #stop-button + #feed-button[disabled="true"] {

  display: none !important;

}



/* Hide when showing link preview */

#urlbar {

  position: relative !important;

  z-index: 0 !important;

}

#urlbar[overlinkstate]:not([overlinkstate="fade-out"]) {

  z-index: 2 !important;

}
              ]]></>.toString();

ext.add("feedicon-toggle-style",
        function(){
            style.toggle(feedIconStyle);
        }, "toggle shiitake style");

ext.add("feedicon-enable-style",
        function(){
            style.register(feedIconStyle);
        }, "enable shiitake style");

ext.add("feedicon-disable-style",
        function(){
            style.unregister(feedIconStyle);
        }, "disable shiitake style");

hook.addToHook('KeySnailInitialized', function () {
    ext.exec("feedicon-enable-style");
});
