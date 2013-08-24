var PLUGIN_INFO =
<KeySnailPlugin>
    <name>pixiv autojump</name>
    <description>auto jump on pixiv page</description>
    <version>0.1</version>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/pixiv_autojump.ks.js</updateURL>
    <author homepage="http://10sr.github.com">10sr</author>
    <license>NYSL</license>
    <license lang="ja">MPL 1.1</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
=== Usage ===

    pixiv auto jump.

    ]]></detail>
</KeySnailPlugin>;

hook.addToHook('LocationChange', function (aNsURI) {
    const P_RX = /^http:\/\/www\.pixiv\.net\/jump\.php\?/;
    if (P_RX.test(aNsURI.spec)) {
        window.content.location.href =
            decodeURIComponent(aNsURI.spec.replace(P_RX, ""));
    }
});
