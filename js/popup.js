$(function () {

    let cut = document.createElement("img");

    $('#full-screenshot').on('click', function () {
        //与content通信 视频截图
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {//获取当前tab
            //向tab发送请求
            console.log(tab[0].id);
            chrome.tabs.sendMessage(tab[0].id, {greeting: "GetVideo"}, (response) => {
                // console.log("response:  " + response.src);
                document.getElementById("img").setAttribute("src", response.src);

                //制作原截图
                cut.src = response.src;
                console.log("width:  " + response.width);
                console.log("height:  " + response.height);
                cut.style.width = response.width + 'px';
                cut.style.height = response.height + 'px';
                // document.getElementById("screenshot").append(img);

            });
        });

    });

    $('#ocr').on('click', function () {
        //	调用background方法，识别文字
        let bg = chrome.extension.getBackgroundPage();//获取background页面

        let base64 = encodeURI(cut.src.split(",")[1])
        // let base64 = encodeURI(cut.src);

        let result = bg.getOcr(base64)//调用background的变量或方法。
        console.log('client: '+result);
        console.log(result.length);
        let str = "";
        // for(let p ; p < result.length; p++ ) {
        for(let p in result) {
            str += result[p].words +"\n";
            console.log(p + 'lines: '+ str);
        };
        $('#textarea').html(str);
    });
});

