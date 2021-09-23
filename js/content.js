
chrome.runtime.onMessage.addListener(//监听扩展程序进程或内容脚本发送的请求
    (message, sender, sendResponse)=> {
        console.log(message.greeting);
        if (message.greeting === "GetVideo") {
            console.log("getVideo");
            let video = document.getElementsByTagName("video")[0];
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            // console.log(video.videoWidth);
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            sendResponse({src:canvas.toDataURL()});

        }
        return true;
    }
);