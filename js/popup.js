$(function () {


    let cuts = [];
    let flag = false;
    let videoCuts = [];
    let time = 0;
    $('#full-screenshot').on('click', function () {
        //与content通信 视频截图
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {//获取当前tab
            //向tab发送请求
            console.log(tab[0].id);
            chrome.tabs.sendMessage(tab[0].id, {greeting: "GetVideo"}, (response) => {

                document.getElementById("img").setAttribute("src", response.src);
                // console.log("response:  " + response.src);
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
            // console.log('client: ' + result);
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
    $('#switch').on('click', function () {
        if (flag===false){
            flag=true;
            $('#switch').html('停止');}
        else {
            flag=false;
            $('#switch').html('开始');
        }
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {//获取当前tab
            //向tab发送请求
            console.log(tab[0].id);
            chrome.tabs.sendMessage(tab[0].id, {greeting: "GetVideo"}, (response) => {
                document.getElementById("img").setAttribute("src", response.src);
            });
        });
        $('#video-req').html('识别截取视频片段： 共 '+ time +' 秒 ');
    });
    setInterval(function(){
        if(flag){
            chrome.tabs.query({active: true, currentWindow: true}, function (tab) {//获取当前tab
                //向tab发送请求
                console.log(tab[0].id);
                chrome.tabs.sendMessage(tab[0].id, {greeting: "GetVideo"}, (response) => {
                    videoCuts.push(response.src);
                    let n = videoCuts.length;
                    console.log('共有'+ n + '张截图');
                    time += 0.5;
                    console.log('截取视频'+ time + '秒');

                });
            });
        }

    },500)
    $('#clear-video').on('click', function () {
        //清空截图
        document.getElementById("img").setAttribute("src", "");
        videoCuts.length = 0;
        time = 0;
        $('#video-req').html('识别截取视频片段： 共 '+ time +' 秒 ');
    });
    $('#video-req').on('click', function () {
        let array =[];
        	//调用background方法，识别文字
        let bg = chrome.extension.getBackgroundPage();//获取background页面
        for (let a = 0; a < videoCuts.length; a++){
            let base64 = encodeURI(videoCuts[a])
            let result = bg.getOcr(base64)//调用background的变量或方法。
            console.log(result.length);
            // let str = "";
            for (let p in result) {
                array.push(result[p].words);
            }
        }
        // array =['10','9','8','9','7','11','12','11','14','1','2','3','2','8','0'];
        let result = noRepeat(array);
        let str = "";
        for (let item in result){
            str += result[item] + '\n';
        }
        $('#textarea').html(str);
    });
    function noRepeat(arr){
        var temp =[];
        console.log(arr);
        for(var i=0;i<arr.length;i++){
            if(temp.indexOf(arr[i]) == -1){
                temp.push(arr[i]);
            }
        }
        console.log(temp);
        return temp;
    }
    $('#clear-text').on('click', function () {
        $('#textarea').html('');
    });
    $('#save').on('click', function () {
        let str = $('#textarea').text();
        let text = [str];
        let blob = new Blob(text, {type: "text/plain;charset=utf-8"});
        saveAs(blob, "VideoOCR.txt");

    });

});

