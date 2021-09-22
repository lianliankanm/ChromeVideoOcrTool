$(function () {


    let cuts = [];
    $('#full-screenshot').on('click', function () {
        // let cut = document.createElement("img");
        //与content通信 视频截图
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {//获取当前tab
            //向tab发送请求
            console.log(tab[0].id);
            chrome.tabs.sendMessage(tab[0].id, {greeting: "GetVideo"}, (response) => {

                document.getElementById("img").setAttribute("src", response.src);
                // console.log("response:  " + response.src);
                //制作原截图
                // cut.src = response.src;

                // console.log("width:  " + response.width);
                // console.log("height:  " + response.height);
                // cut.style.width = response.width + 'px';
                // cut.style.height = response.height + 'px';

                cuts.push(response.src);
                let n = cuts.length;
                $('#cut-num').html('识别当前视频中 '+ n +' 张画面的文字');
            });
        });
    });
    $('#clear').on('click', function () {
        //清空截图
        document.getElementById("img").setAttribute("src", "");
        cuts.length = 0;
        let n = cuts.length;
        $('#cut-num').html('识别当前视频中 '+ n +' 张画面的文字');
    });

    $('#undo').on('click', function () {
        //取消当前截图
        cuts.pop();
        // console.log(del);
        let n = cuts.length;
        let last = cuts[n-1];
        // console.log(last);
        document.getElementById("img").setAttribute("src", last);
        // document.getElementById("img").src= last.src;
        $('#cut-num').html('识别当前视频中 '+ n +' 张画面的文字');
    });

    $('#ocr').on('click', function () {
        //	调用background方法，识别文字
        let bg = chrome.extension.getBackgroundPage();//获取background页面
        for (let a = 0; a < cuts.length; a++){
            let base64 = encodeURI(cuts[a])
            // let base64 = encodeURI(cut.src);

            let result = bg.getOcr(base64)//调用background的变量或方法。
            console.log('client: ' + result);
            console.log(result.length);
            let str = "";
            // for(let p ; p < result.length; p++ ) {
            for (let p in result) {
                str += result[p].words + "\n";
                console.log(p + 'lines: ' + str);
            }

            let text = $('#textarea').text();
            $('#textarea').html(text + "\n" + str);
        }
    });
});

