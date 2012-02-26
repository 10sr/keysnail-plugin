var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>Dig-url</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/dig-url.ks.js</updateURL>
    <description>dig url (or go up directory)</description>
    <version>0.2</version>
    <author mail="" homepage="http://10sr.jottit.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Overview ===
            Dig current url.
            For example, when viewing http://example.com/foo/bar you can go up to http://example.com/foo or http://example.com.
            ]]></detail>
    </KeySnailPlugin>;

function dig(){
    var url = window.content.location.href.replace(/\/$/, "");
    var re = plugins.options["dig_url.separater_regexp"] || /(\/|#|\?)/;          // paren cannot be removed!
    var durl = [url];
    var elem = url.split(re);
    for(var i = elem.length - 1; i > 4; i--){
        if (elem[i-1].match(re) || elem[i-1] == ""){ continue; }
        durl.push(elem.slice(0, i).join(""));
    }
    prompt.selector({ message : "dig " + url,
                      collection : durl,
                      callback : function (i) { window.content.location.href = durl[i]; },
                    });
}

plugins.withProvides(function (provide) {
    provide("dig-url", dig, "dig url with selector");
}, PLUGIN_INFO);
