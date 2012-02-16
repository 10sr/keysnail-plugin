var PLUGIN_INFO =
<KeySnailPlugin>
    <name>shiitake stop</name>
    <name lang="ja">中止ボタンがしいたけに見えて困る</name>
    <description>You should take a little rest!</description>
    <description lang="ja">少し休んでみては…？</description>
    <version>0.3.3</version>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/shiitake.ks.js</updateURL>
    <author homepage="http://10sr.jottit.com">10sr</author>
    <iconURL>https://github.com/10sr/keysnail-plugin/raw/master/shiitake.png</iconURL>
    <provides> <ext>shiitake-toggle-style</ext><ext>shiitake-enable-style</ext><ext>shiitake-disable-style</ext> </provides>
    <license>MPL 1.1</license>
    <license lang="ja">MPL 1.1</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
=== Usage ===

    How about having a coffee break?

    To enable plugin just add to hook.

>||
hook.addToHook("KeySnailInitialized",
               function () {
                   ext.exec("shiitake-enable-style");
               });
||<

    Thanks https://addons.mozilla.org/ja/firefox/addon/4298/
    ]]></detail>
    <detail lang="ja"><![CDATA[
=== 使い方 ===

    つ旦


    以下のようにフックかけるといいと思います

>||
hook.addToHook("KeySnailInitialized",
               function () {
                   ext.exec("shiitake-enable-style");
               });
||<

    感謝→ https://addons.mozilla.org/ja/firefox/addon/4298/
    ]]></detail>
</KeySnailPlugin>;

var shiitakeStyle = <><![CDATA[
#stop-button,
#button-stop {
list-style-image: url("data:image/png;base64,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") !important;
	-moz-image-region: rect(0px 24px 24px 0px) !important;
}
#stop-button[disabled="true"],
#button-stop[disabled="true"] {
	-moz-image-region: rect(0px 48px 24px 24px) !important;
}
toolbar[iconsize="small"] #stop-button,
toolbar[iconsize="small"] #button-stop {
	-moz-image-region: rect(24px 16px 40px 0px) !important;
}
toolbar[iconsize="small"] #stop-button[disabled="true"],
toolbar[iconsize="small"] #button-stop[disabled="true"] {
	-moz-image-region: rect(24px 32px 40px 16px) !important;
}
]]></>.toString();

ext.add("shiitake-toggle-style",
        function(){
            style.toggle(shiitakeStyle);
        }, "toggle shiitake style");

ext.add("shiitake-enable-style",
        function(){
            style.register(shiitakeStyle);
        }, "enable shiitake style");

ext.add("shiitake-disable-style",
        function(){
            style.unregister(shiitakeStyle);
        }, "disable shiitake style");

hook.addToHook('KeySnailInitialized', function () {
    ext.exec("shiitake-enable-style");
});
