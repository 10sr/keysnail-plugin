var PLUGIN_INFO =
<KeySnailPlugin>
    <name>twicli</name>
    <name lang="ja">twicli</name>
    <description>twicli plugin</description>
    <description lang="ja">twicli plugin</description>
    <version>0.1</version>
    <updateURL>http://github.com/mooz/keysnail/raw/master/plugins/hello-plugin.ks.js</updateURL>
    <iconURL>http://github.com/mooz/keysnail/raw/master/plugins/icon/hello-plugin.icon.png</iconURL>
    <require>
        <script>http://twicli.neocat.jp/twicli.js</script>
        <script>http://twicli.neocat.jp/array.js</script>
        <script>http://twicli.neocat.jp/lang.js</script>
    </require>
    <author mail="stillpedant@gmail.com" homepage="http://d.hatena.ne.jp/mooz/">mooz</author>
    <license>The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
=== Usage ===
Nothing.
    ]]></detail>
    <detail lang="ja"><![CDATA[
=== 使い方 ===
なし。
    ]]></detail>
</KeySnailPlugin>;

(function(){
    userscript.require("twicli.js", this);
    userscript.require("lang.js", this);
    userscript.require("array.js", this);
    var twicliSwitchTL = function (){
        switchTL();
    }
    plugins.withProvides(function (provide) {
        provide("twicli-switchTL", twicliSwitchTL, "switch to tl");
    }, PLUGIN_INFO);
})();

