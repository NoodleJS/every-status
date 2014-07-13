(function(win){
    var LIMIT = 100;
    var btn = document.createElement("img");

    btn.src="http://huixiang.im/static/img/huixiang_48.png";
    btn.style.borderRadius = "4px";
    btn.style.width = "24px";
    btn.style.height = "24px";
    btn.style.position = "absolute";
    btn.style.backgroundColor = "#d5c5b0";
    btn.style.padding = "2px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "inset 0 0 5px #999";

    function trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    function openWin(obj){
        win.open(obj.url,obj.id,[
            "height="+obj.height,
            "width="+obj.width,
            "top=200",
            "left=200"])
    }

    function toQueryString(obj){
        var pairs = [];
        for(var key in obj){
            pairs.push(key+"="+obj[key]);
        }
        return pairs.join("&");
    }

    function getSelectionText() {
        // http://snipplr.com/view/10912/get-html-of-selection/
        var userSelection = window.getSelection(),
            range,cloneSelection,div;
        if (userSelection.isCollapsed)
            return '';
        else {
            range = userSelection.getRangeAt(0);
            clonedSelection = range.cloneContents();
            div = document.createElement('div');
            div.appendChild(clonedSelection);
            return trim(div.innerText);
        }
    }

    function createPiece(text){

        hideBtn();

        query = {
            "title":encodeURIComponent(text),
            "url":encodeURIComponent(location.href)
        }

        openWin({
            url:"http://huixiang.im/bookmarklet?"+toQueryString(query),
            width:350,
            height:174
        });
    }

    function showBtn(e){
        btn.style.top = e.pageY + 20 + "px";
        btn.style.left = e.pageX + 20 + "px";
        btn.style.display = "block";
    }

    function hideBtn(e){
        btn.style.display = "none";
    }


    function determine(text){
        if(!text || text.length > LIMIT){
            if(text.length > LIMIT){
                showHint("茴香不支持"+LIMIT+"字以上的句子");
            }
            return false;
        }else{
            return true;
        }
    }

    function getAndDetermine(){
        var text = getSelectionText();
        if(determine(text)){
            createPiece(text);
        }else{
            showHint("插件已加载，现在可以选择文字来摘录咯。");
        }
    }

    function showHint(text){
        var hint,
            id = "_huixiang_hint";

        hint = document.getElementById(id);
        if(!hint){
            hint = document.createElement("div");
            hint.setAttribute("id",id);
            hint.style.cssText = "background-color:rgb(249, 213, 19);"
            +"color:#333;"
            +"padding:8px;"
            +"position:fixed;"
            +"top:0;"
            +"left:0;"
            +"z-index:99999;"
            +"font-size:12px;";
            document.body.appendChild(hint);
        }

        hint.innerHTML = text;
        setTimeout(function(){
            document.body.removeChild(hint);
        },3000);
    }


    document.body.appendChild(btn);
    hideBtn();
    getAndDetermine();
    btn.onclick = getAndDetermine;


    document.onmouseup = function(e){
        var text = getSelectionText();
        if(determine(text)){
            showBtn(e);
        }else{
            hideBtn();
        }
    };
})(window);