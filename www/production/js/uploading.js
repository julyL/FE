/*
btn:    上传按钮的ID,  默认 pickfiles
container:                   pickfiles-w
addCallback         //添加图片时得到回调
uploadingCallback   //上传图片时得到回调
finishCallback      //上传完成的回调
failCallback        //失败的回调
*/

export default function uploading(option, getid) {
    var token, key, id;
    var Q = new QiniuJsSDK();
    //引入Plupload 、qiniu.js后
    var uploader = Q.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: option.btn || 'pickfiles', //上传选择的点选按钮，**必需**
        // uptoken: token,
        domain: 'http://ocrhwx2go.bkt.clouddn.com/', //bucket 域名，下载资源时用到，**必需**
        uptoken_func: function() {
            $.ajax({
                url: window.Origin + "/qiniu/token?is_public=1",
                async: false,
                type: "get",
                data:{
                    test:0
                },
                dataType: "json",
                // xhrFields: {
                //     withCredentials: true
                // },
                // crossDomain: true,
                success: function(data) {
                    token = data.data.uploadToken;
                    key = data.data.key;
                },
                error: function(data) {

                }
            });
            return token;
        },
        get_new_uptoken: true, //设置上传文件的时候是否每次都重新获取新的token
        container: option.container || 'pickfiles-w', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '20mb', //最大文件体积限制
        mime_types :{
            title : "Image files", extensions : "jpg,gif,png"
        },
        // flash_swf_url: '../assets/js/plugins/plupload/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        // drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '0', //分块上传时，每片的体积
        auto_start: option.auto_start || false, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        unique_names: false,
        save_key: false,
        resize: {
            width:750,
            crop: false,
            quality:80,
            // preserve_headers: false
        },
        init: {
            'FilesAdded': function(up, files) {
                for (var i = 0; i < files.length; i++) {
                    option.addCallback && option.addCallback(files[i]);
                }
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                option.uploadingCallback && option.uploadingCallback(file);

                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                // var domain = up.getOption('domain');
                // var res = parseJSON(info);
                // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                option.finishCallback && option.finishCallback(up, file, info);
                // console.log('success', up);
            },
            'Error': function(up, err, errTip) {
                option.failCallback && option.failCallback();
                //上传出错时,处理相关的事情
                // console.log('error', up);
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效

                // do something with key here
                return key;
            }
        }
    });
    return uploader;
}
