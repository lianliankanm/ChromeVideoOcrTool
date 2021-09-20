

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

function getOcr(file){
    let url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic";
    let access_token = '24.b991adcf60577aed049a443d00edf3ef.2592000.1634560588.282335-24874738';
    // let formData = new FormData();
    // formData.append("image",file);
    // formData.append('language_type','CHN_ENG');
    let result = '';
    $.ajax({
        async:false,
        contentType: 'application/x-www-form-urlencoded',
        type:"post",
        url:url + "?access_token=" + access_token,
        // data : `image=${file}&language_type=CHN_ENG`,
        data : {'image':file,'language_type':'CHN_ENG'},
        success:function(response){

            // result = JSON.stringify(response.words_result);
            result = response.words_result;
            console.log(result,length);

            // let str = "";
            // $.each(result,function (k,v) {
            //         str += v+"\n";
            // });
            // $('#textarea').html(str);


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