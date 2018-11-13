var Game = function(){
    this.option = {
        id : "",
        url : ""
    };
    this.last = null;
    this.row = undefined;
    this.col = undefined;
    this.enabled = true;
    this.init = function(row,col){
        var _this = this;
        _this.row = row;
        _this.col = col;

        function loadui(game,img){
            var main = document.getElementById(game.option.id);
            if(main==null){
                return;
            }
            main.style.width = img.width+"px";
            main.style.height = img.height+"px";
            var height = main.clientHeight/row;
            var width = main.clientWidth/col;
            var arr = [];
            var tmpI = 0;
            for(var i=0;i<row;i++){
                for(var j=0;j<col;j++){
                    var posLeft = -width*j;
                    var posTop = -height*i;
                    arr.push('<div class="kuai" index="'+tmpI+'" style="width:'+width+'px;height:'+height+'px;background:url('+game.option.url+') '+posLeft+'px '+posTop+'px"></div>');
                    tmpI++;
                }
            }
            main.innerHTML = arr.join("");
            var list = main.getElementsByTagName("div");
            game.random(list);
            game.click(list);
        }

        var img = new Image();
        img.src = this.option.url;
        if(img.width==0){
            img.onload = function(){
                loadui(_this,img);
            }
        }else{
            loadui(_this,img);
        }
    };

    this.random = function(list){
        var len = list.length;
        var m = Math;

        for(var i=0;i<len/2;i++){
            var rNum1 = parseInt(m.random()*len);
            var rNum2 = parseInt(m.random()*len);
            var r1Obj = list[rNum1];
            var r2Obj = list[rNum2];
            r1Obj.parentNode.insertBefore(r1Obj,r2Obj);
        }
        this.last = list[len-1];
        this.last.style.visibility = "hidden";
    };

    this.click = function(list){
        var len = list.length;
        var game = this;
        for(var i=0;i<len;i++){
            list[i].newIndex = i;
            list[i].onclick = function(){
                if(!game.enabled){
                    return false;
                }
                var index = this.getAttribute("index");
                var newIndex = this.newIndex;
                var col = game.col;
                var lObj,rObj,tObj,bObj;
                if(newIndex-1>=0){
                    lObj = list[newIndex-1];
                }
                if(newIndex+1<len){
                    rObj = list[newIndex+1];
                }
                if(newIndex-col>=0){
                    tObj = list[newIndex-col];
                }
                if(newIndex+col<len){
                    bObj = list[newIndex+col];
                }
                var math = Math;

                if(rObj && rObj.style.visibility=="hidden" && math.ceil((newIndex+1)/game.col) == math.ceil((rObj.newIndex+1)/game.col)){ //������
                    var tmpIndex = this.newIndex;
                    this.newIndex = rObj.newIndex;
                    rObj.newIndex = tmpIndex;
                    rObj.parentNode.insertBefore(rObj,this);
                }else if(lObj && lObj.style.visibility=="hidden" && math.ceil((newIndex+1)/game.col) == math.ceil((lObj.newIndex+1)/game.col)){ //������
                    var tmpIndex = this.newIndex;
                    this.newIndex = lObj.newIndex;
                    lObj.newIndex = tmpIndex;
                    lObj.parentNode.insertBefore(this,lObj);
                }else if(bObj && bObj.style.visibility=="hidden"){
                    var tmpIndex = this.newIndex;
                    bObj.parentNode.insertBefore(bObj,list[tmpIndex+1]);
                    bObj.parentNode.insertBefore(this,list[bObj.newIndex]);
                    bObj.parentNode.insertBefore(list[bObj.newIndex],this);
                    this.newIndex = bObj.newIndex;
                    bObj.newIndex = tmpIndex;
                }else if(tObj && tObj.style.visibility=="hidden"){
                    var tmpIndex = this.newIndex;
                    tObj.parentNode.insertBefore(this,list[tObj.newIndex]);
                    tObj.parentNode.insertBefore(tObj,list[tmpIndex]);
                    tObj.parentNode.insertBefore(list[tmpIndex],tObj);
                    this.newIndex = tObj.newIndex;
                    tObj.newIndex = tmpIndex;
                }
                if(game.isSuccess(list)){
                    game.enabled = false;
                    alert("good game!");
                    game.last.style.visibility = "visible";
                    game.animate(game.last,{
                        opacity : 0
                    },{
                        opacity : 1
                    },500);
                }
            }
        }
    };

    this.animate = function(elt,p1,p2,speed){

    };

    this.isSuccess = function(list){
        var len = list.length;
        var bl = true;
        for(var i=0;i<len;i++){
            var o = list[i];
            if(o.newIndex!=o.getAttribute("index")){
                bl = false;
                break;
            }
        }
        return bl;
    };
}

onload = function(){
    var game1 = new Game();
    game1.option = {
        id : "main1",
        url : "mirai.jpg"
    }
    game1.init(3,4);
};