

(function(){
    function translate(word){
        const base = "https://www.googleapis.com/language/translate/v2?key=%s&q=%s&source=%s&target=%s";
        const apikey = "AIzaSyBq48p8NhFgaJ1DfUJ5ltbwLxeXpjEL86A";
        let ep = util.format(base, apikey, word, "en", "ja");
        let res = util.httpGet(eq);
        let result = "";
        if (res.readyState == 4 && res.status == 200) {
            let json = decodejson(res.responseText);
            result = json.data.translations[0].translatedText;
        }else{
            result = "ERROR!";
        }
        return result;
    };
    function echo(from, to){
        statusbar.label = from + to;
    };
    function decodejson(json) {
        return util.safeEval("(" + json + ")");
    };
    function cb(s){
        return;
    }
    function read(aInitialInput){
        prompt.reader({
            message: "word to translate:",
            initialinput: aInitialInput,
            onChange: function (arg) {
                var word = arg.textbox.value;
                var result = translate(word);
                echo(word, result);
            },
            callback: cb,
        });
    };
    ext.add("google-itranslate",read,"google itranslate");
})();
