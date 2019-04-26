(function($) {

    //定义global数组
    var Global = {
        section_name : [],
        isScrolling : true,
        section_num : 1
    };
    //封装函数
    Global.fadeInByOrder = function(selector,interval,callback){
        var i = 1,
            length = $(selector+' .fade').length + 1,
            intervala = interval || 100,
            callbacka = callback || function(){ return; };
    
        (function fadeInIt(){
            if ( i < length ) {
                $(selector+' .fade'+i).addClass('fade-in');
                i++;
                setTimeout( arguments.callee , intervala );
                if ( i === length) {
                    callbacka();
                }
            }
        })();
    };

    Global.throttle = function(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    };
    //给置顶
    Global.reCal = function(){
        //
        (function centerLoading() {
            //检查body中置顶元素
            if ( !$('body').hasClass('finish-loading') ) {
                //上边距到整个窗口的距离
                var topOffset = ( $(window).height() - 175 ) / 2  ,
                    leftOffset = ( $(window).width() - $('loading').width() ) / 2 - 60;
                //loading样式  
                $('.loading').css({
                    top: topOffset,
                    left: leftOffset,
                    right: 'auto',
                    bottom: 'auto'
                });
            }
        })();
    
        //setion下包裹的文字
        $('.section-wrap').each(function(index, el) {
            Global.section_name[index] = $(this).attr('class').substr(($(this).attr('class').indexOf('section-wrap ')+13));
            $(this).find('.section').height($(window).height());
        });
    
        //改变样式
        $('.section-content').each(function(){
            $(this).css({
                marginTop: ( $(window).height() - 40 - $(this).height() ) / 2
            });
        });
    
    };
    //鼠标背景滚动事件
    Global.fixedbg = function(){
        var slide_rate = 1000 / 667,
            window_rate;
        (function(){
            window_rate = $(window).width() / $(window).height();
            if ( window_rate < slide_rate ) {
                $('.home-bg img').css({height:$(window).height()+'px',width:($(window).height()*slide_rate)+'px','margin-left':'-'+($(window).height()*slide_rate-$(window).width())/2+'px'});
            }else{
                $('.home-bg img').css({height:($(window).width()/slide_rate)+'px',width:$(window).width()+'px','margin-left':0});
            }
        })();
    };

    Global.shrinkHeader = function(doShrink){
        if (doShrink) {
            $('.section-header').addClass('shrink');
        }else{
            $('.section-header').removeClass('shrink');
        }
    };
    //添加hover事件
    Global.fire_nav = function(theNav){
        //移除当前的hover事件
        $('.nav .fade').removeClass('hover');
        switch(theNav){
            case 2:
                $('.nav .fade1').addClass('hover');
                //并且停止循环
                break;
            case 3:
                $('.nav .fade4').addClass('hover');
                break;
            case 4:
                $('.nav .fade2').addClass('hover');
                break;
            case 5:
                $('.nav .fade3').addClass('hover');
                break;
        }
    };

    Global.scrollHandle = function(scrollDown){
        if (!Global.isScrolling) {
            
            Global.isScrolling = true;
            var targetScrollTopValue = scrollDown ? Global.targetScrollTop(++Global.section_num) : Global.targetScrollTop(--Global.section_num);
            
            if ( scrollDown ) {
                if ( Global.section_num > 1 ) {
                    Global.shrinkHeader(true);
                }
            }else{
                if ( Global.section_num === 1 ) {
                    Global.shrinkHeader(false);
                }
            }
            //添加滚动动画
            $('html,body').animate({scrollTop: targetScrollTopValue}, 600,function(){
                Global.isScrolling = false;
            });
            Global.fire_nav(Global.section_num);
        
        }
    };
    //滚动的页面的高度 每个section
    Global.targetScrollTop = function(n){
        if(n > Global.section_name.length){
            Global.section_num = Global.section_name.length;    
        }
        if(n < 1){
            Global.section_num = 1; 
        }
        return ($(window).height() * (Global.section_num - 1));
    };

    
    Global.handleTouchEvent = function(event){
        if (event.touches.length == 1) {
    
            var touchStartY,
                touchMoveY;
    
            switch (event.type) {
                case "touchstart":
                    touchStartY =  event.touches[0].clientY;
                    break;
                case "touchmove":
                    touchMoveY  =  event.changedTouches[0].clientY;
                    break;
            }
            Global.scrollHandle( touchStartY > touchMoveY ? true : false );
    
        }
        event.preventDefault();
    };
    
    
        //返回置顶
        $('.scroll-tip').click(function(event) {
            if(Global.section_num == 5){
                $('html,body').animate({scrollTop: 0}, 1000,function(){
                    Global.section_num =1
                 }); 
            }else{
                if (!Global.isScrolling) {
                    Global.isScrolling = true;
                    $('html,body').animate({scrollTop: Global.targetScrollTop(++Global.section_num)}, 400,function(){
                        Global.isScrolling = false;
                    });
                    if ( Global.section_num > 1 ) {
                        Global.shrinkHeader(true);
                    }
                }  
            }
    
        });

    
    $(window).load(function() {
    
        Global.fixedbg();
        Global.reCal();
        $('html,body').animate({scrollTop:0}, 100);
        Global.isScrolling = false;
    
        (function load_init(){
    
            //给body添加一个finish-loading类
    
            $("body").addClass('finish-loading');
            //给loading添加开始动画
            $('.finish-loading .loading').animate({top:"20px"},600,function(){
                //首页样式为透明
                $('.back-home').css('opacity',1);
                //移除该素=元素
                $('.loading').remove();
            });
    
            setTimeout(function(){
                //移除body所有的
                $('body').removeClass('loading-process');
            },600);
    
            Global.fadeInByOrder('.nav',100,function(){
                Global.fadeInByOrder('.section-fristpage',300);
            });
    
        })();
    
    });
    
    window.onscroll = Global.throttle(function(){
    
            $('body').removeClass('finish-loading');
            var fadeInTarget;
            switch(Global.section_num){
                case 1:
                    fadeInTarget = '.section-fristpage';
                    $('body').addClass('finish-loading');
                    break;
                case 2:
                    fadeInTarget = '.about-content';
                    break;
                case 3:
                    fadeInTarget = '.works-list';
                    break;
                case 4:
                    fadeInTarget = '.skill-content';
                    break;
                case 5:
                    fadeInTarget = '.contact-content';
                    break;
            }
    
            Global.fadeInByOrder(fadeInTarget,200);
    
        },50);
    
    //添加滚动事件
    $(document).on('mousewheel DOMMouseScroll', function(e){
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail,
            isMouseScrollDown = delta < 0 ? true : false;
    
     
        if (isMouseScrollDown) { //是否滚动到下边   
            Global.scrollHandle(true);
        }else{
    
            Global.scrollHandle(false);
    
        }  
        e.preventDefault();
    });   
    })(jQuery);
