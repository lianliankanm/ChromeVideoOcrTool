// Page action条件：页面中含有video标签
chrome.runtime.onInstalled.addListener(function() {
    	  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        	    chrome.declarativeContent.onPageChanged.addRules([{
            	      conditions: [
            	        // When a page contains a <video> tag...
            	        new chrome.declarativeContent.PageStateMatcher({
                	          css: ["video"]
                })
        	      ],
        	      // ... show the page action.
       	      actions: [new chrome.declarativeContent.ShowPageAction() ]
        	    }]);
        	  });
    	});

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

// 调用服务器后端接口发送文字识别请求
    function getOcr(file){
        let url = "http://10.112.255.201:5000/video/byFile";
        let result = '';
        $.ajax({
            async:false,
            contentType: 'application/x-www-form-urlencoded',
            type:"post",
            url:url,
            data : {'image':file},
            success:function(response){

                result = JSON.stringify(response.words_result);
                // result = response.words_result;
                console.log(result,length);
            },
            error:function(e){
                //失败执行
                console.log(e.status+','+ e.statusText);
                result = '识别失败';

            }
        })
        console.log('server: '+result);
        return result;
    }


// 调用百度ocr接口发送文字识别请求
// function getOcr(file){
//     let url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
//     let access_token = '24.fa61d507ac3931d11a74856d764db2a9.2592000.1637293103.282335-24874738';
//
//
//     let result = '';
//     $.ajax({
//         async:false,
//         contentType: 'application/x-www-form-urlencoded',
//         type:"post",
//         url:url + "?access_token=" + access_token,
//         // data : `image=${file}&language_type=CHN_ENG`,
//         data : {'image':file,'language_type':'CHN_ENG'},
//         success:function(response){
//
//             // result = JSON.stringify(response.words_result);
//             result = response.words_result;
//             console.log(result,length);
//         },
//         error:function(e){
//             //失败执行
//             console.log(e.status+','+ e.statusText);
//             result = '识别失败';
//
//         }
//     })
//     console.log('server: '+result);
//     return result;
//
// }